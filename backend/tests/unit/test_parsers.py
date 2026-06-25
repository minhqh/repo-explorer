from app.ultis.file_parser import (
    parse_package_json,
    parse_requirements_txt,
    parse_pyproject_toml,
)


def test_package_json():
    content = """
    {
        "dependencies": {
            "react": "^18"
        },
        "devDependencies": {
            "vite": "^5"
        }
    }
    """

    result = parse_package_json(content)

    assert "react" in result
    assert "vite" in result


def test_invalid_package_json():
    result = parse_package_json("{{{{")

    assert result == []


def test_requirements_txt():
    result = parse_requirements_txt(
        """
        fastapi==0.1
        numpy>=2.0
        """
    )

    assert "fastapi" in result
    assert "numpy" in result


def test_pyproject_toml():
    content = "fastapi==0.1\nnumpy"

    result = parse_pyproject_toml(content)

    assert "fastapi" in result