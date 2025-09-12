from fastapi import APIRouter, Depends,  HTTPException, status, Response, Cookie
import os
import uuid6
from fastapi import APIRouter, Query
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, select
from sqlalchemy.dialects.mysql import BINARY
from sqlalchemy.future import select
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import JWTError, jwt, JWTError
from datetime import datetime, timedelta
from typing import Optional

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
	username = Column("user_name",String(32), unique=True, nullable=False)
	displayname = Column("display_name",String(64), nullable=False)
	password = Column(String(128), nullable=False)  # argon2id hash
	posts = relationship("Post", back_populates="author_obj")
	votes = relationship("Vote", back_populates="user_obj")

class Post(Base):
	__tablename__ = "posts"
	id = Column(BINARY(16), primary_key=True, nullable=False, default=lambda: uuid6.uuid7().bytes)
	title = Column(String(128), nullable=False)
	description = Column(String(1024), nullable=True)
	created_at = Column(DateTime, nullable=False)
	category = Column(Integer, nullable=False)
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

# JWTトークンの検証関数
async def verify_token(access_token: str = Cookie(None)):
	if access_token is None:
		raise HTTPException(status_code=401, detail="Authorization token missing")
	try:
		payload = jwt.decode(access_token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
		username: str = payload.get("sub")
		if username is None:
			raise HTTPException(status_code=401, detail="Invalid token")
	except JWTError:
		raise HTTPException(status_code=401, detail="Invalid token")
	return username


@api_v0_router.get("/polls/search")
async def search_polls(query: str = Query(..., description="検索文字列"), current_user: str = Depends(verify_token)):
	async with AsyncSessionLocal() as session:
		pattern = f"%{query}%"
		stmt = select(Post).where(Post.title.like(pattern))
		result = await session.execute(stmt)
		posts = result.scalars().all()
		themes = [
			{
				"theme_id": uuid6.UUID(bytes=post.id).hex,
				"theme_name": post.title,
				"create_at": post.created_at.isoformat(),
				"category": post.category,
				"author": uuid6.UUID(bytes=post.author).hex
			}
			for post in posts
		]
		return {"themes": themes}

@api_v0_router.get("/polls")
async def get_polls_by_category(category: int = Query(None, description="カテゴリーID")):
	async with AsyncSessionLocal() as session:
		if category is not None:
			stmt = select(Post).where(Post.category == category)
		else:
			stmt = select(Post)
		result = await session.execute(stmt)
		posts = result.scalars().all()
		themes = [
			{
				"theme_id": uuid6.UUID(bytes=post.id).hex,
				"theme_name": post.title,
				"create_at": post.created_at.isoformat(),
				"category": post.category,
				"author": uuid6.UUID(bytes=post.author).hex
			}
			for post in posts
		]
		return {"themes": themes}

class UserSchema(BaseModel):
    id: str  # uuid6 を文字列で返す
    username: str
    displayname: str


    class Config:
        from_attributes = True


@api_v0_router.get("/users/{user_id}", response_model=UserSchema)
async def get_user(user_id: str, 
                   db: AsyncSession = Depends(get_db),
                   current_user: str = Depends(verify_token)):
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

@api_v0_router.get("/users/{user_id}/polls")
async def get_user_polls(user_id: str, db: AsyncSession = Depends(get_db)):
	try:
		user_uuid = uuid6.UUID(user_id).bytes
	except ValueError:
		raise HTTPException(status_code=400, detail="Invalid user_id format")

	result = await db.execute(select(Post).filter(Post.author == user_uuid))
	posts = result.scalars().all()
	
	themes = [
		{
			"theme_id": uuid6.UUID(bytes=post.id).hex,
			"theme_name": post.title,
			"create_at": post.created_at.isoformat(),
			"category": post.category,
			"author": uuid6.UUID(bytes=post.author).hex
		}
		for post in posts
	]
	return {"themes": themes}

@api_v0_router.get("/users/{user_id}/votes")
async def get_user_votes(user_id: str, db: AsyncSession = Depends(get_db)):
	try:
		user_uuid = uuid6.UUID(user_id).bytes
	except ValueError:
		raise HTTPException(status_code=400, detail="Invalid user_id format")

	# ユーザーが投票したpostを取得
	result = await db.execute(
		select(Post, Vote.number).join(Vote, Post.id == Vote.post_id).filter(Vote.user_id == user_uuid)
	)
	votes = result.all()
	
	themes = [
		{
			"theme_id": uuid6.UUID(bytes=post.id).hex,
			"theme_name": post.title,
			"create_at": post.created_at.isoformat(),
			"category": post.category,
			"author": uuid6.UUID(bytes=post.author).hex,
			"voted_choice": vote_number
		}
		for post, vote_number in votes
	]
	return {"themes": themes}

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

class PostCreateSchema(BaseModel):
	title: str
	description: str = None
	category: int
	choices: list[str]

class UserUpdateSchema(BaseModel):
	username: Optional[str] = None
	displayname: Optional[str] = None
	password: Optional[str] = None

class VoteSchema(BaseModel):
	choice_number: int

class UserCreateSchema(BaseModel):
	username: str
	displayname: str
	password: str

@api_v0_router.post("/auth/signup", response_model=UserSchema)
async def create_user(user_data: UserCreateSchema, db: AsyncSession = Depends(get_db)):
	# ユーザーの作成処理を実装
	result = await db.execute(select(User).filter(User.username == user_data.username))
	existing_user = result.scalar_one_or_none()
	if existing_user:
		raise HTTPException(status_code=409, detail="Username already exists")
	# パスワードをハッシュ化
	hashed_password = pwd_context.hash(user_data.password)

	# DBモデルのインスタンスを作成
	new_user = User(
		id=uuid6.uuid7().bytes,
		username=user_data.username,
		displayname=user_data.displayname,
		password=hashed_password
	)
	db.add(new_user)
	await db.commit()
	await db.refresh(new_user)
	return UserSchema(
		id=uuid6.UUID(bytes=new_user.id).hex,
		username=new_user.username,
		displayname=new_user.displayname
	)


# JWT方式でのユーザーログイン
class LoginSchema(BaseModel):
	username: str
	password: str

class TokenSchema(BaseModel):
	token: str
	expires_in: int

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encode_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm=os.getenv("ALGORITHM"))
    return encode_jwt

async def get_current_user(access_token: str = Cookie(None), db: AsyncSession = Depends(get_db)):
	if not access_token:
		raise HTTPException(
			status_code=status.HTTP_401_UNAUTHORIZED,
			detail="アクセストークンが必要です",
			headers={"WWW-Authenticate": "Bearer"},
		)
	try:
		payload = jwt.decode(access_token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
		username: str = payload.get("sub")
		if username is None:
			raise HTTPException(
				status_code=status.HTTP_401_UNAUTHORIZED,
				detail="無効なトークンです",
				headers={"WWW-Authenticate": "Bearer"},
			)
	except JWTError:
		raise HTTPException(
			status_code=status.HTTP_401_UNAUTHORIZED,
			detail="無効なトークンです",
			headers={"WWW-Authenticate": "Bearer"},
		)
	
	result = await db.execute(select(User).filter(User.username == username))
	user = result.scalar_one_or_none()
	if user is None:
		raise HTTPException(
			status_code=status.HTTP_401_UNAUTHORIZED,
			detail="ユーザーが見つかりません",
			headers={"WWW-Authenticate": "Bearer"},
		)
	return user

@api_v0_router.post("/auth/login")
async def login(user_data: LoginSchema, db: AsyncSession = Depends(get_db), response: Response = None):
    result = await db.execute(select(User).filter(User.username == user_data.username))
    user = result.scalar_one_or_none()
    if not user or not pwd_context.verify(user_data.password, user.password):
        raise HTTPException(
			status_code=status.HTTP_401_UNAUTHORIZED,
			detail="Invalid username or password",
			headers={"WWW-Authenticate": "Bearer"},
		)
        
    access_token_expires = timedelta(minutes=60)
    token = create_access_token(
		data={"sub": user.username}, expires_delta=access_token_expires
	)
    
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False, # 本番環境ではTrueにする
        max_age=int(access_token_expires.total_seconds())
	)
    
    return {"message": "Logged in successfully"}

@api_v0_router.post("/polls")
async def create_poll(poll_data: PostCreateSchema, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
	# 新しい投票テーマを作成
	new_post = Post(
		id=uuid6.uuid7().bytes,
		title=poll_data.title,
		description=poll_data.description,
		created_at=datetime.utcnow(),
		category=poll_data.category,
		author=current_user.id
	)
	db.add(new_post)
	await db.flush()  # IDを取得するために
	
	# 選択肢を作成
	for i, choice_text in enumerate(poll_data.choices):
		choice = Choice(
			post_id=new_post.id,
			choice=choice_text,
			number=i + 1
		)
		db.add(choice)
	
	await db.commit()
	await db.refresh(new_post)
	
	return {
		"theme_id": uuid6.UUID(bytes=new_post.id).hex,
		"theme_name": new_post.title,
		"created_at": new_post.created_at.isoformat()
	}

@api_v0_router.put("/users/{user_id}")
async def update_user(user_id: str, user_data: UserUpdateSchema, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
	try:
		user_uuid = uuid6.UUID(user_id).bytes
	except ValueError:
		raise HTTPException(status_code=400, detail="Invalid user_id format")
	
	# 自分自身の情報のみ更新可能
	if current_user.id != user_uuid:
		raise HTTPException(status_code=403, detail="Can only update your own information")
	
	# ユーザー名の重複チェック
	if user_data.username:
		result = await db.execute(select(User).filter(User.username == user_data.username, User.id != user_uuid))
		existing_user = result.scalar_one_or_none()
		if existing_user:
			raise HTTPException(status_code=409, detail="Username already exists")
		current_user.username = user_data.username
	
	if user_data.displayname:
		current_user.displayname = user_data.displayname
	
	if user_data.password:
		current_user.password = pwd_context.hash(user_data.password)
	
	await db.commit()
	await db.refresh(current_user)
	
	return {
		"id": uuid6.UUID(bytes=current_user.id).hex,
		"username": current_user.username,
		"displayname": current_user.displayname
	}

@api_v0_router.post("/polls/{theme_id}/vote")
async def vote_poll(theme_id: str, vote_data: VoteSchema, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
	try:
		theme_uuid = uuid6.UUID(theme_id).bytes
	except ValueError:
		raise HTTPException(status_code=400, detail="Invalid theme_id format")
	
	# 投票テーマが存在するかチェック
	result = await db.execute(select(Post).filter(Post.id == theme_uuid))
	post = result.scalar_one_or_none()
	if not post:
		raise HTTPException(status_code=404, detail="Poll not found")
	
	# 選択肢が存在するかチェック
	result = await db.execute(select(Choice).filter(Choice.post_id == theme_uuid, Choice.number == vote_data.choice_number))
	choice = result.scalar_one_or_none()
	if not choice:
		raise HTTPException(status_code=400, detail="Invalid choice number")
	
	# 既存の投票をチェック
	result = await db.execute(select(Vote).filter(Vote.post_id == theme_uuid, Vote.user_id == current_user.id))
	existing_vote = result.scalar_one_or_none()
	
	if existing_vote:
		# 既存の投票を更新
		existing_vote.number = vote_data.choice_number
	else:
		# 新しい投票を作成
		new_vote = Vote(
			post_id=theme_uuid,
			user_id=current_user.id,
			number=vote_data.choice_number
		)
		db.add(new_vote)
	
	await db.commit()
	
	return {"message": "Vote recorded successfully"}

