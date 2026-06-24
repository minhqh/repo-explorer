from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Github Repo Explorer API",
    description="API cho ứng dụng phân tích repository GitHub",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Port mặc định của Vite
    allow_credentials=True,
    allow_methods=["*"],  # Cho phép mọi phương thức (GET, POST,...)
    allow_headers=["*"],  # Cho phép mọi headers
)

@app.get("/health", tags=["System"])
async def health_check():
    """
    Kiểm tra trạng thái hoạt động của server.
    """
    return {
        "status": "ok",
        "message": "Server is running smoothly!"
    }