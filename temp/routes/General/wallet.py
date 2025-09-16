from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from utils.auth import get_current_user, get_db
from schemas.wallet import WalletResponse, AddFundsRequest
from schemas.transaction import TransactionResponse
from models.wallet import Wallet
from models.transaction import Transaction, TransactionType
from models.user import User

router = APIRouter()

@router.get("/wallet", response_model=WalletResponse)
def get_wallet_balance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    if not wallet:
        # Optionally create the wallet if it doesn't exist
        wallet = Wallet(user_id=current_user.id, balance=Decimal("0.00"))
        db.add(wallet)
        db.commit()
        db.refresh(wallet)
    return wallet

@router.get("/transactions", response_model=list[TransactionResponse])
def get_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transactions = db.query(Transaction).filter(Transaction.wallet_id == current_user.id).all()
    return transactions

@router.post("/wallet/add", response_model=WalletResponse)
def add_funds_to_wallet(
    request: AddFundsRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    amount = request.amount

    # Validate the amount
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")

    try:
        # Start a database transaction
        wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
        if not wallet:
            # Create wallet if it doesn't exist
            wallet = Wallet(user_id=current_user.id, balance=Decimal("0.00"))
            db.add(wallet)
            db.flush()  # Flush to assign wallet.user_id

        # Update wallet balance
        wallet.balance += amount

        # Create a new transaction record
        transaction = Transaction(
            wallet_id=wallet.user_id,
            amount=amount,
            type=TransactionType.deposit,
            description="Funds added to wallet"
        )
        db.add(transaction)

        # Commit the transaction
        db.commit()
        db.refresh(wallet)
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="An error occurred while adding funds to the wallet.")

    return wallet
