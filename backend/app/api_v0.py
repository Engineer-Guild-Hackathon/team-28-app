
from fastapi import APIRouter, Depends,  HTTPException
import os
import uuid6
from fastapi import APIRouter, Query
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, select
from sqlalchemy.dialects.mysql import BINARY
from sqlalchemy.future import select
from pydantic import BaseModel

# SQLAlchemy MySQL (asyncmy) 接続設定
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

# v0 API routerの作成
api_v0_router = APIRouter(prefix="/api/v0")


# TODO: Add additional API endpoints for user management, login, search, and user info as needed.

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session


@api_v0_router.get("/polls/search")
async def search_polls(query: str = Query(..., description="検索文字列")):
	async with AsyncSessionLocal() as session:
		pattern = f"%{query}%"
		stmt = select(Post).where(Post.title.like(pattern))
		result = await session.execute(stmt)
		posts = result.scalars().all()
		themes = [
			{
				"theme_id": post.id.hex(),
				"theme_name": post.title,
				"create_at": post.date.isoformat(),
				"category": post.category,
				"author": post.author.hex() if hasattr(post.author, 'hex') else str(post.author)
			}
			for post in posts
		]
		return {"themes": themes}

class UserSchema(BaseModel):
    id: str  # uuid6 を文字列で返す
    username: str
    displayname: str


    class Config:
        from_attributes=True


@api_v0_router.get("/users/{user_id}", response_model=UserSchema)
async def get_user(user_id: str, db: AsyncSession = Depends(get_db)):
	try:
		user_uuid = uuid6.UUID(user_id).bytes  # 文字列から BINARY(16) に変換
	except ValueError:
		raise HTTPException(status_code=400, detail="Invalid user_id format")

	result = await db.execute(select(User).filter(User.id == user_uuid))
	user = result.scalar_one_or_none()

	if not user:
		raise HTTPException(status_code=404, detail="User not found")

	# BINARY(16) を文字列に変換して返す
	return UserSchema(
		id=uuid6.UUID(bytes=user.id).hex,
		username=user.username,
		displayname=user.displayname
	)
