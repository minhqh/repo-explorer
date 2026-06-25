def mock_repo_info():
    return {
        "owner": "test",
        "name": "repo",
        "description": "mock repo",
        "stars": 10,
        "forks": 2,
        "language": "Python",
        "topics": [],
        "default_branch": "main",
    }


def mock_tree():
    return {
        "README.md": {
            "name": "README.md",
            "type": "blob",
            "size": 120,
            "children": {},
        },
        "app": {
            "name": "app",
            "type": "tree",
            "size": None,
            "children": {
                "main.py": {
                    "name": "main.py",
                    "type": "blob",
                    "size": 50,
                    "children": {},
                }
            },
        },
    }


def mock_commits():
    return [
        {
            "sha": "abc123",
            "commit": {
                "message": "init",
                "author": {"name": "test", "date": "2024-01-01T00:00:00Z"},
            },
            "author": {"login": "test"},
        }
    ]
