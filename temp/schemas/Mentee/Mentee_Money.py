from pydantic import BaseModel, condecimal
from decimal import Decimal
from datetime import datetime
from models.transaction import TransactionType

class MenteeTransactionResponse(BaseModel):
      id: int
      wallet_id: int
      amount: Decimal
      timestamp: datetime
      type: TransactionType
      description: str = None

      class Config:
            orm_mode = True

class MenteeWalletResponse(BaseModel):
      user_id: int
      balance: Decimal

      class Config:
            orm_mode = True

class MenteeAddFundsRequest(BaseModel):
      amount: condecimal(gt=0, decimal_places=2)  
