import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .api_v0 import api_v0_router
from fastapi.middleware.cors import CORSMiddleware

# APIとフロントエンドの統合アプリケーション

app = FastAPI()

# /api/v0ルーターを登録
app.include_router(api_v0_router)

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"、 "https://team-28-app-frontend-629273086549.europe-west1.run.app"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


