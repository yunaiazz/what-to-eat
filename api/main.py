"""
吃什么 - 社区 API 服务
使用 FastAPI + SQLite
"""
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import sqlite3
import hashlib
import random
import time
import os
from contextlib import contextmanager

app = FastAPI(title="吃什么社区 API")

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据库路径
DB_PATH = os.path.join(os.path.dirname(__file__), "community.db")

# 随机名字生成器
ADJECTIVES = [
    "快乐的", "饥饿的", "可爱的", "迷糊的", "慵懒的", "元气", "甜蜜的", "萌萌的",
    "吃货", "贪吃的", "美食家", "干饭", "暴躁的", "佛系", "社恐", "i人"
]
NOUNS = [
    "小猫咪", "小狗狗", "小兔子", "小熊猫", "小企鹅", "小海豹", "小仓鼠", "小柴犬",
    "美食家", "吃货", "干饭人", "碳水王", "甜品控", "奶茶星人", "火锅侠", "烧烤侠"
]

def generate_random_name():
    """生成随机用户名"""
    adj = random.choice(ADJECTIVES)
    noun = random.choice(NOUNS)
    num = random.randint(100, 999)
    return f"{adj}{noun}{num}"

def generate_avatar(wallet_address: str):
    """基于钱包地址生成头像 URL (使用 DiceBear API)"""
    seed = hashlib.md5(wallet_address.lower().encode()).hexdigest()[:8]
    styles = ["adventurer", "avataaars", "bottts", "fun-emoji", "lorelei", "micah", "miniavs", "open-peeps", "personas", "pixel-art"]
    style = random.choice(styles)
    return f"https://api.dicebear.com/7.x/{style}/svg?seed={seed}"

@contextmanager
def get_db():
    """数据库连接上下文管理器"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    """初始化数据库表"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # 用户表
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                wallet_address TEXT UNIQUE NOT NULL,
                username TEXT NOT NULL,
                avatar TEXT NOT NULL,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL
            )
        """)
        
        # 帖子表
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                food_name TEXT NOT NULL,
                food_emoji TEXT DEFAULT '🍽️',
                mood TEXT,
                content TEXT,
                image_url TEXT,
                likes INTEGER DEFAULT 0,
                created_at INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)
        
        # 评论表
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS comments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                post_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                content TEXT NOT NULL,
                created_at INTEGER NOT NULL,
                FOREIGN KEY (post_id) REFERENCES posts(id),
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)
        
        # 点赞表
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS likes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                post_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                created_at INTEGER NOT NULL,
                UNIQUE(post_id, user_id),
                FOREIGN KEY (post_id) REFERENCES posts(id),
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)
        
        conn.commit()

# 启动时初始化数据库
init_db()

# ========== Pydantic 模型 ==========

class WalletAuth(BaseModel):
    wallet_address: str
    signature: Optional[str] = None

class UserUpdate(BaseModel):
    username: Optional[str] = None
    avatar: Optional[str] = None

class PostCreate(BaseModel):
    wallet_address: str
    food_name: str
    food_emoji: Optional[str] = "🍽️"
    mood: Optional[str] = None
    content: Optional[str] = None

class CommentCreate(BaseModel):
    wallet_address: str
    content: str

class UserResponse(BaseModel):
    id: int
    wallet_address: str
    username: str
    avatar: str
    created_at: int

class PostResponse(BaseModel):
    id: int
    user: dict
    food_name: str
    food_emoji: str
    mood: Optional[str]
    content: Optional[str]
    likes: int
    liked: bool
    comment_count: int
    created_at: int

class CommentResponse(BaseModel):
    id: int
    user: dict
    content: str
    created_at: int

# ========== API 端点 ==========

@app.get("/")
def root():
    return {"message": "吃什么社区 API", "version": "1.0.0"}

@app.post("/auth/wallet", response_model=UserResponse)
def auth_wallet(data: WalletAuth):
    """钱包登录/注册"""
    wallet = data.wallet_address.lower()
    now = int(time.time())
    
    with get_db() as conn:
        cursor = conn.cursor()
        
        # 检查用户是否存在
        cursor.execute("SELECT * FROM users WHERE wallet_address = ?", (wallet,))
        user = cursor.fetchone()
        
        if user:
            return dict(user)
        
        # 创建新用户
        username = generate_random_name()
        avatar = generate_avatar(wallet)
        
        cursor.execute("""
            INSERT INTO users (wallet_address, username, avatar, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
        """, (wallet, username, avatar, now, now))
        conn.commit()
        
        user_id = cursor.lastrowid
        return {
            "id": user_id,
            "wallet_address": wallet,
            "username": username,
            "avatar": avatar,
            "created_at": now
        }

@app.get("/user/{wallet_address}", response_model=UserResponse)
def get_user(wallet_address: str):
    """获取用户信息"""
    wallet = wallet_address.lower()
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE wallet_address = ?", (wallet,))
        user = cursor.fetchone()
        
        if not user:
            raise HTTPException(status_code=404, detail="用户不存在")
        
        return dict(user)

@app.put("/user/{wallet_address}", response_model=UserResponse)
def update_user(wallet_address: str, data: UserUpdate):
    """更新用户信息"""
    wallet = wallet_address.lower()
    now = int(time.time())
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE wallet_address = ?", (wallet,))
        user = cursor.fetchone()
        
        if not user:
            raise HTTPException(status_code=404, detail="用户不存在")
        
        updates = []
        values = []
        
        if data.username:
            updates.append("username = ?")
            values.append(data.username)
        if data.avatar:
            updates.append("avatar = ?")
            values.append(data.avatar)
        
        if updates:
            updates.append("updated_at = ?")
            values.append(now)
            values.append(wallet)
            
            cursor.execute(f"""
                UPDATE users SET {', '.join(updates)} WHERE wallet_address = ?
            """, values)
            conn.commit()
        
        cursor.execute("SELECT * FROM users WHERE wallet_address = ?", (wallet,))
        return dict(cursor.fetchone())

@app.post("/posts", response_model=PostResponse)
def create_post(data: PostCreate):
    """创建帖子"""
    wallet = data.wallet_address.lower()
    now = int(time.time())
    
    with get_db() as conn:
        cursor = conn.cursor()
        
        # 获取用户
        cursor.execute("SELECT * FROM users WHERE wallet_address = ?", (wallet,))
        user = cursor.fetchone()
        
        if not user:
            raise HTTPException(status_code=401, detail="请先连接钱包")
        
        # 创建帖子
        cursor.execute("""
            INSERT INTO posts (user_id, food_name, food_emoji, mood, content, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (user["id"], data.food_name, data.food_emoji or "🍽️", data.mood, data.content, now))
        conn.commit()
        
        post_id = cursor.lastrowid
        
        return {
            "id": post_id,
            "user": {
                "id": user["id"],
                "username": user["username"],
                "avatar": user["avatar"],
                "wallet_address": user["wallet_address"]
            },
            "food_name": data.food_name,
            "food_emoji": data.food_emoji or "🍽️",
            "mood": data.mood,
            "content": data.content,
            "likes": 0,
            "liked": False,
            "comment_count": 0,
            "created_at": now
        }

@app.get("/posts")
def get_posts(page: int = 1, limit: int = 20, wallet_address: Optional[str] = None):
    """获取帖子列表"""
    offset = (page - 1) * limit
    current_wallet = wallet_address.lower() if wallet_address else None
    
    with get_db() as conn:
        cursor = conn.cursor()
        
        # 获取帖子
        cursor.execute("""
            SELECT p.*, u.username, u.avatar, u.wallet_address,
                   (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
            FROM posts p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
            LIMIT ? OFFSET ?
        """, (limit, offset))
        
        posts = []
        for row in cursor.fetchall():
            post = dict(row)
            
            # 检查当前用户是否点赞
            liked = False
            if current_wallet:
                cursor.execute("""
                    SELECT 1 FROM likes l
                    JOIN users u ON l.user_id = u.id
                    WHERE l.post_id = ? AND u.wallet_address = ?
                """, (post["id"], current_wallet))
                liked = cursor.fetchone() is not None
            
            posts.append({
                "id": post["id"],
                "user": {
                    "id": post["user_id"],
                    "username": post["username"],
                    "avatar": post["avatar"],
                    "wallet_address": post["wallet_address"]
                },
                "food_name": post["food_name"],
                "food_emoji": post["food_emoji"],
                "mood": post["mood"],
                "content": post["content"],
                "likes": post["likes"],
                "liked": liked,
                "comment_count": post["comment_count"],
                "created_at": post["created_at"]
            })
        
        # 获取总数
        cursor.execute("SELECT COUNT(*) FROM posts")
        total = cursor.fetchone()[0]
        
        return {
            "posts": posts,
            "total": total,
            "page": page,
            "limit": limit,
            "has_more": offset + limit < total
        }

@app.post("/posts/{post_id}/like")
def like_post(post_id: int, data: WalletAuth):
    """点赞/取消点赞"""
    wallet = data.wallet_address.lower()
    now = int(time.time())
    
    with get_db() as conn:
        cursor = conn.cursor()
        
        # 获取用户
        cursor.execute("SELECT id FROM users WHERE wallet_address = ?", (wallet,))
        user = cursor.fetchone()
        
        if not user:
            raise HTTPException(status_code=401, detail="请先连接钱包")
        
        user_id = user["id"]
        
        # 检查是否已点赞
        cursor.execute("""
            SELECT id FROM likes WHERE post_id = ? AND user_id = ?
        """, (post_id, user_id))
        existing = cursor.fetchone()
        
        if existing:
            # 取消点赞
            cursor.execute("DELETE FROM likes WHERE id = ?", (existing["id"],))
            cursor.execute("UPDATE posts SET likes = likes - 1 WHERE id = ?", (post_id,))
            liked = False
        else:
            # 添加点赞
            cursor.execute("""
                INSERT INTO likes (post_id, user_id, created_at) VALUES (?, ?, ?)
            """, (post_id, user_id, now))
            cursor.execute("UPDATE posts SET likes = likes + 1 WHERE id = ?", (post_id,))
            liked = True
        
        conn.commit()
        
        # 获取最新点赞数
        cursor.execute("SELECT likes FROM posts WHERE id = ?", (post_id,))
        likes = cursor.fetchone()["likes"]
        
        return {"liked": liked, "likes": likes}

@app.get("/posts/{post_id}/comments")
def get_comments(post_id: int, page: int = 1, limit: int = 50):
    """获取帖子评论"""
    offset = (page - 1) * limit
    
    with get_db() as conn:
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT c.*, u.username, u.avatar, u.wallet_address
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = ?
            ORDER BY c.created_at ASC
            LIMIT ? OFFSET ?
        """, (post_id, limit, offset))
        
        comments = []
        for row in cursor.fetchall():
            comment = dict(row)
            comments.append({
                "id": comment["id"],
                "user": {
                    "id": comment["user_id"],
                    "username": comment["username"],
                    "avatar": comment["avatar"],
                    "wallet_address": comment["wallet_address"]
                },
                "content": comment["content"],
                "created_at": comment["created_at"]
            })
        
        cursor.execute("SELECT COUNT(*) FROM comments WHERE post_id = ?", (post_id,))
        total = cursor.fetchone()[0]
        
        return {
            "comments": comments,
            "total": total,
            "page": page,
            "has_more": offset + limit < total
        }

@app.post("/posts/{post_id}/comments", response_model=CommentResponse)
def create_comment(post_id: int, data: CommentCreate):
    """创建评论"""
    wallet = data.wallet_address.lower()
    now = int(time.time())
    
    with get_db() as conn:
        cursor = conn.cursor()
        
        # 获取用户
        cursor.execute("SELECT * FROM users WHERE wallet_address = ?", (wallet,))
        user = cursor.fetchone()
        
        if not user:
            raise HTTPException(status_code=401, detail="请先连接钱包")
        
        # 检查帖子是否存在
        cursor.execute("SELECT id FROM posts WHERE id = ?", (post_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="帖子不存在")
        
        # 创建评论
        cursor.execute("""
            INSERT INTO comments (post_id, user_id, content, created_at)
            VALUES (?, ?, ?, ?)
        """, (post_id, user["id"], data.content, now))
        conn.commit()
        
        comment_id = cursor.lastrowid
        
        return {
            "id": comment_id,
            "user": {
                "id": user["id"],
                "username": user["username"],
                "avatar": user["avatar"],
                "wallet_address": user["wallet_address"]
            },
            "content": data.content,
            "created_at": now
        }

@app.delete("/posts/{post_id}")
def delete_post(post_id: int, wallet_address: str):
    """删除帖子（仅作者可删除）"""
    wallet = wallet_address.lower()
    
    with get_db() as conn:
        cursor = conn.cursor()
        
        # 检查权限
        cursor.execute("""
            SELECT p.id FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.id = ? AND u.wallet_address = ?
        """, (post_id, wallet))
        
        if not cursor.fetchone():
            raise HTTPException(status_code=403, detail="无权删除此帖子")
        
        # 删除相关数据
        cursor.execute("DELETE FROM comments WHERE post_id = ?", (post_id,))
        cursor.execute("DELETE FROM likes WHERE post_id = ?", (post_id,))
        cursor.execute("DELETE FROM posts WHERE id = ?", (post_id,))
        conn.commit()
        
        return {"success": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
