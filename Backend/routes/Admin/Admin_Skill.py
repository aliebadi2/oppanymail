from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from schemas.Admin.Admin_Skill import AdminSkillCreate, AdminSkillResponse, AdminSkillUpdate
from models.skill import Skill
from models.user import UserRole
from database import get_db
from utils.auth import get_current_user

router = APIRouter()

@router.post("/admin/skills", response_model=AdminSkillResponse)
def create_skill(skill: AdminSkillCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    existing_skill = db.query(Skill).filter(Skill.name == skill.name).first()
    if existing_skill:
        raise HTTPException(status_code=400, detail="Skill with this name already exists")

    new_skill = Skill(name=skill.name, description=skill.description)
    db.add(new_skill)
    db.commit()
    db.refresh(new_skill)
    return new_skill

@router.put("/admin/skills/{skill_id}", response_model=AdminSkillResponse)
def edit_skill(skill_id: int, skill_data: AdminSkillUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    if skill_data.name:
        skill.name = skill_data.name
    if skill_data.description:
        skill.description = skill_data.description

    db.commit()
    db.refresh(skill)
    return skill

@router.delete("/admin/skills/{skill_id}", response_model=AdminSkillResponse)
def remove_skill(skill_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    db.delete(skill)
    db.commit()
    return skill
