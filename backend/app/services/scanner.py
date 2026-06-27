from typing import List, Dict


class RepoScanner:
    REQUIRED_FILES = {
        ".gitignore": "critical",
        "README.md": "critical",
        "LICENSE": "important",
    }

    @staticmethod
    def check_health(tree: Dict) -> List[dict]:
        missing = []

        existing = set(name.lower() for name in tree.keys())

        for file, severity in RepoScanner.REQUIRED_FILES.items():
            if file.lower() not in existing:
                missing.append(
                    {
                        "file": file,
                        "severity": severity,
                        "impact": RepoScanner._get_impact(severity),
                    }
                )

        return missing

    @staticmethod
    def _get_impact(severity: str) -> str:
        return {"critical": "high", "important": "medium"}.get(severity, "low")
