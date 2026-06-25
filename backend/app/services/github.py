import asyncio
import httpx
from typing import Optional
from fastapi import HTTPException
from app.core.config import settings
from app.schemas.github import GitStats, RepoInfo
from app.ultis.github import build_tree_structure
from app.ultis.colors import calculate_language_stats
from app.ultis.git_stats import calculate_git_statistics
from app.ultis.file_parser import (
    parse_package_json,
    parse_pyproject_toml,
    parse_requirements_txt,
)
from app.ultis.tree_explorer import find_files_in_tree


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
        self, owner: str, repo: str, tree: dict, token: Optional[str] = None
    ) -> dict:
        deps = {"frontend": [], "backend": []}

        # 1. Dùng utils để duyệt cây
        pkg_paths = find_files_in_tree(tree, ["package.json"])
        req_paths = find_files_in_tree(tree, ["requirements.txt"])
        toml_paths = find_files_in_tree(tree, ["pyproject.toml"])

        # 2. Định nghĩa tác vụ I/O (Chỉ gọi API lấy text, parsing đẩy cho utils)
        async def fetch_and_parse(path, parser_func):
            content = await self.get_file_raw(owner, repo, path, token)
            return parser_func(content) if content else []

        # 3. Chạy song song
        tasks = []
        for p in pkg_paths:
            tasks.append(fetch_and_parse(p, parse_package_json))
        for p in req_paths:
            tasks.append(fetch_and_parse(p, parse_requirements_txt))
        for p in toml_paths:
            tasks.append(fetch_and_parse(p, parse_pyproject_toml))

        if not tasks:
            return deps
        results = await asyncio.gather(*tasks)

        idx = 0
        for _ in pkg_paths:
            deps["frontend"].extend(results[idx])
            idx += 1
        for _ in req_paths:
            deps["backend"].extend(results[idx])
            idx += 1
        for _ in toml_paths:
            deps["backend"].extend(results[idx])
            idx += 1

        deps["frontend"] = sorted(list(set(deps["frontend"])))
        deps["backend"] = sorted(list(set(deps["backend"])))
        return deps

    async def get_important_markdowns(
        self, owner: str, repo: str, tree: dict, token: Optional[str] = None
    ) -> dict:
        """Task 17: Cào nội dung các file .md quan trọng (trừ README đã có)"""
        target_files = [
            "CONTRIBUTING.md",
            "ROADMAP.md",
            "CHANGELOG.md",
            "ARCHITECTURE.md",
        ]
        paths = []

        # Chỉ quét ở Root (tránh cào nhầm các file .md rác trong node_modules hay docs con)
        for name, node in tree.items():
            node_type = (
                node.get("type")
                if isinstance(node, dict)
                else getattr(node, "type", None)
            )
            if node_type == "blob" and name.upper() in target_files:
                paths.append(name)

        results = {}

        async def fetch_md(path):
            content = await self.get_file_raw(owner, repo, path, token)
            if content:
                results[path] = content

        tasks = [fetch_md(p) for p in paths]
        if tasks:
            await asyncio.gather(*tasks)

        return results

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

    async def get_commits_page(
        self, owner: str, repo: str, page: int, token: Optional[str] = None
    ) -> list:
        """Fetch các trang commit tiếp theo (cho tính năng Load More)"""
        try:
            response = await self.client.get(
                f"{self.base_url}/repos/{owner}/{repo}/commits?per_page=100&page={page}",
                headers=self._get_headers(token),
            )
            if response.status_code == 404 or response.status_code == 409:
                return []
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"GitHub API Error: {e.response.text}",
            )
