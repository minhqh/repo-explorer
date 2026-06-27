from typing import Dict, Any
from app.schemas.github import HealthScore, PenaltyBonus, HealthIssue
from app.services.scanner import RepoScanner


class RepoHealthScorer:
    @staticmethod
    def calculate_score(tree: Dict[str, Any]) -> HealthScore:
        score = 100
        penalties = []
        bonuses = []

        # 1. Gọi Task 18 (Scanner) để lấy danh sách lỗi
        raw_issues = RepoScanner.check_health(tree)
        issues = [HealthIssue(**issue) for issue in raw_issues]

        # 2. Dựa vào lỗi của Task 18 để tính ĐIỂM TRỪ
        for issue in issues:
            if issue.file == "README.md":
                penalties.append(
                    PenaltyBonus(
                        item="README",
                        value=-20,
                        description="Thiếu file README.md cốt lõi",
                    )
                )
                score -= 20
            elif issue.file == "LICENSE":
                penalties.append(
                    PenaltyBonus(
                        item="LICENSE",
                        value=-20,
                        description="Thiếu giấy phép mã nguồn mở (License)",
                    )
                )
                score -= 20
            elif issue.file == ".gitignore":
                penalties.append(
                    PenaltyBonus(
                        item=".gitignore",
                        value=-10,
                        description="Chưa cấu hình .gitignore",
                    )
                )
                score -= 10

        # 3. Quét Cây thư mục để tính ĐIỂM THƯỞNG
        root_files = [key.lower() for key in tree.keys()]

        if "contributing.md" in root_files:
            bonuses.append(
                PenaltyBonus(
                    item="CONTRIBUTING",
                    value=10,
                    description="Có tài liệu hướng dẫn đóng góp",
                )
            )
            score += 10
        if ".github" in root_files:
            bonuses.append(
                PenaltyBonus(
                    item="CI/CD", value=10, description="Đã thiết lập CI/CD Workflows"
                )
            )
            score += 10
        if any(f in root_files for f in ["tests", "__tests__", "test"]):
            bonuses.append(
                PenaltyBonus(
                    item="Testing", value=10, description="Có thư mục kiểm thử (Tests)"
                )
            )
            score += 10

        # 4. Chuẩn hóa điểm và xếp hạng
        score = max(0, min(100, score))
        if score >= 90:
            grade = "A"
        elif score >= 80:
            grade = "B"
        elif score >= 70:
            grade = "C"
        elif score >= 50:
            grade = "D"
        else:
            grade = "F"

        return HealthScore(
            total_score=score,
            grade=grade,
            issues=issues,
            penalties=penalties,
            bonuses=bonuses,
        )
