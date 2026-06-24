import json
import re
import httpx
from fastapi import HTTPException
from app.core.config import settings
from app.schemas.github import RepoInfo
from app.ultis.github import build_tree_structure
from app.ultis.colors import calculate_language_stats

class GithubService:
    def __init__(self):
        self.base_url = "https://api.github.com"
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "Milynx-Repo-Explorer"
        }
        if settings.GITHUB_TOKEN:
            self.headers["Authorization"] = f"Bearer {settings.GITHUB_TOKEN}"
        self.client = httpx.AsyncClient(
            headers=self.headers, 
            follow_redirects=True,
            timeout=10.0 
        )

    async def get_repository_info(self, owner: str, repo: str) -> RepoInfo:
        response = await self.client.get(f"{self.base_url}/repos/{owner}/{repo}")
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
        response = await self.client.get(
            f"{self.base_url}/repos/{owner}/{repo}/readme",
            headers={**self.headers, "Accept": "application/vnd.github.raw+json"}
        )
        if response.status_code == 404:
            return ""
        response.raise_for_status()
        return response.text
        
    async def get_languages(self, owner: str, repo: str) -> dict:
        response = await self.client.get(f"{self.base_url}/repos/{owner}/{repo}/languages")
        if response.status_code == 404:
            return {}
        response.raise_for_status()

        raw_data = response.json()
        return calculate_language_stats(raw_data)
        
    async def get_tree(self, owner: str, repo: str, default_branch: str) -> dict:
        response = await self.client.get(f"{self.base_url}/repos/{owner}/{repo}/git/trees/{default_branch}?recursive=1")
        if response.status_code == 404:
            return []
        response.raise_for_status()

        data = response.json()
        flat_tree = data.get("tree", [])
        
        return build_tree_structure(flat_tree)
        
    async def get_file_raw(self, owner: str, repo: str, path: str) -> str | None:
        """Hàm phụ trợ lấy nội dung file văn bản thô"""
        response = await self.client.get(
            f"{self.base_url}/repos/{owner}/{repo}/contents/{path}",
            headers={**self.headers, "Accept": "application/vnd.github.raw+json"}
        )
        if response.status_code == 404:
            return None
        response.raise_for_status()
        return response.text

    async def get_dependencies(self, owner: str, repo: str) -> dict:
        deps = {"frontend": [], "backend": []}

        pkg_json = await self.get_file_raw(owner, repo, "package.json")
        if pkg_json:
            try:
                data = json.loads(pkg_json)
                frontend_deps = list(data.get("dependencies", {}).keys()) + \
                                list(data.get("devDependencies", {}).keys())
                deps["frontend"].extend(frontend_deps)
            except json.JSONDecodeError:
                pass

        req_txt = await self.get_file_raw(owner, repo, "requirements.txt")
        if req_txt:
            lines = req_txt.splitlines()
            for line in lines:
                line = line.strip()
                if line and not line.startswith("#"):
                    pkg_name = re.split(r'[=<>~]', line)[0].strip()
                    if pkg_name:
                        deps["backend"].append(pkg_name)

        pyproject = await self.get_file_raw(owner, repo, "pyproject.toml")
        if pyproject:
            deps_matches = re.findall(r'^([a-zA-Z0-9_\-]+)\s*=\s*[\'"].*?[\'"]', pyproject, re.MULTILINE)
            deps["backend"].extend(deps_matches)
        
        deps["frontend"] = sorted(list(set(deps["frontend"])))
        deps["backend"] = sorted(list(set(deps["backend"])))

        return deps