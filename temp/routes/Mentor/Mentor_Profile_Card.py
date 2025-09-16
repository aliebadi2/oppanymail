from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from utils.auth import get_current_user, get_db
from models.user import User, UserRole
from models.plan import Plan
from models.session import Session
from models.request import Request, RequestStatus
from models.wallet import Wallet
from models.transaction import Transaction, TransactionType
from models.active_session import ActiveSession, ActiveSessionStatus
from models.active_plan import ActivePlan, ActivePlanStatus
from datetime import datetime, timedelta
from typing import List
from schemas.Mentor.Mentor_Profile_Card import MentorCardResponse, MentorRequestResponse

router = APIRouter()

@router.get("/mentor_card/{mentor_id}", response_model=MentorCardResponse)
def get_mentor_card(mentor_id: int, db: Session = Depends(get_db)):
    plans = db.query(Plan).filter(Plan.mentor_id == mentor_id).all()
    sessions = db.query(Session).filter(Session.mentor_id == mentor_id).all()
    return {"plans": plans, "sessions": sessions}

def get_requests_by_status(status: RequestStatus, db: Session, mentor_id: int):
    query = db.query(Request).options(
        joinedload(Request.mentee).joinedload(User.details),
        joinedload(Request.plan),
        joinedload(Request.session)
    ).filter(
        Request.mentor_id == mentor_id
    )

    if status:
        query = query.filter(Request.status == status)

    requests = query.all()
    response = []
    for req in requests:
        response.append({
            "request_id": req.id,
            "mentee_info": {
                "id": req.mentee.id,
                "name": req.mentee.details.name,
                "family_name": req.mentee.details.family_name,
                "profile_image": req.mentee.details.profile_image,
            },
            "plan_info": {
                "id": req.plan.id if req.plan else None,
                "title": req.plan.title if req.plan else None,
                "description": req.plan.description if req.plan else None,
                "price": req.plan.price if req.plan else None
            } if req.plan_id else None,
            "session_info": {
                "id": req.session.id if req.session else None,
                "title": req.session.title if req.session else None,
                "description": req.session.description if req.session else None,
                "price": req.session.price if req.session else None
            } if req.session_id else None,
            "amount": req.amount,
            "status": req.status,
            "created_at": req.created_at.isoformat() if req.created_at else None,
            "expiration_date": req.expiration_date.isoformat() if req.expiration_date else None
        })

    return response

@router.get("/mentor/requests", response_model=List[MentorRequestResponse])
def get_all_requests(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.mentor:
        raise HTTPException(status_code=403, detail="Only mentors can view requests")
    return get_requests_by_status(None, db, current_user.id)

@router.get("/mentor/requests/pending", response_model=List[MentorRequestResponse])
def get_pending_requests(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.mentor:
        raise HTTPException(status_code=403, detail="Only mentors can view pending requests")
    return get_requests_by_status(RequestStatus.pending, db, current_user.id)

@router.get("/mentor/requests/accepted", response_model=List[MentorRequestResponse])
def get_accepted_requests(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.mentor:
        raise HTTPException(status_code=403, detail="Only mentors can view accepted requests")
    return get_requests_by_status(RequestStatus.accepted, db, current_user.id)

@router.get("/mentor/requests/rejected", response_model=List[MentorRequestResponse])
def get_rejected_requests(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.mentor:
        raise HTTPException(status_code=403, detail="Only mentors can view rejected requests")
    return get_requests_by_status(RequestStatus.rejected, db, current_user.id)

@router.get("/mentor/requests/expired", response_model=List[MentorRequestResponse])
def get_expired_requests(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.mentor:
        raise HTTPException(status_code=403, detail="Only mentors can view expired requests")
    return get_requests_by_status(RequestStatus.expired, db, current_user.id)

@router.post("/mentor/requests/{request_id}/accept")
def accept_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.mentor:
        raise HTTPException(status_code=403, detail="Only mentors can accept requests")

    request_obj = db.query(Request).filter(
        Request.id == request_id,
        Request.mentor_id == current_user.id,
        Request.status == RequestStatus.pending
    ).first()
    if not request_obj:
        raise HTTPException(status_code=404, detail="Request not found or already processed")

    request_obj.status = RequestStatus.accepted

    mentor_wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    if not mentor_wallet:
        mentor_wallet = Wallet(user_id=current_user.id, balance=0.00)
        db.add(mentor_wallet)
    mentor_wallet.balance += request_obj.amount

    transaction = Transaction(
        wallet_id=mentor_wallet.user_id,
        amount=request_obj.amount,
        type=TransactionType.transfer,
        description="Accepted request from mentee"
    )
    db.add(transaction)

    start_date = datetime.utcnow()
    end_date = start_date + timedelta(days=30)

    if request_obj.plan_id:
        active_plan = ActivePlan(
            mentee_id=request_obj.mentee_id,
            mentor_id=current_user.id,
            plan_id=request_obj.plan_id,
            start_date=start_date,
            end_date=end_date,
            status=ActivePlanStatus.active
        )
        db.add(active_plan)
    elif request_obj.session_id:
        active_session = ActiveSession(
            mentee_id=request_obj.mentee_id,
            mentor_id=current_user.id,
            session_id=request_obj.session_id,
            status=ActiveSessionStatus.scheduled,
            scheduled_time=start_date
        )
        db.add(active_session)

    db.commit()
    return {"message": "Request accepted successfully"}

@router.post("/mentor/requests/{request_id}/reject")
def reject_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.mentor:
        raise HTTPException(status_code=403, detail="Only mentors can reject requests")

    request_obj = db.query(Request).filter(
        Request.id == request_id,
        Request.mentor_id == current_user.id,
        Request.status == RequestStatus.pending
    ).first()
    if not request_obj:
        raise HTTPException(status_code=404, detail="Request not found or already processed")

    request_obj.status = RequestStatus.rejected

    mentee_wallet = db.query(Wallet).filter(Wallet.user_id == request_obj.mentee_id).first()
    if not mentee_wallet:
        mentee_wallet = Wallet(user_id=request_obj.mentee_id, balance=0.00)
        db.add(mentee_wallet)
    mentee_wallet.balance += request_obj.amount

    transaction = Transaction(
        wallet_id=mentee_wallet.user_id,
        amount=request_obj.amount,
        type=TransactionType.refund,
        description="Refund for rejected request"
    )
    db.add(transaction)

    db.commit()
    return {"message": "Request rejected and mentee refunded"}
