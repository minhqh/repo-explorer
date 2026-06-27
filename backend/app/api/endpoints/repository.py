import asyncio
from typing import Optional
from fastapi import APIRouter, HTTPException, Header
from app.schemas.response import APIResponse
from app.schemas.github import AnalyzeRequest, RepositoryData
from app.services.github import GithubService
from app.ultis.github import parse_github_url
from app.ultis.health_scorer import RepoHealthScorer

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

        readme, languages, tree, git_stats = await asyncio.gather(
            github_service.get_readme(owner, repo, token),
            github_service.get_languages(owner, repo, token),
            github_service.get_tree(owner, repo, info.default_branch, token),
            github_service.get_git_stats(owner, repo, token),
        )


        dependencies, markdown_files = await asyncio.gather(
            github_service.get_dependencies(owner, repo, tree, token),
            github_service.get_important_markdowns(owner, repo, tree, token)
        )

        health_score = RepoHealthScorer.calculate_score(tree)

        data = RepositoryData(
            info=info,
            readme=readme,
            tree=tree,
            languages=languages,
            dependencies=dependencies,
            git_stats=git_stats,
            markdown_files=markdown_files,
            health_score=health_score,
        )

        return APIResponse(success=True, data=data)

    except HTTPException as e:
        return APIResponse(success=False, message=e.detail)

    except Exception as e:
        return APIResponse(success=False, message=f"Lỗi hệ thống: {str(e)}")

@router.get("/commits")
async def get_more_commits(
    owner: str, 
    repo: str, 
    page: int = 2, 
    authorization: Optional[str] = Header(None)
):
    token = authorization.replace("Bearer ", "").strip() if authorization and authorization.startswith("Bearer ") else None
    try:
        commits_data = await github_service.get_commits_page(owner, repo, page, token)
        
        # Tận dụng lại utils để parse ra model gọn gàng
        from app.ultis.git_stats import calculate_git_statistics
        stats = calculate_git_statistics(commits_data)
        
        return APIResponse(success=True, data=stats.recent_commits)
    except Exception as e:
        return APIResponse(success=False, message=str(e))