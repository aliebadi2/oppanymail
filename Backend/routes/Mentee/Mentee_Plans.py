from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from utils.auth import get_current_user, get_db
from models.user import User, UserRole, UserDetails
from models.active_plan import ActivePlan
from typing import List
from schemas.Mentee.Mentee_Plans import *

router = APIRouter()

@router.get("/mentee/active_plans", response_model=List[MenteeActivePlanResponse])
def get_active_plans(
      db: Session = Depends(get_db),
      current_user: User = Depends(get_current_user)
):
      if current_user.role != UserRole.mentee:
            raise HTTPException(status_code=403, detail="Only mentees can view active plans")

      active_plans = db.query(ActivePlan).filter(ActivePlan.mentee_id == current_user.id).all()
      response = []
      for plan in active_plans:
            mentor = db.query(UserDetails).filter(UserDetails.user_id == plan.mentor_id).first()
            response.append(
                  MenteeActivePlanResponse(
                        id=plan.id,
                        mentee_id=plan.mentee_id,
                        mentor_id=plan.mentor_id,
                        plan_id=plan.plan_id,
                        start_date=plan.start_date,
                        end_date=plan.end_date,
                        status=plan.status,
                        mentor_name=mentor.name,
                        mentor_family_name=mentor.family_name
                  )
            )
      return response
      
      

