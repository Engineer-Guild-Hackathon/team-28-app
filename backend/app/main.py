import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os

# APIとフロントエンドの統合アプリケーション
app = FastAPI()

static_dir = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/")
def read_root():
    return {"Hello": "World"}