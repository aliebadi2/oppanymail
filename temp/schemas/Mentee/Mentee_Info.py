from pydantic import BaseModel
from typing import Optional, List
from decimal import Decimal
from datetime import datetime
from enum import Enum

class DegreeEnum(str, Enum):
    under_bachelor = "under_bachelor"
    bachelor = "bachelor"
    master = "master"
    phd = "phd"

class MenteeInfoResponse(BaseModel):
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
    skills: Optional[List[str]]
    bio: Optional[str]  # Changed from 'info_about_mentee' to 'bio'
    phone_number: Optional[str]
    profile_image: Optional[str]  # URL or path to the profile image

    class Config:
        orm_mode = True

class MenteeInfoUpdate(BaseModel):
    name: Optional[str]
    family_name: Optional[str]
    city: Optional[str]
    country: Optional[str]
    degree: Optional[DegreeEnum]
    field_of_study: Optional[str]
    university: Optional[str]
    skills: Optional[List[str]]
    bio: Optional[str]  # Changed from 'info_about_mentee' to 'bio'
    phone_number: Optional[str]

class ProfileImageResponse(BaseModel):
    user_id: int
    profile_image_path: str

    class Config:
        orm_mode = True

class MenteePasswordUpdate(BaseModel):
    old_password: str
    new_password: str