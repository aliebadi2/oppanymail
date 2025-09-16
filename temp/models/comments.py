from sqlalchemy import Column, Integer, Float, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    mentee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    mentor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    text = Column(String, nullable=False)
    score = Column(Float, nullable=False)
    date_created = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    show_on_main = Column(Boolean, default=False)

    mentee = relationship("User", foreign_keys=[mentee_id], back_populates="mentee_comments")
    mentor = relationship("User", foreign_keys=[mentor_id], back_populates="mentor_comments")
