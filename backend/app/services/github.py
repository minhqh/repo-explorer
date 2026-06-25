import json
import re
import httpx
from typing import Optional
from fastapi import HTTPException
from app.core.config import settings
from app.schemas.github import GitStats, RepoInfo
from app.ultis.github import build_tree_structure
from app.ultis.colors import calculate_language_stats
from app.ultis.git_stats import calculate_git_statistics


class GithubService:
    def __init__(self):
        self.base_url = "https://api.github.com"
        self.default_headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "Milynx-Repo-Explorer",
        }
        if settings.GITHUB_TOKEN:
            self.default_headers["Authorization"] = f"Bearer {settings.GITHUB_TOKEN}"

        self.client = httpx.AsyncClient(follow_redirects=True, timeout=10.0)

    def _get_headers(self, user_token: Optional[str] = None) -> dict:
        """Tạo header động cho mỗi request. Ưu tiên user_token nếu có."""
        headers = self.default_headers.copy()
        if user_token:
            headers["Authorization"] = f"Bearer {user_token}"
        return headers

    async def get_repository_info(
        self, owner: str, repo: str, token: Optional[str] = None
    ) -> RepoInfo:
        response = await self.client.get(
            f"{self.base_url}/repos/{owner}/{repo}", headers=self._get_headers(token)
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
            default_branch=data.get("default_branch", "main"),
        )

    async def get_readme(
        self, owner: str, repo: str, token: Optional[str] = None
    ) -> str:
        headers = self._get_headers(token)
        headers["Accept"] = "application/vnd.github.raw+json"

        response = await self.client.get(
            f"{self.base_url}/repos/{owner}/{repo}/readme", headers=headers
        )
        if response.status_code == 404:
            return ""
        response.raise_for_status()
        return response.text

    async def get_languages(
        self, owner: str, repo: str, token: Optional[str] = None
    ) -> dict:
        response = await self.client.get(
            f"{self.base_url}/repos/{owner}/{repo}/languages",
            headers=self._get_headers(token),
        )
        if response.status_code == 404:
            return {}
        response.raise_for_status()

        raw_data = response.json()
        return calculate_language_stats(raw_data)

    async def get_tree(
        self, owner: str, repo: str, default_branch: str, token: Optional[str] = None
    ) -> dict:
        response = await self.client.get(
            f"{self.base_url}/repos/{owner}/{repo}/git/trees/{default_branch}?recursive=1",
            headers=self._get_headers(token),
        )
        if response.status_code == 404:
            return []
        response.raise_for_status()

        data = response.json()
        flat_tree = data.get("tree", [])

        return build_tree_structure(flat_tree)

    async def get_file_raw(
        self, owner: str, repo: str, path: str, token: Optional[str] = None
    ) -> str | None:
        """Hàm phụ trợ lấy nội dung file văn bản thô"""
        headers = self._get_headers(token)
        headers["Accept"] = "application/vnd.github.raw+json"

        response = await self.client.get(
            f"{self.base_url}/repos/{owner}/{repo}/contents/{path}", headers=headers
        )
        if response.status_code == 404:
            return None
        response.raise_for_status()
        return response.text

    async def get_dependencies(
        self, owner: str, repo: str, token: Optional[str] = None
    ) -> dict:
        deps = {"frontend": [], "backend": []}

        pkg_json = await self.get_file_raw(owner, repo, "package.json", token)
        if pkg_json:
            try:
                data = json.loads(pkg_json)
                frontend_deps = list(data.get("dependencies", {}).keys()) + list(
                    data.get("devDependencies", {}).keys()
                )
                deps["frontend"].extend(frontend_deps)
            except json.JSONDecodeError:
                pass

        req_txt = await self.get_file_raw(owner, repo, "requirements.txt", token)
        if req_txt:
            lines = req_txt.splitlines()
            for line in lines:
                line = line.strip()
                if line and not line.startswith("#"):
                    pkg_name = re.split(r"[=<>~]", line)[0].strip()
                    if pkg_name:
                        deps["backend"].append(pkg_name)

        pyproject = await self.get_file_raw(owner, repo, "pyproject.toml", token)
        if pyproject:
            deps_matches = re.findall(
                r'^([a-zA-Z0-9_\-]+)\s*=\s*[\'"].*?[\'"]', pyproject, re.MULTILINE
            )
            deps["backend"].extend(deps_matches)

        deps["frontend"] = sorted(list(set(deps["frontend"])))
        deps["backend"] = sorted(list(set(deps["backend"])))

        return deps

    async def get_git_stats(
        self, owner: str, repo: str, token: Optional[str] = None
    ) -> GitStats:
        """Cào lịch sử commit và giao việc bóc tách số liệu cho Ultis."""
        try:
            response = await self.client.get(
                f"{self.base_url}/repos/{owner}/{repo}/commits?per_page=100",
                headers=self._get_headers(token),
            )
            if response.status_code == 404 or response.status_code == 409:
                return GitStats(
                    total_commits=0,
                    unique_contributors=0,
                    top_contributors=[],
                    commit_timeline=[],
                )

            response.raise_for_status()
            commits_data = response.json()

            return calculate_git_statistics(commits_data)

        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"GitHub API Error: {e.response.text}",
            )
