from pydantic import BaseModel
from typing import Optional, List
from decimal import Decimal
from enum import Enum

class MenteeRequestType(str, Enum):
    plan = "plan"
    session = "session"

class MenteeRequestStatusEnum(str, Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"

class MenteeRequestCreate(BaseModel):
    plan_or_session_id: int
    type: MenteeRequestType

class MenteeRequestResponse(BaseModel):
    id: int
    mentee_id: int
    mentor_id: int
    plan_id: Optional[int]
    session_id: Optional[int]
    amount: Decimal
    status: MenteeRequestStatusEnum

    class Config:
        orm_mode = True