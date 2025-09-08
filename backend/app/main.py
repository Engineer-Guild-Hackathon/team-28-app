from typing import Union
import os
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# APIとフロントエンドの統合アプリケーション
app = FastAPI()

# 静的ファイルを提供するためのマウントポイント設定
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

# API用エンドポイント
@app.get("/api")
def read_root():
    return {"Hello": "World"}

@app.get("/api/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

# フロントエンドのファイルを提供するルート
@app.get("/{path:path}")
async def serve_frontend(request: Request, path: str):
    # ルートパスの場合はindex.html
    if path == "" or path == "/":
        return FileResponse(os.path.join(static_dir, "index.html"))
    
    # 静的ファイルへのパスを構築
    file_path = os.path.join(static_dir, path)
    
    # ファイルが存在すれば直接提供
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    
    # それ以外の場合はindex.htmlにフォールバック（SPA向け）
    return FileResponse(os.path.join(static_dir, "index.html"))