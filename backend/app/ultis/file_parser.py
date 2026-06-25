import json
import re

def parse_package_json(content: str) -> list:
    try:
        data = json.loads(content)
        return list(data.get("dependencies", {}).keys()) + list(data.get("devDependencies", {}).keys())
    except Exception:
        return []

def parse_requirements_txt(content: str) -> list:
    res = []
    for line in content.splitlines():
        line = line.strip()
        if line and not line.startswith("#"):
            pkg_name = re.split(r'[=<>~]', line)[0].strip()
            if pkg_name: 
                res.append(pkg_name)
    return res

def parse_pyproject_toml(content: str) -> list:
    res = []
    matches = re.findall(r'^([a-zA-Z0-9_\-]+)\s*[=>~]', content, re.MULTILINE)
    poetry_matches = re.findall(r'^([a-zA-Z0-9_\-]+)\s*=\s*[\'"].*?[\'"]', content, re.MULTILINE)
    res.extend(matches + poetry_matches)
    return res