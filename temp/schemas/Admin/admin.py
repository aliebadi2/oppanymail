from pydantic import BaseModel
from typing import Optional, List
from enum import Enum

class DegreeEnum(str, Enum):
    under_bachelor = "under_bachelor"
    bachelor = "bachelor"
    master = "master"
    phd = "phd"

class MentorDetailsResponse(BaseModel):
    id: int
    username: str
    email: str
    name: str
    family_name: str
    city: Optional[str] = None
    country: Optional[str] = None
    degree: Optional[DegreeEnum] = None
    field_of_study: Optional[str] = None
    university: Optional[str] = None
    skills: Optional[List[str]] = None  # Changed to list of skill names
    bio: Optional[str] = None
    cv_file: Optional[str] = None
    phone_number: Optional[str] = None
    admin_validation: bool
    profile_image: Optional[str] = None

    class Config:
        from_attributes = True
