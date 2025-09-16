from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from utils.auth import get_current_user, get_db
from models.user import User, UserRole
from models.request import Request, RequestStatus
from schemas.Admin.Admin_Manage_Requests import AdminManageRequestResponse

router = APIRouter()

def get_requests_by_status(status: Optional[RequestStatus], db: Session):
    query = db.query(Request).options(
        joinedload(Request.plan),
        joinedload(Request.session),
        joinedload(Request.mentor).joinedload(User.details),
        joinedload(Request.mentee).joinedload(User.details)
    )

    if status:
        query = query.filter(Request.status == status)

    requests = query.all()
    response = []
    for req in requests:
        response.append({
            "request_id": req.id,
            "mentee_info": {
                "name": req.mentee.details.name,
                "family_name": req.mentee.details.family_name,
                "profile_image": req.mentee.details.profile_image
            },
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

@router.get("/admin/manage_requests", response_model=List[AdminManageRequestResponse])
def get_all_requests(db: Session = Depends(get_db)):
    return get_requests_by_status(None, db)

@router.get("/admin/manage_requests/{status}", response_model=List[AdminManageRequestResponse])
def get_requests_by_specific_status(status: RequestStatus, db: Session = Depends(get_db)):
    return get_requests_by_status(status, db)
