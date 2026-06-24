import asyncio
from fastapi import APIRouter, HTTPException
from app.schemas.response import APIResponse
from app.schemas.github import AnalyzeRequest, RepositoryData
from app.services.github import GithubService
from app.ultis.github import parse_github_url

router = APIRouter(prefix="/api/repository", tags=["Repository"])
github_service = GithubService()

@router.post("/analyze", response_model=APIResponse[RepositoryData])
async def analyze_repository(request: AnalyzeRequest):
    try:
        owner, repo = parse_github_url(request.url)
    except ValueError as e:
        return APIResponse(success=False, message=str(e))
    
    try:
        info = await github_service.get_repository_info(owner, repo)

        readme, languages, tree, dependencies = await asyncio.gather(
            github_service.get_readme(owner, repo),
            github_service.get_languages(owner, repo),
            github_service.get_tree(owner, repo, info.default_branch),
            github_service.get_dependencies(owner, repo)
        )

        data = RepositoryData(
            info=info,
            readme=readme,
            tree=tree,
            languages=languages,
            dependencies=dependencies
        )

        return APIResponse(success=True, data=data)
    
    except HTTPException as e:
        return APIResponse(success=False, message=e.detail)
    
    except Exception as e:
        return APIResponse(success=False, message=f"Lỗi hệ thống: {str(e)}")