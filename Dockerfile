# --- Stage 1: Build frontend ---
FROM node:22-alpine AS frontend-builder
WORKDIR /application/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
# 静的ファイルを out/ に出力
RUN npm run build

# --- Stage 2: Backend ---
FROM python:3.12-slim AS backend
WORKDIR /application
COPY backend/ .
RUN pip install --no-cache-dir -r requirements.txt

# --- Stage 3: Combine frontend + backend ---
# Node.js は不要なので frontend のビルド結果だけコピー
COPY --from=frontend-builder /application/frontend/.next ./app/static

# Cloud Run では PORT 環境変数を使用
ENV PORT=8080

# FastAPI の static 配下に Next の静的ファイルをマウント
WORKDIR /application/
CMD ["uvicorn", "--host", "0.0.0.0", "--port", "8080", "app.main:app"]
