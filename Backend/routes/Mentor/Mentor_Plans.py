from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from utils.auth import get_current_user, get_db

from models.user import User, UserRole, UserDetails
from models.plan import Plan
from models.session import Session
from models.active_plan import ActivePlan, ActivePlanStatus

from schemas.Mentor.Mentor_Plans import *

router = APIRouter()

@router.get("/mentor/active_plans", response_model=list[MentorActivePlanResponse])
def get_active_plans(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.mentor:
        raise HTTPException(status_code=403, detail="Only mentors can view active plans")

    active_plans = db.query(ActivePlan).filter(ActivePlan.mentor_id == current_user.id , ActivePlan.status == ActivePlanStatus.active).all()

    response_data = []

    for plan in active_plans:
        mentor_user = db.query(UserDetails).filter(UserDetails.user_id == plan.mentor_id).first()
        
        response_data.append(
            MentorActivePlanResponse(
                id=plan.id,
                mentee_id=plan.mentee_id,
                mentor_id=plan.mentor_id,
                plan_id=plan.plan_id,
                start_date=plan.start_date,
                end_date=plan.end_date,
                status=plan.status,
                mentor_name=mentor_user.name if mentor_user else "N/A",
                mentor_family_name=mentor_user.family_name if mentor_user else "N/A"
            )
        )

    return response_data

@router.get("/mentor/all_plans", response_model=list[MentorActivePlanResponse])
def get_all_plans(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.mentor:
        raise HTTPException(status_code=403, detail="Only mentors can view active plans")

    active_plans = db.query(ActivePlan).filter(ActivePlan.mentor_id == current_user.id).all()

    response_data = []

    for plan in active_plans:
        mentor_user = db.query(UserDetails).filter(UserDetails.user_id == plan.mentor_id).first()
        
        response_data.append(
            MentorActivePlanResponse(
                id=plan.id,
                mentee_id=plan.mentee_id,
                mentor_id=plan.mentor_id,
                plan_id=plan.plan_id,
                start_date=plan.start_date,
                end_date=plan.end_date,
                status=plan.status,
                mentor_name=mentor_user.name if mentor_user else "N/A",
                mentor_family_name=mentor_user.family_name if mentor_user else "N/A"
            )
        )

    return response_data

@router.get("/mentor/plans", response_model=list[PlanResponse])
def show_plan(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)    
):
    if current_user.role != UserRole.mentor:
        raise HTTPException(status_code=403, detail="only mentors can see plans")
    
    plans = db.query(Plan).filter(Plan.mentor_id == current_user.id)
    return plans

@router.post("/mentor/plans", response_model=PlanResponse)
def create_plan(
    data: PlanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.mentor:
        raise HTTPException(status_code=403, detail="Only mentors can create plans")

    new_plan = Plan(
        mentor_id=current_user.id,
        title=data.title,
        description=data.description,
        session_time=data.session_time,
        number_of_sessions=data.number_of_sessions,
        max_response_time=data.max_response_time,
        price=data.price
    )
    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)
    return new_plan

@router.put("/mentor/plans/{plan_id}", response_model=PlanResponse)
def update_plan(
    plan_id: int,
    data: PlanUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plan = db.query(Plan).filter(Plan.id == plan_id, Plan.mentor_id == current_user.id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    for key, value in data.dict(exclude_unset=True).items():
        setattr(plan, key, value)

    db.commit()
    db.refresh(plan)
    return plan

@router.delete("/mentor/plans/{plan_id}")
def delete_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plan = db.query(Plan).filter(Plan.id == plan_id, Plan.mentor_id == current_user.id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    db.delete(plan)
    db.commit()
    return {"message": "Plan deleted successfully"}
