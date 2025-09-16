from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from utils.auth import get_current_user, get_db
from models.user import User, UserRole, UserDetails
from models.session import Session
from models.active_session import ActiveSession, ActiveSessionStatus
from schemas.Mentor.Mentor_Sessions import *

router = APIRouter()

@router.get("/mentor/active_sessions", response_model=list[MentorActiveSessionResponse])
def get_active_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.mentor:
        raise HTTPException(status_code=403, detail="Only mentors can view active sessions")

    active_sessions = db.query(ActiveSession).filter(ActiveSession.mentor_id == current_user.id, ActiveSession.status == ActiveSessionStatus.scheduled).all()

    response_data = []

    for session in active_sessions:
        mentor_user = db.query(UserDetails).filter(UserDetails.user_id == session.mentor_id).first()
        
        response_data.append(
            MentorActiveSessionResponse(
                id=session.id,
                mentee_id=session.mentee_id,
                mentor_id=session.mentor_id,
                session_id=session.session_id,
                scheduled_time=session.scheduled_time,
                status=session.status,
                mentor_name=mentor_user.name if mentor_user else "N/A",
                mentor_family_name=mentor_user.family_name if mentor_user else "N/A"
            )
        )

    return response_data

@router.get("/mentor/all_sessions", response_model=list[MentorActiveSessionResponse])
def get_all_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.mentor:
        raise HTTPException(status_code=403, detail="Only mentors can view active sessions")

    active_sessions = db.query(ActiveSession).filter(ActiveSession.mentor_id == current_user.id).all()

    response_data = []

    for session in active_sessions:
        mentor_user = db.query(UserDetails).filter(UserDetails.user_id == session.mentor_id).first()
        
        response_data.append(
            MentorActiveSessionResponse(
                id=session.id,
                mentee_id=session.mentee_id,
                mentor_id=session.mentor_id,
                session_id=session.session_id,
                scheduled_time=session.scheduled_time,
                status=session.status,
                mentor_name=mentor_user.name if mentor_user else "N/A",
                mentor_family_name=mentor_user.family_name if mentor_user else "N/A"
            )
        )

    return response_data

@router.get("/mentor/sessions", response_model=list[MentorSessionResponse])
def show_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sessions = db.query(Session).filter(Session.mentor_id == current_user.id)
    return sessions

@router.post("/mentor/sessions", response_model=MentorSessionResponse)
def create_session(
    data: MentorSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.mentor:
        raise HTTPException(status_code=403, detail="Only mentors can create sessions")

    new_session = Session(
        mentor_id=current_user.id,
        title=data.title,
        description=data.description,
        session_time=data.session_time,
        price=data.price
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session

@router.put("/mentor/sessions/{session_id}", response_model=MentorSessionResponse)
def update_session(
    session_id: int,
    data: MentorSessionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = db.query(Session).filter(Session.id == session_id, Session.mentor_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    for key, value in data.dict(exclude_unset=True).items():
        setattr(session, key, value)

    db.commit()
    db.refresh(session)
    return session

@router.delete("/mentor/sessions/{session_id}")
def delete_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = db.query(Session).filter(Session.id == session_id, Session.mentor_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    db.delete(session)
    db.commit()
    return {"message": "Session deleted successfully"}
