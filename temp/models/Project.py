from sqlalchemy import Column, Integer, String, Text, Enum, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from database import Base
import enum


class ProjectStatus(enum.Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    active_plan_id = Column(Integer, ForeignKey("active_plans.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    file_url = Column(String(255), nullable=True)  # URL of the project file
    status = Column(Enum(ProjectStatus), default=ProjectStatus.pending)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())

    active_plan = relationship("ActivePlan", back_populates="projects")
