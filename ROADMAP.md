# 🗺️ Lộ trình Phát triển & Kỹ thuật: GitHub Repo Explorer

## Phase 0: Project Setup (Completed)

- [x] **Task 0:** Initialize monorepo structure

## Phase 1: Backend Foundation (Completed)

- [x] **Task 1:** Github Service + Pydantic Schemas
- [x] **Task 2:** Health Check Endpoint
- [x] **Task 3:** Repository Analyze Endpoint
- [x] **Task 4:** Dependency Extraction

## Phase 2: Frontend Core (Completed)

- [x] **Task 5:** Main Layout + Search Bar
- [x] **Task 6:** API Integration + Loading

## Phase 3: Visualization (Completed)

- [x] **Task 7:** Info + README
- [x] **Task 8:** Repository Tree
- [x] **Task 9:** Language Charts
- [x] **Task 10:** Dependencies Tab
- [x] **Task 11:** AI Placeholder Tab

## Phase 4: Polish (Completed)

- [x] **Task 12:** Error Handling
- [x] **Task 13:** README Documentation & ROADMAP Integration

---

## Phase 5: Version 1.5 - Deep Scanner (Zero-DB Phase)

*Tập trung cào dữ liệu, chuẩn hóa môi trường và tổng hợp ngữ cảnh cho AI.*

- [ ] **Task 14:** Private Repository Support (Session token via `localStorage`)
- [ ] **Task 15:** Git Log Statistics (Raw metrics & Derived ratios)

> 🛑 **Technical Gate 1: Code Quality**
>
> Setup `ruff`, `black`, `eslint`, `prettier`.
>
> **Done when:** Toàn bộ backend/frontend pass linting.

---

- [ ] **Task 16:** Repository Timeline (Visualize project evolution from Git Log)
- [ ] **Task 17:** LLM Context Pack Generator (`repo_context.md`)
- [ ] **Task 18:** Rule-based Configuration Scanner (Check missing `.gitignore`, `LICENSE`, etc.)

> 🛑 **Technical Gate 2: Testing**
>
> Setup `pytest` và test các logic cốt lõi.
>
> **Done when:** Parse URL, Git Log và Scanner đều có unit tests.

---

- [ ] **Task 19:** Repository Snapshot & Health Score Dashboard
- [ ] **Task 20:** Export Analysis Report (Generate `report.md/pdf`)

> 🛑 **Technical Gate 3: Dockerization**
>
> Viết `Dockerfile` và `docker-compose.yml`.
>
> **Done when:** Dự án chạy hoàn toàn bằng `docker compose up`.

---

> 🛑 **Technical Gate 4: Release v1.5.0**
>
> Tạo `CHANGELOG.md` và cập nhật README.
>
> **Done when:** Test pass, lint pass, Docker chạy ổn và tag `v1.5.0`.

---

## Phase 6: Version 2.0 - Repo Intelligence

*Bắt đầu đưa LLM vào phân tích mã nguồn dựa trên luồng BYOK.*

- [ ] **Task 21:** Architecture Detection (Rule-based project structure analysis)
- [ ] **Task 22:** LLM Provider Management (Secure API Keys management via `localStorage`)

> 🛑 **Cửa ải Kỹ thuật 5 (CI/CD):** Thiết lập GitHub Actions (`ci.yml`).
> *Điều kiện:* Bất kỳ mã nguồn nào push lên nhánh `main` phải tự động chạy qua Pytest và Linting. Báo đỏ nếu rớt test.

- [ ] **Task 23:** Prompt Template System (Reusable templates for Architecture, Security, Performance)
- [ ] **Task 24:** AI Code Review (Evaluate component health via Providers & Templates)

> 🛑 **Cửa ải Kỹ thuật 6 (Deployment):** Deploy Backend (Render/Railway) và Frontend (Vercel).
> *Điều kiện:* Hệ thống chạy live trên internet. Cập nhật `CHANGELOG.md` và chốt Release `v2.0.0`.

---

## Phase 7: Version 3.0 - Code Intelligence

*Đẳng cấp AI Engineer: Bóc tách AST, xây dựng Đồ thị Tri thức và Local Vector Search.*

- [ ] **Task 25:** AST Extraction - Python (Parsing file structures, imports, and calls)
- [ ] **Task 26:** AST Extraction - TypeScript / JavaScript
- [ ] **Task 27:** Knowledge Graph Construction (Building nodes, edges, and relationships)
- [ ] **Task 28:** Local Embeddings & Vector Database Setup (FAISS Integration)

> 🛑 **Cửa ải Kỹ thuật 7 (Monitoring):** Thêm endpoint `/app/version` và cấu hình hệ thống Logging.
> *Điều kiện:* Ghi log đầy đủ thời gian thực thi (latency) của quá trình tạo Vector Embeddings để tiện theo dõi hiệu năng.

- [ ] **Task 29:** Semantic Search Engine (Query codebase by meaning instead of keywords)
- [ ] **Task 30:** Repository Memory (Generate `repository_summary.json` for context caching)
- [ ] **Task 31:** Context-Aware RAG Chatbot (Summary + RAG for optimized latency)

> 🛑 **Cửa ải Kỹ thuật 8 (Release):** Cập nhật `CHANGELOG.md` và chốt tag `v3.0.0`.

---

## Phase 8: Version 4.0 - AI Engineer Assistant

*Biến hệ thống thành một Agent có khả năng tự động hóa công việc của kỹ sư phần mềm.*

- [ ] **Task 32:** PR Description Generator (Combining Git diff with Context Pack)
- [ ] **Task 33:** Refactor Suggestions (Targeting Technical Debt via AST & Rules)
- [ ] **Task 34:** Guided Agent Workflow (User-initiated analysis and specific task execution)
- [ ] **Task 35:** Autonomous Agent Workflow (System-initiated exploration and proactive bug finding)

> 🛑 **Cửa ải Kỹ thuật 9 (Production Hardening):**
> *Điều kiện:* Cấu hình bảo mật nâng cao (Rate limiting, CORS strict). Cập nhật `CHANGELOG.md` và chốt tag `v4.0.0`.
