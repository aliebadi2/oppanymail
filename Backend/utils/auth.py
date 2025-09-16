import uuid
import json
from datetime import datetime, timedelta
from fastapi import HTTPException, Request, Depends
from redis import Redis
from sqlalchemy.orm import Session
from config import settings
from models.user import User
from database import get_db

redis_client = Redis(host=settings.redis_host, port=settings.redis_port, decode_responses=True)

def create_session(user_id: int, expires_delta: int = None):
    if expires_delta is None:
        expires_delta = settings.session_expire_minutes
    session_id = str(uuid.uuid4())
    expire = datetime.utcnow() + timedelta(minutes=expires_delta)
    session_data = {
        "user_id": user_id,
        "expires": expire.isoformat()
    }
    session_data_json = json.dumps(session_data)
    session_key = f"session:{session_id}"
    redis_client.setex(session_key, timedelta(minutes=expires_delta), session_data_json)
    return session_id

def get_session(session_id: str):
    session_key = f"session:{session_id}"
    session_data_json = redis_client.get(session_key)
    if not session_data_json:
        raise HTTPException(status_code=401, detail="Session expired or invalid")

    session_data = json.loads(session_data_json)
    expire_time = datetime.fromisoformat(session_data.get("expires"))
    if datetime.utcnow() > expire_time:
        redis_client.delete(session_key)
        raise HTTPException(status_code=401, detail="Session expired")
    return session_data

def revoke_session(session_id: str):
    session_key = f"session:{session_id}"
    redis_client.delete(session_key)

def get_current_user(request: Request, db: Session = Depends(get_db)):
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=401, detail="Session cookie missing")

    session_data = get_session(session_id)
    user_id = session_data.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid session data")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user
