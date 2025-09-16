from pydantic import BaseModel
from enum import Enum
from typing import List, Optional


class Degree(str, Enum):
    under_bachelor = "under_bachelor"
    bachelor = "bachelor"
    master = "master"
    phd = "phd"


class MentorSkillResponse(BaseModel):
    id: int
    name: str


class MentorDetailsResponse(BaseModel):
    name: str
    family_name: str
    city: Optional[str]
    country: Optional[str]
    degree: Optional[Degree]
    field_of_study: Optional[str]
    university: Optional[str]
    skills_names: List[str]
    bio: Optional[str]
    profile_image: Optional[str]

    class Config:
        from_attributes = True


class MentorResponse(BaseModel):
    user_id: int
    username: str
    user_info: MentorDetailsResponse

    class Config:
        from_attributes = True
