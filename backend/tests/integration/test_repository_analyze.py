from unittest.mock import AsyncMock

from fastapi import HTTPException

from app.api.endpoints import repository
from app.schemas.github import (
    RepoInfo,
    DependenciesData,
    GitStats,
)


def setup_success_mocks(monkeypatch):
    monkeypatch.setattr(
        repository.github_service,
        "get_repository_info",
        AsyncMock(
            return_value=RepoInfo(
                owner="test-user",
                name="test-repo",
                description="mock",
                stars=1,
                forks=1,
                language="Python",
                topics=[],
                default_branch="main",
            )
        ),
    )

    monkeypatch.setattr(
        repository.github_service,
        "get_readme",
        AsyncMock(return_value="# README"),
    )

    monkeypatch.setattr(
        repository.github_service,
        "get_languages",
        AsyncMock(return_value=[]),
    )

    monkeypatch.setattr(
        repository.github_service,
        "get_tree",
        AsyncMock(
            return_value={
                "README.md": {
                    "name": "README.md",
                    "type": "blob",
                    "size": 100,
                    "children": {},
                }
            }
        ),
    )

    monkeypatch.setattr(
        repository.github_service,
        "get_git_stats",
        AsyncMock(
            return_value=GitStats(
                total_commits=1,
                unique_contributors=1,
                top_contributors=[],
                commit_timeline=[],
                recent_commits=[],
            )
        ),
    )

    monkeypatch.setattr(
        repository.github_service,
        "get_dependencies",
        AsyncMock(
            return_value=DependenciesData(
                frontend=[],
                backend=["fastapi"],
            )
        ),
    )

    monkeypatch.setattr(
        repository.github_service,
        "get_important_markdowns",
        AsyncMock(return_value={}),
    )


def test_analyze_success(client, monkeypatch):
    setup_success_mocks(monkeypatch)

    response = client.post(
        "/api/repository/analyze",
        json={"url": "https://github.com/test-user/test-repo"},
    )

    body = response.json()
    print(response.status_code)
    print(response.json())
    assert response.status_code == 200
    assert body["success"] is True
    assert body["data"]["info"]["owner"] == "test-user"


def test_analyze_invalid_url(client):
    response = client.post(
        "/api/repository/analyze",
        json={"url": "abcxyz"},
    )

    body = response.json()

    assert body["success"] is False
    assert "GitHub" in body["message"]


def test_analyze_repo_not_found(client, monkeypatch):
    monkeypatch.setattr(
        repository.github_service,
        "get_repository_info",
        AsyncMock(
            side_effect=HTTPException(
                status_code=404,
                detail="Repository not found",
            )
        ),
    )

    response = client.post(
        "/api/repository/analyze",
        json={"url": "https://github.com/test/repo"},
    )

    body = response.json()

    assert body["success"] is False
    assert body["message"] == "Repository not found"


def test_analyze_internal_error(client, monkeypatch):
    monkeypatch.setattr(
        repository.github_service,
        "get_repository_info",
        AsyncMock(side_effect=Exception("boom")),
    )

    response = client.post(
        "/api/repository/analyze",
        json={"url": "https://github.com/test/repo"},
    )

    body = response.json()

    assert body["success"] is False
    assert "boom" in body["message"]


def test_analyze_empty_tree(client, monkeypatch):
    setup_success_mocks(monkeypatch)

    monkeypatch.setattr(
        repository.github_service,
        "get_tree",
        AsyncMock(return_value={}),
    )

    response = client.post(
        "/api/repository/analyze",
        json={"url": "https://github.com/test/repo"},
    )

    body = response.json()

    assert body["success"] is True
    assert body["data"]["tree"] == {}
