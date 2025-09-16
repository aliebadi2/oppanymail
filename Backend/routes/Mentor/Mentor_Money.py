from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from utils.auth import get_current_user, get_db
from models.user import User, UserRole
from models.session import Session
from models.wallet import Wallet
from models.transaction import Transaction
from schemas.Mentor.Mentor_Money import *

router = APIRouter()

@router.get("/mentor/wallet", response_model=MentorWalletResponse)
def get_wallet_balance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.mentor:
        raise HTTPException(status_code=403, detail="Only mentors can view wallet balance")

    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    if not wallet:
        wallet = Wallet(user_id=current_user.id, balance=0.00)
        db.add(wallet)
        db.commit()
        db.refresh(wallet)
    return wallet

@router.get("/mentor/transactions", response_model=list[MentorTransactionResponse])
def get_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.mentor:
        raise HTTPException(status_code=403, detail="Only mentors can view transactions")

    transactions = db.query(Transaction).filter(Transaction.wallet_id == current_user.id).all()
    return transactions
