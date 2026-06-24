# Quy chuẩn Commit Code (Git Commit Convention)

Mỗi commit trong dự án cần tuân thủ cấu trúc sau để giúp lịch sử git luôn rõ ràng, dễ đọc và dễ bảo trì:

**Định dạng chung:**

```text
<type>(<scope>): <mô tả ngắn gọn bằng tiếng Anh>
```

---

## 1. Phân loại Commit (Types)

| Type | Ý nghĩa & Khi nào sử dụng | Ví dụ thực tế |
| :--- | :--- | :--- |
| **`feat`** | **Thêm tính năng mới** cho người dùng hoặc hệ thống (thêm endpoint, component, trang, chức năng mới). | `feat(frontend): add repository search form`<br>`feat(backend): implement github repository endpoint` |
| **`fix`** | **Sửa lỗi** (API trả dữ liệu sai, UI hiển thị lỗi, bug logic, crash chương trình). | `fix(frontend): prevent empty search requests`<br>`fix(backend): handle github api timeout` |
| **`refactor`** | **Thay đổi cấu trúc code** nhưng **không** thay đổi hành vi/logic (tách hàm, tách component, cải thiện kiến trúc). | `refactor(frontend): extract language chart component`<br>`refactor(backend): move github logic to service layer` |
| **`docs`** | **Thay đổi tài liệu** (cập nhật README, CONTRIBUTING, API documentation). | `docs(readme): add setup instructions`<br>`docs(readme): update project structure` |
| **`style`** | **Thay đổi format code** mà không ảnh hưởng logic (sửa indentation, đổi dấu nháy, dùng Prettier/Black). | `style(frontend): format repository page`<br>`style(backend): apply black formatting` |
| **`test`** | **Thêm hoặc sửa code test** (Pytest, Playwright, Unit test, Integration test). | `test(backend): add github service tests`<br>`test(frontend): add repository page tests` |
| **`chore`** | **Các thay đổi kỹ thuật/cấu hình** (cập nhật dependency, thêm gitignore, docker compose, config dự án). | `chore(root): add gitignore`<br>`chore(frontend): update dependencies` |

---

## 2. Phạm vi thay đổi (Scopes)

| Scope | Phạm vi ảnh hưởng | Ví dụ thực tế |
| :--- | :--- | :--- |
| **`frontend`** | Mọi thay đổi bên trong thư mục `frontend/` | `feat(frontend): add repository tree viewer` |
| **`backend`** | Mọi thay đổi bên trong thư mục `backend/` | `feat(backend): add language statistics endpoint` |
| **`fullstack`** | Tính năng tác động đồng thời cả frontend và backend trong cùng 1 commit | `feat(fullstack): add repository analysis workflow` |
| **`root`** | Các file cấu hình nằm ở thư mục gốc của dự án | `chore(root): initialize monorepo structure` |
| **`readme`** | Các thay đổi liên quan đến file README.md | `docs(readme): add project roadmap` |
| **`docker`** | Liên quan đến file cấu hình Docker (`Dockerfile`, `docker-compose`) | `chore(docker): add docker compose configuration` |
| **`ci`** | Cấu hình luồng CI/CD (Github Actions, GitLab CI) | `ci(github): add backend workflow` |

---

## 💡 Nguyên tắc Commit

**Một commit nên đại diện cho một thay đổi hoàn chỉnh.** Hãy gom các thay đổi thuộc cùng một công việc thành một commit duy nhất, thay vì chia nhỏ thành các commit vụn vặt gây rác lịch sử git.

✅ **Tốt (Đại diện cho 1 thay đổi hoàn chỉnh):**

```text
feat(frontend): add repository info tab
```

❌ **Không tốt (Chia quá nhỏ và lắt nhắt):**

```text
feat(frontend): add tab
fix(frontend): tab style
fix(frontend): tab color
fix(frontend): tab spacing
```
