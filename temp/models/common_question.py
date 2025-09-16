from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class CommonQuestion(Base):
    __tablename__ = "common_questions"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String(255), nullable=False)
    answer = Column(String(500), nullable=False)
    flag = Column(Boolean, default=False)  
