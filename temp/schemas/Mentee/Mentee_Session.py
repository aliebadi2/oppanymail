from pydantic import BaseModel
from datetime import datetime
from models.active_session import ActiveSessionStatus
from typing import Optional

class MenteeActiveSessionResponse(BaseModel):
      id: int
      mentee_id: int
      mentor_id: int
      session_id: int
      scheduled_time: Optional[datetime]
      status: ActiveSessionStatus
      mentor_name: Optional[str]
      mentor_family_name: Optional[str]

      class Config:
            orm_mode = True