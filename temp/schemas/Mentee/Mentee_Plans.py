from pydantic import BaseModel
from datetime import datetime
from models.active_plan import ActivePlanStatus
from typing import Optional

class MenteeActivePlanResponse(BaseModel):
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

