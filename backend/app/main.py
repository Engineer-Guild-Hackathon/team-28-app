import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base


# SQLAlchemy MySQL (asyncmy) 接続設定
# DBのURLは環境変数から取得
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable must be set and must not use hardcoded credentials.")
engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False
)
Base = declarative_base()

# --- Models ---
import uuid6
from sqlalchemy import Column, String, DateTime, Integer, ForeignKey
from sqlalchemy.dialects.mysql import BINARY
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"
    id = Column(BINARY(16), primary_key=True, nullable=False, default=lambda: uuid6.uuid7().bytes)
    username = Column(String(32), unique=True, nullable=False)
    displayname = Column(String(64), nullable=False)
    password = Column(String(128), nullable=False)  # argon2id hash
    posts = relationship("Post", back_populates="author_obj")
    votes = relationship("Vote", back_populates="user_obj")

class Post(Base):
    __tablename__ = "posts"
    id = Column(BINARY(16), primary_key=True, nullable=False, default=lambda: uuid6.uuid7().bytes)
    title = Column(String(128), nullable=False)
    date = Column(DateTime, nullable=False)
    category = Column(String(32), nullable=False)
    author = Column(BINARY(16), ForeignKey("users.id"), nullable=False)
    author_obj = relationship("User", back_populates="posts")
    choices = relationship("Choice", back_populates="post_obj")
    votes = relationship("Vote", back_populates="post_obj")

class Choice(Base):
    __tablename__ = "choices"
    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    post_id = Column(BINARY(16), ForeignKey("posts.id"), nullable=False)
    choice = Column(String(64), nullable=False)
    number = Column(Integer, nullable=False, default=0)
    post_obj = relationship("Post", back_populates="choices")

class Vote(Base):
    __tablename__ = "votes"
    post_id = Column(BINARY(16), ForeignKey("posts.id"), primary_key=True, nullable=False)
    user_id = Column(BINARY(16), ForeignKey("users.id"), primary_key=True, nullable=False)
    number = Column(Integer, nullable=False)
    post_obj = relationship("Post", back_populates="votes")
    user_obj = relationship("User", back_populates="votes")
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

# APIとフロントエンドの統合アプリケーション
app = FastAPI()

static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/")
def read_root():
    return {"Hello": "World"}