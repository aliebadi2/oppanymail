from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from database import get_db
from models.common_question import CommonQuestion

router = APIRouter()

class CommonQuestionBase(BaseModel):
    question: str
    answer: str

class CommonQuestionCreate(CommonQuestionBase):
    pass

class CommonQuestionUpdate(CommonQuestionBase):
    flag: bool

class CommonQuestionResponse(CommonQuestionBase):
    id: int
    flag: bool

    class Config:
        orm_mode = True

@router.get("/common-questions/", response_model=List[CommonQuestionResponse])
def get_all_common_questions(db: Session = Depends(get_db)):
    questions = db.query(CommonQuestion).all()
    return questions

@router.get("/common-questions/main_page", response_model=List[CommonQuestionResponse])
def get_main_page_questions(db: Session = Depends(get_db)):
    questions = db.query(CommonQuestion).filter(CommonQuestion.flag == True).all()
    return questions

@router.get("/common-questions/all", response_model=List[CommonQuestionResponse])
def get_all_questions(db: Session = Depends(get_db)):
    questions = db.query(CommonQuestion).all()
    return questions
