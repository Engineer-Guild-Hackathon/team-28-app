import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .api_v0 import api_v0_router

# APIとフロントエンドの統合アプリケーション

app = FastAPI()

# /api/v0ルーターを登録
app.include_router(api_v0_router)

static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/")
def read_root():
    return {"Hello": "World"}

