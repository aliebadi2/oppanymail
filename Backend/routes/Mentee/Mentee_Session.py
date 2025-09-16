from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from utils.auth import get_current_user, get_db
from models.user import User, UserRole, UserDetails
from models.active_session import ActiveSession
from typing import List
from schemas.Mentee.Mentee_Session import *

router = APIRouter()

@router.get("/mentee/active_sessions", response_model=List[MenteeActiveSessionResponse])
def get_active_sessions(
      db: Session = Depends(get_db),
      current_user: User = Depends(get_current_user)
):
      if current_user.role != UserRole.mentee:
            raise HTTPException(status_code=403, detail="Only mentees can view active sessions")

      active_sessions = db.query(ActiveSession).filter(ActiveSession.mentee_id == current_user.id).all()

      response = []
      for session in active_sessions:
            mentor = db.query(UserDetails).filter(UserDetails.user_id == session.mentor_id).first()
            ins = MenteeActiveSessionResponse(
                  id=session.id,
                  mentee_id=session.mentee_id,
                  mentor_id=session.mentor_id,
                  session_id=session.session_id,
                  scheduled_time=session.scheduled_time,
                  status=session.status,
                  mentor_name=mentor.name if mentor else None,
                  mentor_family_name=mentor.family_name if mentor else None,
            )
            response.append(ins)

      return response

