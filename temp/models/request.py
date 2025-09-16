from sqlalchemy import Column, Integer, ForeignKey, Numeric, DateTime, Enum, func
from sqlalchemy.orm import relationship
from database import Base
import enum

class RequestStatus(enum.Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"
    expired = "expired"

class Request(Base):
    __tablename__ = "requests"

    id = Column(Integer, primary_key=True, index=True)
    mentee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    mentor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_id = Column(Integer, ForeignKey("plans.id"), nullable=True)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=True)
    amount = Column(Numeric(12, 2), nullable=False)
    status = Column(Enum(RequestStatus), default=RequestStatus.pending)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    expiration_date = Column(DateTime(timezone=True), nullable=False)

    mentee = relationship(
        "User",
        back_populates="mentee_requests",
        foreign_keys=[mentee_id]
    )
    mentor = relationship(
        "User",
        back_populates="mentor_requests",
        foreign_keys=[mentor_id]
    )
    plan = relationship("Plan")
    session = relationship("Session")
