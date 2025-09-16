from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session, joinedload
from models.comments import Comment
from models.user import User, UserRole
from schemas.Admin.Admin_Comment import AdminCommentResponse
from utils.auth import get_current_user, get_db
from persiantools.jdatetime import JalaliDateTime

router = APIRouter()


@router.get("/admin/comments", response_model=list[AdminCommentResponse])
def get_all_comments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100
):
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Access forbidden")

    comments = db.query(Comment).options(
        joinedload(Comment.mentee).joinedload(User.details),
        joinedload(Comment.mentor).joinedload(User.details)
    ).offset(skip).limit(limit).all()

    return [
        create_comment_response(comment) for comment in comments
    ]

@router.patch("/admin/comments/flag/{comment_id}")
def update_comment_flag(
    comment_id: int,
    show_on_main: bool = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Access forbidden")

    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    comment.show_on_main = show_on_main
    db.commit()
    return {"message": "Comment flag updated successfully"}

@router.delete("/admin/comments/{comment_id}")
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Access forbidden")

    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted successfully"}

def create_comment_response(comment: Comment) -> AdminCommentResponse:
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

    return AdminCommentResponse(
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