from fastapi import APIRouter, HTTPException, Depends, Response, Request
from sqlalchemy.orm import Session, joinedload
from utils.hashing import Hash
from utils.auth import create_session, revoke_session, get_current_user, get_db
from schemas.LoginSignup.login import LoginRequest
from models.user import User, UserRole
from database import SessionLocal

router = APIRouter()

@router.post("/login")
def login(data: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).options(joinedload(User.details)).filter(User.username == data.username).first()

    if not user or not Hash.verify(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not user.email_validation:
        raise HTTPException(status_code=401, detail="Email not validated")

    if user.role == UserRole.mentor and not user.details.admin_validation:
        raise HTTPException(status_code=403, detail="Account pending admin approval")

    session_id = create_session(user_id=user.id)
    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        secure=True,
        samesite="Lax"
    )
    return {"message": "Login successful"}

@router.post("/logout")
def logout(request: Request, response: Response):
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=401, detail="Session cookie missing")

    revoke_session(session_id)
    response.delete_cookie("session_id")
    return {"message": "Logged out successfully"}

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role.value,
    }

@router.get("/is_logged_in")
def is_logged_in(request: Request, db: Session = Depends(get_db)):
    try:
        current_user = get_current_user(request, db)
        return {
            "is_logged_in": True,
            "user_id": current_user.id,
            "username": current_user.username,
            "role": current_user.role.value
        }
    except HTTPException:
        return {"is_logged_in": False}

