import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .api_v0 import api_v0_router
from fastapi.middleware.cors import CORSMiddleware

# APIとフロントエンドの統合アプリケーション

app = FastAPI()

# /api/v0ルーターを登録
app.include_router(api_v0_router)

static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}


