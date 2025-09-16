from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy.orm import Session
from typing import List

from models.Webinar import Webinar
from models.active_plan import ActivePlan
from models.user import User, UserRole
from schemas.Courses.Webinar import CreateWebinarRequest, WebinarResponse
from utils.auth import get_db, get_current_user

router = APIRouter()

def check_mentor_role(current_user: User):
    if current_user.role != UserRole.mentor and current_user.role != UserRole.mentee:
        raise HTTPException(status_code=403, detail="Only mentors or mentees can perform this action")

@router.get("/mentor/courses/{active_plan_id}/webinars", response_model=List[WebinarResponse])
def get_webinars(
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

    return active_plan.webinars


@router.post("/mentor/courses/{active_plan_id}/webinars", response_model=WebinarResponse, status_code=status.HTTP_201_CREATED)
def create_webinar(
    active_plan_id: int,
    request: CreateWebinarRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_mentor_role(current_user)
    active_plan = db.query(ActivePlan).filter(
        ActivePlan.id == active_plan_id, ActivePlan.mentor_id == current_user.id
    ).first()

    if not active_plan:
        raise HTTPException(status_code=404, detail="Active plan not found or unauthorized access")

    new_webinar = Webinar(
        active_plan_id=active_plan.id,
        name=request.name,
        date=request.date,
        time=request.time,
        link=request.link
    )
    db.add(new_webinar)
    db.commit()
    db.refresh(new_webinar)
    return new_webinar


@router.put("/mentor/webinars/{webinar_id}", response_model=WebinarResponse)
def update_webinar(
    webinar_id: int,
    request: CreateWebinarRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_mentor_role(current_user)
    webinar = db.query(Webinar).filter(Webinar.id == webinar_id).first()

    if not webinar:
        raise HTTPException(status_code=404, detail="Webinar not found")

    # Check if the current user is the mentor associated with the active plan
    if webinar.active_plan.mentor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized access")

    webinar.name = request.name
    webinar.date = request.date
    webinar.time = request.time
    webinar.link = request.link

    db.commit()
    db.refresh(webinar)
    return webinar


@router.delete("/mentor/webinars/{webinar_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_webinar(
    webinar_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_mentor_role(current_user)
    webinar = db.query(Webinar).filter(Webinar.id == webinar_id).first()

    if not webinar:
        raise HTTPException(status_code=404, detail="Webinar not found")

    # Check if the current user is the mentor associated with the active plan
    if webinar.active_plan.mentor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized access")

    db.delete(webinar)
    db.commit()
