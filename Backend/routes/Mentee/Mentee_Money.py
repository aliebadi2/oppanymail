from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from utils.auth import get_current_user, get_db
from models.wallet import Wallet
from models.transaction import Transaction, TransactionType
from typing import List
from schemas.Mentee.Mentee_Money import *
from decimal import Decimal
from models.user import User

router = APIRouter()

@router.get("/mentee/transactions", response_model=List[MenteeTransactionResponse])
def get_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transactions = db.query(Transaction).filter(Transaction.wallet_id == current_user.id).all()
    return transactions

@router.get("/mentee/wallet", response_model=MenteeWalletResponse)
def get_wallet_balance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    if not wallet:
        wallet = Wallet(user_id=current_user.id, balance=0.00)
        db.add(wallet)
        db.commit()
        db.refresh(wallet)
    return wallet

@router.post("/mentee/wallet/add_funds", response_model=MenteeWalletResponse)
def add_funds(
    request: MenteeAddFundsRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if request.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than 0.")

    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    if not wallet:
        wallet = Wallet(user_id=current_user.id, balance=0.00)
        db.add(wallet)

    wallet.balance += request.amount

    transaction = Transaction(
        wallet_id=current_user.id,
        amount=request.amount,
        type=TransactionType.deposit,
        description="Funds added to wallet"
    )
    db.add(transaction)
    db.commit()
    db.refresh(wallet)
    return wallet
