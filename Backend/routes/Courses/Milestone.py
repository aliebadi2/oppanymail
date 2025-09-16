from fastapi import APIRouter, Depends, HTTPException, Path, status
from sqlalchemy.orm import Session
from typing import List

from models.Milestone import Milestone
from models.active_plan import ActivePlan
from models.user import User, UserRole
from schemas.Courses.Milestone import CreateMilestoneRequest, MilestoneResponse
from utils.auth import get_db, get_current_user

router = APIRouter()

def check_mentor_role(current_user: User):
    if current_user.role != UserRole.mentor and current_user.role != UserRole.mentee:
        raise HTTPException(status_code=403, detail="Only mentors or mentees can perform this action")

@router.get("/mentor/courses/{active_plan_id}/milestones", response_model=List[MilestoneResponse])
def get_milestones(
    active_plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_mentor_role(current_user)
    active_plan = db.query(ActivePlan).filter(
        ActivePlan.id == active_plan_id, ActivePlan.mentor_id == current_user.id
    ).first()

    if not active_plan:
        raise HTTPException(status_code=404, detail="Active plan not found")

    return active_plan.milestones


@router.post("/mentor/courses/{active_plan_id}/milestones", response_model=MilestoneResponse, status_code=status.HTTP_201_CREATED)
def create_milestone(
    active_plan_id: int,
    request: CreateMilestoneRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_mentor_role(current_user)
    active_plan = db.query(ActivePlan).filter(
        ActivePlan.id == active_plan_id, ActivePlan.mentor_id == current_user.id
    ).first()

    if not active_plan:
        raise HTTPException(status_code=404, detail="Active plan not found")

    new_milestone = Milestone(
        active_plan_id=active_plan.id,
        title=request.title,
        text=request.text,
        type=request.type,
        level=request.level
    )
    db.add(new_milestone)
    db.commit()
    db.refresh(new_milestone)
    return new_milestone


@router.put("/mentor/milestones/{milestone_id}", response_model=MilestoneResponse)
def update_milestone(
    milestone_id: int,
    request: CreateMilestoneRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_mentor_role(current_user)
    milestone = db.query(Milestone).filter(Milestone.id == milestone_id).first()

    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")

    milestone.title = request.title
    milestone.text = request.text
    milestone.type = request.type
    milestone.level = request.level

    db.commit()
    db.refresh(milestone)
    return milestone


@router.delete("/mentor/milestones/{milestone_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_milestone(
    milestone_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_mentor_role(current_user)
    milestone = db.query(Milestone).filter(Milestone.id == milestone_id).first()

    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")

    db.delete(milestone)
    db.commit()
