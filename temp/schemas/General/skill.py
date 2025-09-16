from pydantic import BaseModel
from typing import Optional

class SkillResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    class Config:
        orm_mode = True

