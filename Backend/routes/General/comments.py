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


@router.get("/comments/mentor/{mentor_id}", response_model=list[CommentResponse])
def get_comments_for_mentor(
    mentor_id: int,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    comments = db.query(Comment).filter(Comment.mentor_id == mentor_id).options(
        joinedload(Comment.mentee).joinedload(User.details),
        joinedload(Comment.mentor).joinedload(User.details)
    ).offset(skip).limit(limit).all()

    return [
        create_comment_response(comment) for comment in comments
    ]


@router.get("/comments/random", response_model=list[CommentResponse])
def get_random_flagged_comments(db: Session = Depends(get_db)):
    flagged_comments = db.query(Comment).filter(Comment.show_on_main == True).options(
        joinedload(Comment.mentee).joinedload(User.details),
        joinedload(Comment.mentor).joinedload(User.details)
    ).all()

    random_comments = sample(flagged_comments, min(5, len(flagged_comments)))

    return [
        create_comment_response(comment) for comment in random_comments
    ]


@router.get("/mentor/{mentor_id}/average_score", response_model=AverageScoreResponse)
def get_average_score(mentor_id: int, db: Session = Depends(get_db)):
    average_score = db.query(func.avg(Comment.score)).filter(Comment.mentor_id == mentor_id).scalar()
    if average_score is None:
        raise HTTPException(status_code=404, detail="No score available for this mentor")

    return AverageScoreResponse(
        mentor_id=mentor_id,
        average_score=round(average_score, 2)  
    )


def create_comment_response(comment: Comment) -> CommentResponse:
    """ Helper function to create a consistent CommentResponse. """
    mentee_name = "کاربر"
    mentee_family_name = "ناشناس"
    mentee_profile_image = "default_profile_image.png"
    mentor_name = "منتور"
    mentor_family_name = "نامشخص"

    if comment.mentee and comment.mentee.details:
        mentee_name = comment.mentee.details.name or mentee_name
        mentee_family_name = comment.mentee.details.family_name or mentee_family_name
        mentee_profile_image = comment.mentee.details.profile_image or mentee_profile_image

    if comment.mentor and comment.mentor.details:
        mentor_name = comment.mentor.details.name or mentor_name
        mentor_family_name = comment.mentor.details.family_name or mentor_family_name

    date_created_jalali = JalaliDateTime(comment.date_created).strftime('%Y/%m/%d %H:%M:%S')

    return CommentResponse(
        id=comment.id,
        mentee_name=mentee_name,
        mentee_family_name=mentee_family_name,
        mentee_profile_image=mentee_profile_image,
        mentor_name=mentor_name,
        mentor_family_name=mentor_family_name,
        text=comment.text,
        score=comment.score,
        date_created=date_created_jalali,
        show_on_main=comment.show_on_main,
    )
