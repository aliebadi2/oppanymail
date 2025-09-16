from sqlalchemy import Column, Integer, String, Text, Enum, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from database import Base
import enum

class MilestoneStatus(enum.Enum):
    pending = "pending"
    completed = "completed"
    in_progress = "in_progress"

class Milestone(Base):
    __tablename__ = "milestones"

    id = Column(Integer, primary_key=True, index=True)
    active_plan_id = Column(Integer, ForeignKey("active_plans.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    level = Column(Integer, nullable=False)  
    status = Column(Enum(MilestoneStatus), default=MilestoneStatus.pending)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    active_plan = relationship("ActivePlan", back_populates="milestones")
