# Changelog

Tất cả những thay đổi đáng chú ý của dự án sẽ được ghi nhận tại file này.

## [1.5.0] - Zero-DB Deep Scanner Phase

### ✨ Features (Tính năng mới)

- **Git Log Statistics:** Cào lịch sử Git, thống kê hoạt động commit và top contributors.
- **AI Context Pack:** Tự động nén toàn bộ kiến trúc và dữ liệu repository thành file markdown `.md` để mớm cho LLM.
- **Rule-based Scanner:** Quét và cảnh báo các file cấu hình quan trọng bị thiếu (`.gitignore`, `LICENSE`, `README.md`).
- **Health Score Dashboard:** Trực quan hóa "sức khỏe" của kho lưu trữ với giao diện chấm điểm theo thang A-F, liệt kê chi tiết điểm thưởng và lỗi phạt.
- **Export Analysis Report:** Hỗ trợ xuất báo cáo phân tích tổng quan dành cho con người dưới định dạng Markdown.

### 🛠️ Technical Chores (Kỹ thuật)

- **Code Quality:** Tích hợp thành công Linting/Formatting với Ruff, Black, OXLint, Prettier.
- **Testing:** Xây dựng nền tảng Unit Test với Pytest cho các logic cốt lõi.
- **Dockerization:** Đóng gói toàn bộ hệ thống bằng Docker và Docker Compose.