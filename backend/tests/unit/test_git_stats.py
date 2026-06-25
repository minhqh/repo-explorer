from app.ultis.git_stats import calculate_git_statistics


def test_empty_commits():
    result = calculate_git_statistics([])

    assert result.total_commits == 0
    assert result.unique_contributors == 0


def test_single_commit():
    commits = [
        {
            "sha": "1",
            "commit": {
                "message": "init",
                "author": {
                    "name": "milynn",
                    "date": "2025-01-01T00:00:00Z",
                },
            },
            "author": {
                "login": "milynn",
            },
        }
    ]

    result = calculate_git_statistics(commits)

    assert result.total_commits == 1
    assert result.unique_contributors == 1


def test_unknown_author():
    commits = [
        {
            "sha": "1",
            "commit": {
                "message": "init",
                "author": {
                    "name": "unknown",
                    "date": "2025-01-01T00:00:00Z",
                },
            },
            "author": None,
        }
    ]

    result = calculate_git_statistics(commits)

    assert result.unique_contributors == 1