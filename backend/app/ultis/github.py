def parse_github_url(url: str) -> tuple[str, str]:
    """Hàm phụ trợ bóc tách owner và repo từ URL"""
    url = url.strip().rstrip('/')
    parts = url.split("github.com/")
    if len(parts) < 2:
        raise ValueError("Không phải là URL GitHub hợp lệ.")
    
    repo_parts = parts[1].split("/")
    if len(repo_parts) < 2:
        raise ValueError("URL chưa chứa đủ thông tin owner và repository.")
        
    owner = repo_parts[0]
    repo = repo_parts[1].replace(".git", "")
    return owner, repo

def build_tree_structure(flat_tree: list) -> dict:
    """Chuyển đổi mảng phẳng từ GitHub API thành cấu trúc cây lồng nhau"""
    root = {}
    for item in flat_tree:
        parts = item["path"].split("/")
        current = root
        for i, part in enumerate(parts):
            if part not in current:
                is_last = (i == len(parts) - 1)
                current[part] = {
                    "name": part,
                    "type": item["type"] if is_last else "tree",
                    "size": item.get("size") if is_last else None,
                    "children": {}
                }
            current = current[part]["children"]
    return root