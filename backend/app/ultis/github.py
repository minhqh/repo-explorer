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