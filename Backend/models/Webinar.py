from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from database import Base

class Webinar(Base):
    __tablename__ = "webinars"

    id = Column(Integer, primary_key=True, index=True)
    active_plan_id = Column(Integer, ForeignKey("active_plans.id"), nullable=False)
    title = Column(String(255), nullable=False)
    date_time = Column(DateTime, nullable=False)
    duration = Column(Integer, nullable=False)  # Duration in minutes
    webinar_link = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    active_plan = relationship("ActivePlan", back_populates="webinars")
