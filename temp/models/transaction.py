from sqlalchemy import Column, Integer, ForeignKey, Numeric, DateTime, String, Enum, func
from sqlalchemy.orm import relationship
from database import Base
import enum

class TransactionType(enum.Enum):
    deposit = "deposit"
    withdrawal = "withdrawal"
    transfer = "transfer"
    refund = "refund"

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    wallet_id = Column(Integer, ForeignKey("wallets.user_id"), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    type = Column(Enum(TransactionType), nullable=False)
    description = Column(String(255), nullable=True)

    wallet = relationship("Wallet", back_populates="transactions")
