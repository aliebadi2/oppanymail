from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from enum import Enum

class RequestStatusEnum(str, Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"
    expired = "expired"

class MentorCheckInfo(BaseModel):
    name: str
    family_name: str
    profile_image: Optional[str]

class PlanCheckInfo(BaseModel):
    id: Optional[int]
    title: Optional[str]
    description: Optional[str]
    price: Optional[float]

class SessionCheckInfo(BaseModel):
    id: Optional[int]
    title: Optional[str]
    description: Optional[str]
    price: Optional[float]

class MenteeCheckRequestResponse(BaseModel):
    request_id: int
    mentor_info: MentorCheckInfo
    plan_info: Optional[PlanCheckInfo] = None
    session_info: Optional[SessionCheckInfo] = None
    amount: Decimal
    status: RequestStatusEnum
    created_at: str
    expiration_date: str

    class Config:
        from_attributes = True
