import asyncio
from typing import Optional
from fastapi import APIRouter, HTTPException, Header
from app.schemas.response import APIResponse
from app.schemas.github import AnalyzeRequest, RepositoryData
from app.services.github import GithubService
from app.ultis.github import parse_github_url

router = APIRouter(prefix="/api/repository", tags=["Repository"])
github_service = GithubService()


@router.post("/analyze", response_model=APIResponse[RepositoryData])
async def analyze_repository(
    request: AnalyzeRequest, authorization: Optional[str] = Header(None)
):
    try:
        owner, repo = parse_github_url(request.url)
    except ValueError as e:
        return APIResponse(success=False, message=str(e))

    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")

    try:
        info = await github_service.get_repository_info(owner, repo, token)

        readme, languages, tree, dependencies, git_stats = await asyncio.gather(
            github_service.get_readme(owner, repo, token),
            github_service.get_languages(owner, repo, token),
            github_service.get_tree(owner, repo, info.default_branch, token),
            github_service.get_dependencies(owner, repo, token),
            github_service.get_git_stats(owner, repo, token),
        )

        data = RepositoryData(
            info=info,
            readme=readme,
            tree=tree,
            languages=languages,
            dependencies=dependencies,
            git_stats=git_stats,
        )

        return APIResponse(success=True, data=data)

    except HTTPException as e:
        return APIResponse(success=False, message=e.detail)

    except Exception as e:
        return APIResponse(success=False, message=f"Lỗi hệ thống: {str(e)}")
