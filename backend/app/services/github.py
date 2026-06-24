import httpx
from fastapi import HTTPException
from app.core.config import settings
from app.schemas.github import RepoInfo, RepoTreeItem

class GithubService:
    def __init__(self):
        self.base_url = "https://api.github.com"
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "Milynx-Repo-Explorer"
        }
        if settings.GITHUB_TOKEN:
            self.headers["Authorization"] = f"Bearer {settings.GITHUB_TOKEN}"

    async def get_repository_info(self, owner: str, repo: str) -> RepoInfo:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/repos/{owner}/{repo}",
                headers=self.headers
            )
            if response.status_code == 404:
                raise HTTPException(status_code=404, detail="Repository not found")
            response.raise_for_status()

            data = response.json()
            return RepoInfo(
                owner=data["owner"]["login"],
                name=data["name"],
                description=data.get("description"),
                stars=data["stargazers_count"],
                forks=data["forks_count"],
                language=data.get("language"),
                topics=data.get("topics", []),
                default_branch=data.get("default_branch", "main")
            )
    
    async def get_readme(self, owner: str, repo: str) -> str:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/repos/{owner}/{repo}/readme",
                headers={"Accept": "application/vnd.github.raw+json", **self.headers}
            )
            if response.status_code == 404:
                return ""
            response.raise_for_status()
            return response.text
        
    async def get_languages(self, owner: str, repo: str) -> dict:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/repos/{owner}/{repo}/languages",
                headers=self.headers
            )
            if response.status_code == 404:
                return {}
            response.raise_for_status()
            return response.json()
        
    async def get_tree(self, owner: str, repo: str, default_branch: str) -> list[RepoTreeItem]:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/repos/{owner}/{repo}/git/trees/{default_branch}?recursive=1",
                headers=self.headers
            )
            if response.status_code == 404:
                return []
            response.raise_for_status()
            data = response.json()
            
            return [RepoTreeItem(**item) for item in data.get("tree", [])]