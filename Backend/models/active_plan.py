from sqlalchemy import Column, Integer, ForeignKey, DateTime, Enum, func
from sqlalchemy.orm import relationship
from database import Base
import enum

class ActivePlanStatus(enum.Enum):
    active = "active"
    completed = "completed"
    cancelled = "cancelled"

class ActivePlan(Base):
    __tablename__ = "active_plans"

    id = Column(Integer, primary_key=True, index=True)
    mentee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    mentor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_id = Column(Integer, ForeignKey("plans.id"), nullable=False)
    start_date = Column(DateTime(timezone=True), server_default=func.now())
    end_date = Column(DateTime(timezone=True), nullable=True)
    status = Column(Enum(ActivePlanStatus), default=ActivePlanStatus.active)

    mentee = relationship("User", back_populates="active_plans_as_mentee", foreign_keys=[mentee_id])
    mentor = relationship("User", back_populates="active_plans_as_mentor", foreign_keys=[mentor_id])
    plan = relationship("Plan")

    milestones = relationship("Milestone", back_populates="active_plan", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="active_plan", cascade="all, delete-orphan")
    webinars = relationship("Webinar", back_populates="active_plan", cascade="all, delete-orphan")
    videos = relationship("Video", back_populates="active_plan", cascade="all, delete-orphan")
    files = relationship("File", back_populates="active_plan", cascade="all, delete-orphan")
