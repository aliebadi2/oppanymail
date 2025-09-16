from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from utils.auth import get_current_user, get_db
from models.user import User, UserRole
from models.wallet import Wallet
from models.transaction import Transaction
from models.plan import Plan
from models.session import Session
from models.request import Request
from models.transaction import TransactionType
from schemas.Mentee.Mentee_Request import *
from datetime import datetime, timedelta


router = APIRouter()

@router.post("/mentee/requests", response_model=MenteeRequestResponse)
def create_request(
      data: MenteeRequestCreate,
      db: Session = Depends(get_db),
      current_user: User = Depends(get_current_user)
):
      if current_user.role != UserRole.mentee:
            raise HTTPException(status_code=403, detail="Only mentees can create requests")

      # Verify plan or session exists
      if data.type == "plan":
            plan = db.query(Plan).filter(Plan.id == data.plan_or_session_id).first()
            if not plan:
                  raise HTTPException(status_code=404, detail="Plan not found")
            amount = plan.price
            mentor_id = plan.mentor_id
            plan_id = plan.id
            session_id = None
      elif data.type == "session":
            session = db.query(Session).filter(Session.id == data.plan_or_session_id).first()
            if not session:
                  raise HTTPException(status_code=404, detail="Session not found")
            amount = session.price
            mentor_id = session.mentor_id
            plan_id = None
            session_id = session.id
      else:
            raise HTTPException(status_code=400, detail="Invalid type. Must be 'plan' or 'session'.")

      # Check mentee wallet balance
      wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
      if not wallet or wallet.balance < amount:
            raise HTTPException(status_code=400, detail="Insufficient funds")

      # Deduct amount from mentee wallet
      wallet.balance -= amount
      transaction = Transaction(
            wallet_id=wallet.user_id,
            amount=-amount,
            type=TransactionType.transfer,
            description="Request for plan/session"
      )
      db.add(transaction)

      # Create request
      expiration_date = datetime.utcnow() + timedelta(days=7)
      new_request = Request(
            mentee_id=current_user.id,
            mentor_id=mentor_id,
            plan_id=plan_id,
            session_id=session_id,
            amount=amount,
            expiration_date=expiration_date
      )
      db.add(new_request)
      db.commit()
      db.refresh(new_request)
      return new_request

