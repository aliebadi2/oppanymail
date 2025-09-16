from pydantic import BaseModel
from datetime import datetime
from models.active_plan import ActivePlanStatus
from typing import Optional
from decimal import Decimal

class MentorActivePlanResponse(BaseModel):
    id: int
    mentee_id: int
    mentor_id: int
    plan_id: int
    start_date: datetime
    end_date: Optional[datetime]
    status: ActivePlanStatus
    mentor_name: str
    mentor_family_name: str

    class Config:
        orm_mode = True

class PlanCreate(BaseModel):
    title: str
    description: Optional[str] = None
    session_time: int  # In minutes
    number_of_sessions: int
    max_response_time: int  # In hours
    price: Decimal

class PlanUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    session_time: Optional[int] = None
    number_of_sessions: Optional[int] = None
    max_response_time: Optional[int] = None
    price: Optional[Decimal] = None

class PlanResponse(BaseModel):
    id: int
    mentor_id: int
    title: str
    description: Optional[str] = None
    session_time: int
    number_of_sessions: int
    max_response_time: int
    price: Decimal
    created_at: datetime
    updated_at: Optional[datetime] = None  

    class Config:
        orm_mode = True
