from pydantic import BaseModel
from typing import Optional, List
from enum import Enum

class DegreeEnum(str, Enum):
    under_bachelor = "under_bachelor"
    bachelor = "bachelor"
    master = "master"
    phd = "phd"

class SkillResponse(BaseModel):
    id: int
    name: str

class MentorInfoResponse(BaseModel):
    id: int
    username: str
    email: str
    name: str
    family_name: str
    city: Optional[str]
    country: Optional[str]
    degree: Optional[DegreeEnum]
    field_of_study: Optional[str]
    university: Optional[str]
    skills: Optional[List[SkillResponse]]
    bio: Optional[str]
    cv_file: Optional[str]
    phone_number: Optional[str]
    profile_image: Optional[str]
    admin_validation: bool

    class Config:
        orm_mode = True

class MentorInfoUpdate(BaseModel):
    name: Optional[str]
    family_name: Optional[str]
    city: Optional[str]
    country: Optional[str]
    degree: Optional[DegreeEnum]
    field_of_study: Optional[str]
    university: Optional[str]
    skills: Optional[List[int]]
    bio: Optional[str]
    cv_file: Optional[str]
    phone_number: Optional[str]

class MentorPasswordUpdate(BaseModel):
    old_password: str
    new_password: str
