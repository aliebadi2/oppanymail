from fastapi import APIRouter, Depends, HTTPException, File
from utils.auth import get_current_user, get_db
from sqlalchemy.orm import Session
from models.user import User, UserRole, UserDetails, Degree
from schemas.LoginSignup.welcome import UserWelcome

router = APIRouter()

@router.get("/welcome", response_model=UserWelcome)
def welcome_login(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    details = user.details
    
    if not details:
        details = UserDetails(user_id=user.id)
        db.add(details)

    return UserWelcome(name=details.name, family_name=details.family_name,)