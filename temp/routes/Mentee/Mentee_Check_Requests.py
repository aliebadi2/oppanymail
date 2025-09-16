from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from utils.auth import get_current_user, get_db
from models.user import User, UserRole
from models.request import Request, RequestStatus
from models.wallet import Wallet
from models.transaction import Transaction, TransactionType
from schemas.Mentee.Mentee_Check_Requests import MenteeCheckRequestResponse

router = APIRouter()

def get_requests_by_status(status: Optional[RequestStatus], db: Session, mentee_id: int):
    query = db.query(Request).options(
        joinedload(Request.plan),
        joinedload(Request.session),
        joinedload(Request.mentor).joinedload(User.details)
    ).filter(Request.mentee_id == mentee_id)

    if status:
        query = query.filter(Request.status == status)

    requests = query.all()
    response = []
    for req in requests:
        response.append({
            "request_id": req.id,
            "mentor_info": {
                "name": req.mentor.details.name,
                "family_name": req.mentor.details.family_name,
                "profile_image": req.mentor.details.profile_image
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

@router.get("/mentee/check_requests", response_model=List[MenteeCheckRequestResponse])
def get_all_requests(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.mentee:
        raise HTTPException(status_code=403, detail="Only mentees can view requests")
    return get_requests_by_status(None, db, current_user.id)

@router.get("/mentee/check_requests/{status}", response_model=List[MenteeCheckRequestResponse])
def get_requests_by_specific_status(status: RequestStatus, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.mentee:
        raise HTTPException(status_code=403, detail="Only mentees can view requests")
    return get_requests_by_status(status, db, current_user.id)

@router.delete("/mentee/check_requests/{request_id}/cancel")
def cancel_request(request_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    request_obj = db.query(Request).filter(
        Request.id == request_id,
        Request.mentee_id == current_user.id,
        Request.status == RequestStatus.pending
    ).first()

    if not request_obj:
        raise HTTPException(status_code=404, detail="Request not found or already processed")

    request_obj.status = RequestStatus.rejected

    mentee_wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    if not mentee_wallet:
        mentee_wallet = Wallet(user_id=current_user.id, balance=0.00)
        db.add(mentee_wallet)

    mentee_wallet.balance += request_obj.amount

    transaction = Transaction(
        wallet_id=mentee_wallet.user_id,
        amount=request_obj.amount,
        type=TransactionType.refund,
        description="Refund for canceled request"
    )
    db.add(transaction)

    db.commit()
    return {"message": "Request canceled successfully"}
