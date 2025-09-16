from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from models.comments import Comment
from models.user import User, UserRole
from schemas.General.comments import CommentCreate, CommentResponse, AverageScoreResponse
from utils.auth import get_current_user, get_db
from random import sample
from persiantools.jdatetime import JalaliDateTime

router = APIRouter()


@router.post("/comments", response_model=CommentResponse)
def create_comment(
    data: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.mentee:
        raise HTTPException(status_code=403, detail="Only mentees can create comments")

    mentor = db.query(User).options(joinedload(User.details)).filter(User.id == data.mentor_id).first()
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")

    # Ensure that user details are loaded
    if not current_user.details or not mentor.details:
        raise HTTPException(status_code=400, detail="User details are incomplete")

    # Handle profile image (default if missing)
    mentee_profile_image = current_user.details.profile_image or "default_profile_image.png"

    new_comment = Comment(
        mentee_id=current_user.id,
        mentor_id=mentor.id,
        text=data.text,
        score=data.score,
        show_on_main=False  # Default to False; admin can update
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    # Format date_created as Jalali date string
    date_created_jalali = JalaliDateTime(new_comment.date_created).strftime('%Y/%m/%d %H:%M:%S')

    return CommentResponse(
        id=new_comment.id,
        mentee_name=current_user.details.name,
        mentee_family_name=current_user.details.family_name,
        mentee_profile_image=mentee_profile_image,
        mentor_name=mentor.details.name,
        mentor_family_name=mentor.details.family_name,
        text=new_comment.text,
        score=new_comment.score,
        date_created=date_created_jalali,
        show_on_main=new_comment.show_on_main,
    )