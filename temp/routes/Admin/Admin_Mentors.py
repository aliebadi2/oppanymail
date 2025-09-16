from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from utils.auth import get_current_user, get_db
from models.user import User, UserRole
from models.skill import Skill
from schemas.Admin.admin import MentorDetailsResponse
from typing import List

router = APIRouter()

def admin_required(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@router.get("/admin/pending_mentors", response_model=List[MentorDetailsResponse])
def get_pending_mentors(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    mentors = db.query(User).options(joinedload(User.details)).filter(
        User.role == UserRole.mentor,
        User.details.has(admin_validation=False)
    ).all()

    result = []
    for mentor in mentors:
        skill_ids = mentor.details.skills if mentor.details.skills else []
        skill_names = [db.query(Skill).filter(Skill.id == skill_id).first().name for skill_id in skill_ids]

        result.append(
            MentorDetailsResponse(
                id=mentor.id,
                username=mentor.username,
                email=mentor.email,
                name=mentor.details.name,
                family_name=mentor.details.family_name,
                city=mentor.details.city,
                country=mentor.details.country,
                degree=mentor.details.degree.value if mentor.details.degree else None,
                field_of_study=mentor.details.field_of_study,
                university=mentor.details.university,
                skills=skill_names,
                bio=mentor.details.bio,
                cv_file=mentor.details.cv_file,
                phone_number=mentor.details.phone_number,
                admin_validation=mentor.details.admin_validation,
                profile_image=mentor.details.profile_image
            )
        )

    return result

@router.post("/admin/mentor/{mentor_id}/validate")
def validate_mentor(
    mentor_id: int,
    is_valid: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    mentor = db.query(User).options(joinedload(User.details)).filter(
        User.id == mentor_id,
        User.role == UserRole.mentor
    ).first()
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")

    mentor.details.admin_validation = is_valid
    db.commit()
    status = "approved" if is_valid else "rejected"
    return {"message": f"Mentor {status} successfully"}
