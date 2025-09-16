from enum import Enum
from typing import List
from pydantic import BaseModel, Field, EmailStr

class Degree(str, Enum):
    under_bachelor = "under_bachelor"
    bachelor = "bachelor"
    master = "master"
    phd = "phd"

class MentorSignup(BaseModel):
    username: str = Field(..., max_length=50)
    password: str = Field(..., min_length=8)
    email: EmailStr
    name: str = Field(..., max_length=50)
    family_name: str = Field(..., max_length=50)
    city: str
    country: str
    degree: Degree
    field_of_study: str
    university: str
    skills: List[int]  # List of skill IDs
    bio: str

class MenteeSignup(BaseModel):
    username: str = Field(..., max_length=50)
    password: str = Field(..., min_length=8)
    email: EmailStr
    name: str = Field(..., max_length=50)
    family_name: str = Field(..., max_length=50)

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    signup_date: str

    class Config:
        from_attributes = True  # Updated for Pydantic V2
