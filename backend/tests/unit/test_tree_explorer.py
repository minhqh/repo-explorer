from app.ultis.tree_explorer import find_files_in_tree


def test_find_files():
    tree = {
        "src": {
            "type": "tree",
            "children": {"main.py": {"type": "blob", "children": {}}},
        }
    }

    result = find_files_in_tree(tree, ["main.py"])

    assert "src/main.py" in result
