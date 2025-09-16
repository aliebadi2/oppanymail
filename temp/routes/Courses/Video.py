from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy.orm import Session
from typing import List

from models.Video import Video
from models.active_plan import ActivePlan
from models.user import User, UserRole
from schemas.Courses.Video import CreateVideoRequest, VideoResponse
from utils.auth import get_db, get_current_user

router = APIRouter()

def check_mentor_role(current_user: User):
    if current_user.role != UserRole.mentor and current_user.role != UserRole.mentee:
        raise HTTPException(status_code=403, detail="Only mentors or mentees can perform this action")

@router.get("/mentor/courses/{active_plan_id}/videos", response_model=List[VideoResponse])
def get_videos(
    active_plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_mentor_role(current_user)
    active_plan = db.query(ActivePlan).filter(
        ActivePlan.id == active_plan_id, ActivePlan.mentor_id == current_user.id
    ).first()

    if not active_plan:
        raise HTTPException(status_code=404, detail="Active plan not found or unauthorized access")

    return active_plan.videos


@router.post("/mentor/courses/{active_plan_id}/videos", response_model=VideoResponse, status_code=status.HTTP_201_CREATED)
def create_video(
    active_plan_id: int,
    request: CreateVideoRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_mentor_role(current_user)
    active_plan = db.query(ActivePlan).filter(
        ActivePlan.id == active_plan_id, ActivePlan.mentor_id == current_user.id
    ).first()

    if not active_plan:
        raise HTTPException(status_code=404, detail="Active plan not found or unauthorized access")

    new_video = Video(
        active_plan_id=active_plan.id,
        title=request.title,
        download_link=request.download_link
    )
    db.add(new_video)
    db.commit()
    db.refresh(new_video)
    return new_video


@router.put("/mentor/videos/{video_id}", response_model=VideoResponse)
def update_video(
    video_id: int,
    request: CreateVideoRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_mentor_role(current_user)
    video = db.query(Video).filter(Video.id == video_id).first()

    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    # Check if the current user is the mentor associated with the active plan
    if video.active_plan.mentor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized access")

    video.title = request.title
    video.download_link = request.download_link

    db.commit()
    db.refresh(video)
    return video


@router.delete("/mentor/videos/{video_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_video(
    video_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_mentor_role(current_user)
    video = db.query(Video).filter(Video.id == video_id).first()

    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    # Check if the current user is the mentor associated with the active plan
    if video.active_plan.mentor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized access")

    db.delete(video)
    db.commit()
