from sqlalchemy import Column, Integer, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from database import Base

class Wallet(Base):
    __tablename__ = "wallets"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    balance = Column(Numeric(12, 2), nullable=False, default=0.00)

    user = relationship("User", back_populates="wallet")
    transactions = relationship("Transaction", back_populates="wallet")
