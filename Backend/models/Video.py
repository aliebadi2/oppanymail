from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from database import Base

class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    active_plan_id = Column(Integer, ForeignKey("active_plans.id"), nullable=False)
    title = Column(String(255), nullable=False)
    video_url = Column(String(255), nullable=False)  # URL of the uploaded video
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    active_plan = relationship("ActivePlan", back_populates="videos")
