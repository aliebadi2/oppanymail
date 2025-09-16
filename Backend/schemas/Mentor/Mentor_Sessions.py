from pydantic import BaseModel
from datetime import datetime
from models.active_session import ActiveSessionStatus
from typing import Optional
from decimal import Decimal

class MentorActiveSessionResponse(BaseModel):
    id: int
    mentee_id: int
    mentor_id: int
    session_id: int
    scheduled_time: datetime
    status: ActiveSessionStatus
    mentor_name: Optional[str]
    mentor_family_name: Optional[str]

    class Config:
        orm_mode = True

class MentorSessionCreate(BaseModel):
    title: str
    description: Optional[str] = None
    session_time: int
    price: Decimal

class MentorSessionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    session_time: Optional[int] = None
    price: Optional[Decimal] = None

class MentorSessionResponse(BaseModel):
    id: int
    mentor_id: int
    title: str
    description: Optional[str] = None
    session_time: int
    price: Decimal
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
