from pydantic import BaseModel
from typing import Optional

class AdminSkillCreate(BaseModel):
    name: str
    description: Optional[str] = None

class AdminSkillResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    class Config:
        orm_mode = True

class AdminSkillUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
