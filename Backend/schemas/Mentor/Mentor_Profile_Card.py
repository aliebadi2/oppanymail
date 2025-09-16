from pydantic import BaseModel
from typing import Optional, List
from decimal import Decimal
from enum import Enum

class MentorPlanOut(BaseModel):
    id: int
    mentor_id: int
    title: str
    description: Optional[str]
    session_time: int
    number_of_sessions: int
    max_response_time: int
    price: float

    class Config:
        from_attributes = True

class MentorSessionOut(BaseModel):
    id: int
    mentor_id: int
    title: str
    description: Optional[str]
    session_time: int
    price: float

    class Config:
        from_attributes = True

class MentorCardResponse(BaseModel):
    plans: List[MentorPlanOut]
    sessions: List[MentorSessionOut]

class MentorRequestStatusEnum(str, Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"
    expired = "expired"

class MenteeInfo(BaseModel):
    id: int
    name: str
    family_name: str
    profile_image: Optional[str]

class PlanInfo(BaseModel):
    id: Optional[int]
    title: Optional[str]
    description: Optional[str]
    price: Optional[float]

class SessionInfo(BaseModel):
    id: Optional[int]
    title: Optional[str]
    description: Optional[str]
    price: Optional[float]

class MentorRequestResponse(BaseModel):
    request_id: int
    mentee_info: MenteeInfo
    plan_info: Optional[PlanInfo] = None
    session_info: Optional[SessionInfo] = None
    amount: Decimal
    status: MentorRequestStatusEnum
    created_at: str
    expiration_date: str

    class Config:
        from_attributes = True
