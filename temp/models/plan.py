from sqlalchemy import Column, Integer, ForeignKey, Numeric, DateTime, String, Text, func
from sqlalchemy.orm import relationship
from database import Base

class Plan(Base):
    __tablename__ = "plans"

    id = Column(Integer, primary_key=True, index=True)
    mentor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    session_time = Column(Integer, nullable=False)  # In minutes
    number_of_sessions = Column(Integer, nullable=False)
    max_response_time = Column(Integer, nullable=False)  # In hours
    price = Column(Numeric(12, 2), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    mentor = relationship("User", back_populates="plans")
