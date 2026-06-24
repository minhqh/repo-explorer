# 🔍 GitHub Repo Explorer

Một công cụ phân tích repository mã nguồn mở mạnh mẽ, cung cấp cái nhìn toàn cảnh về kiến trúc hệ thống, thống kê ngôn ngữ và quản lý thư viện. Được thiết kế với kiến trúc Backend-For-Frontend (BFF) linh hoạt, sẵn sàng tích hợp các mô hình LLM để tự động review code.

## ✨ Tính năng nổi bật

- **Thống kê Tổng quan:** Cào và render file `README.md` chuẩn Markdown/HTML, thống kê số sao, fork, nhánh mặc định.
- **Phân tích Kiến trúc (Tree):** Trực quan hóa cấu trúc thư mục dạng đệ quy với bộ icon động phân loại theo định dạng file.
- **Biểu đồ Ngôn ngữ:** Biểu đồ Donut và Progress Bar thống kê tỷ lệ dung lượng từng ngôn ngữ được tính toán trực tiếp từ Backend.
- **Trích xuất Dependencies:** Tự động đọc và phân loại thư viện Frontend/Backend từ các file cấu hình (`package.json`, `requirements.txt`, `pyproject.toml`).
- **Sẵn sàng cho AI:** Kiến trúc luồng dữ liệu sạch sẽ, dọn sẵn đường cho việc tích hợp RAG với các mô hình AI trong tương lai.

## 🛠️ Công nghệ sử dụng

- **Frontend:** React, TypeScript, Vite, Recharts, React-Markdown.
- **Backend:** FastAPI, Python, httpx (Async HTTP Client), Pydantic.
- **Kiến trúc:** Monorepo, Service Layer Pattern, Separation of Concerns.

## 🚀 Hướng dẫn cài đặt (Local Development)

Dự án được tối ưu để chạy trên môi trường Ubuntu/Linux bằng cách khởi chạy song song 2 terminal.

### 1. Khởi động Backend (FastAPI)

Mở terminal 1:

```bash

cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Tạo file biến môi trường và cấp quyền GitHub Token để tránh rate limit
cp .env.example .env

# Chạy server
uvicorn app.main:app --reload
```

### 2. Khởi động Frontend (React/Vite)

Mở terminal 2:

```bash
cd frontend
npm install

# Khởi tạo biến môi trường cho Frontend
cp .env.example .env

# Chạy môi trường dev
npm run dev
```

Truy cập ứng dụng tại: `http://localhost:5173`

## 👨‍💻 Tác giả

Được thiết kế và phát triển bởi minhqh(Milynx).

---
