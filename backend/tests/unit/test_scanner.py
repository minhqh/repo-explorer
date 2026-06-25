from app.services.scanner import RepoScanner


def test_missing_all_files():
    tree = {}

    result = RepoScanner.check_health(tree)

    files = [item["file"] for item in result]

    assert ".gitignore" in files
    assert "README.md" in files
    assert "LICENSE" in files


def test_no_missing_files():
    tree = {
        ".gitignore": {},
        "README.md": {},
        "LICENSE": {},
    }

    result = RepoScanner.check_health(tree)

    assert result == []


def test_case_insensitive():
    tree = {
        "readme.md": {},
        "license": {},
        ".gitignore": {},
    }

    result = RepoScanner.check_health(tree)

    assert result == []