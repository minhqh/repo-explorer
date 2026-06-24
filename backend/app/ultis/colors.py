GITHUB_COLORS = {
    "TypeScript": "#3178c6", "Python": "#3572A5", "JavaScript": "#f1e05a",
    "HTML": "#e34c26", "CSS": "#563d7c", "Dockerfile": "#384d54",
    "Shell": "#89e051", "C": "#555555", "C++": "#f34b7d", "Java": "#b07219",
    "Go": "#00ADD8", "Rust": "#dea584", "Vue": "#41b883"
}
FALLBACK_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

def calculate_language_stats(raw_data: dict) -> list[dict]:
    """Hàm tiện ích xử lý tính phần trăm, sắp xếp và gán màu cho ngôn ngữ"""
    total_bytes = sum(raw_data.values())
    stats = []
    
    # Sắp xếp từ lớn đến bé dựa vào số bytes
    sorted_langs = sorted(raw_data.items(), key=lambda item: item[1], reverse=True)
    
    for index, (name, bytes_val) in enumerate(sorted_langs):
        percent = round((bytes_val / total_bytes) * 100, 1) if total_bytes > 0 else 0.0
        color = GITHUB_COLORS.get(name, FALLBACK_COLORS[index % len(FALLBACK_COLORS)])
        
        stats.append({
            "name": name,
            "value": bytes_val,
            "percent": percent,
            "color": color
        })
        
    return stats