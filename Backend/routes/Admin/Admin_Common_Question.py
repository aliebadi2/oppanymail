from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.common_question import CommonQuestion
from schemas.Admin.Admin_Common_Question import *

router = APIRouter()

@router.get("/admin/common-questions/", response_model=List[AdminCommonQuestionResponse])
def get_all_common_questions(db: Session = Depends(get_db)):
    questions = db.query(CommonQuestion).all()
    return questions

@router.get("/admin/common-questions/main_page", response_model=List[AdminCommonQuestionResponse])
def get_main_page_questions(db: Session = Depends(get_db)):
    questions = db.query(CommonQuestion).filter(CommonQuestion.flag == True).all()
    return questions

@router.post("/admin/common-questions/", response_model=AdminCommonQuestionResponse)
def create_common_question(question: AdminCommonQuestionCreate, db: Session = Depends(get_db)):
    new_question = CommonQuestion(
        question=question.question,
        answer=question.answer
    )
    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    return new_question

@router.put("/admin/common-questions/{question_id}", response_model=AdminCommonQuestionResponse)
def update_common_question(
    question_id: int, updated_question: AdminCommonQuestionUpdate, db: Session = Depends(get_db)
):
    question = db.query(CommonQuestion).filter(CommonQuestion.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    question.question = updated_question.question
    question.answer = updated_question.answer
    question.flag = updated_question.flag
    db.commit()
    db.refresh(question)
    return question

@router.delete("/admin/common-questions/{question_id}")
def delete_common_question(question_id: int, db: Session = Depends(get_db)):
    question = db.query(CommonQuestion).filter(CommonQuestion.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    db.delete(question)
    db.commit()
    return {"message": "Question deleted successfully"}

@router.put("/admin/common-questions/{question_id}/toggle_flag", response_model=AdminCommonQuestionResponse)
def toggle_question_flag(question_id: int, db: Session = Depends(get_db)):
    question = db.query(CommonQuestion).filter(CommonQuestion.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    question.flag = not question.flag
    db.commit()
    db.refresh(question)
    return question
