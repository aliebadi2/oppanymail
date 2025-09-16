from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.General.skill import SkillResponse
from models.skill import Skill
from database import get_db
from typing import List

router = APIRouter()

@router.get("/skills", response_model=List[SkillResponse])
def show_all_skills(db: Session = Depends(get_db)):
    skills = db.query(Skill).all()
    return skills
