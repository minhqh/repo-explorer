def find_files_in_tree(tree: dict, target_names: list, current_path: str = "") -> list:
    """Duyệt đệ quy cây thư mục để tìm đường dẫn của các file mục tiêu"""
    paths = []
    for name, node in tree.items():
        node_type = node.get("type") if isinstance(node, dict) else getattr(node, "type", None)
        node_children = node.get("children", {}) if isinstance(node, dict) else getattr(node, "children", {})
        
        path = f"{current_path}/{name}" if current_path else name
        if name in target_names and node_type == "blob":
            paths.append(path)
        elif node_type == "tree" and node_children:
            paths.extend(find_files_in_tree(node_children, target_names, path))
    return paths