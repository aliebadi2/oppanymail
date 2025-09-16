from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from enum import Enum

class RequestStatusEnum(str, Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"
    expired = "expired"

class AdminMenteeInfo(BaseModel):
    name: str
    family_name: str
    profile_image: Optional[str]

class AdminMentorInfo(BaseModel):
    name: str
    family_name: str
    profile_image: Optional[str]

class AdminPlanInfo(BaseModel):
    id: Optional[int]
    title: Optional[str]
    description: Optional[str]
    price: Optional[float]

class AdminSessionInfo(BaseModel):
    id: Optional[int]
    title: Optional[str]
    description: Optional[str]
    price: Optional[float]

class AdminManageRequestResponse(BaseModel):
    request_id: int
    mentee_info: AdminMenteeInfo
    mentor_info: AdminMentorInfo
    plan_info: Optional[AdminPlanInfo] = None
    session_info: Optional[AdminSessionInfo] = None
    amount: Decimal
    status: RequestStatusEnum
    created_at: str
    expiration_date: str

    class Config:
        from_attributes = True
