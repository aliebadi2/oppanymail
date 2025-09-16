from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session, joinedload
from database import get_db
from models.user import User, UserRole, UserDetails
from models.skill import Skill
from schemas.General.show_mentors import MentorResponse
import random

router = APIRouter()

@router.get("/show-mentors/all", response_model=list[MentorResponse])
def get_all_mentors(db: Session = Depends(get_db)):
    mentors = (
        db.query(User)
        .filter(
            User.role == UserRole.mentor,
            User.details.has(admin_validation=True),
            User.email_validation == True
        )
        .options(joinedload(User.details))
        .all()
    )

    response = []
    for mentor in mentors:
        if mentor.details:
            skills_names = (
                db.query(Skill.name)
                .filter(Skill.id.in_(mentor.details.skills))
                .all()
            )
            response.append(
                MentorResponse(
                    user_id=mentor.id,
                    username=mentor.username,
                    user_info={
                        "name": mentor.details.name,
                        "family_name": mentor.details.family_name,
                        "city": mentor.details.city,
                        "country": mentor.details.country,
                        "degree": mentor.details.degree,
                        "field_of_study": mentor.details.field_of_study,
                        "university": mentor.details.university,
                        "skills_names": [skill[0] for skill in skills_names],
                        "bio": mentor.details.bio,
                        "profile_image": mentor.details.profile_image,
                    },
                )
            )
    return response

@router.get("/show-mentors/by-skill/{skill_id}", response_model=list[MentorResponse])
def get_mentors_by_skill(skill_id: int, db: Session = Depends(get_db)):
    mentors = (
        db.query(User)
        .filter(
            User.role == UserRole.mentor,
            User.details.has(admin_validation=True),
            User.email_validation == True
        )
        .options(joinedload(User.details))
        .all()
    )

    response = []
    for mentor in mentors:
        if mentor.details and skill_id in mentor.details.skills:
            skills_names = (
                db.query(Skill.name)
                .filter(Skill.id.in_(mentor.details.skills))
                .all()
            )
            response.append(
                MentorResponse(
                    user_id=mentor.id,
                    username=mentor.username,
                    user_info={
                        "name": mentor.details.name,
                        "family_name": mentor.details.family_name,
                        "city": mentor.details.city,
                        "country": mentor.details.country,
                        "degree": mentor.details.degree,
                        "field_of_study": mentor.details.field_of_study,
                        "university": mentor.details.university,
                        "skills_names": [skill[0] for skill in skills_names],
                        "bio": mentor.details.bio,
                        "profile_image": mentor.details.profile_image,
                    },
                )
            )

    if not response:
        raise HTTPException(status_code=404, detail="No mentors found for this skill")

    return response

@router.get("/show-mentors/random", response_model=list[MentorResponse])
def get_random_mentors(db: Session = Depends(get_db)):
    mentors = (
        db.query(User)
        .filter(
            User.role == UserRole.mentor,
            User.details.has(admin_validation=True),
            User.email_validation == True
        )
        .options(joinedload(User.details))
        .all()
    )
    if not mentors:
        raise HTTPException(status_code=404, detail="No mentors found")

    random_mentors = random.sample(mentors, min(len(mentors), 5))
    response = []
    for mentor in random_mentors:
        if mentor.details:
            skills_names = (
                db.query(Skill.name)
                .filter(Skill.id.in_(mentor.details.skills))
                .all()
            )
            response.append(
                MentorResponse(
                    user_id=mentor.id,
                    username=mentor.username,
                    user_info={
                        "name": mentor.details.name,
                        "family_name": mentor.details.family_name,
                        "city": mentor.details.city,
                        "country": mentor.details.country,
                        "degree": mentor.details.degree,
                        "field_of_study": mentor.details.field_of_study,
                        "university": mentor.details.university,
                        "skills_names": [skill[0] for skill in skills_names],
                        "bio": mentor.details.bio,
                        "profile_image": mentor.details.profile_image,
                    },
                )
            )
    return response

@router.get("/show-mentors/profile/{username}", response_model=MentorResponse)
def get_mentor_profile(username: str, db: Session = Depends(get_db)):
    mentor = (
        db.query(User)
        .filter(
            User.username == username,
            User.role == UserRole.mentor,
            User.details.has(admin_validation=True),
            User.email_validation == True
        )
        .options(joinedload(User.details))
        .first()
    )
    if not mentor or not mentor.details:
        raise HTTPException(status_code=404, detail="Mentor not found")

    skills_names = (
        db.query(Skill.name)
        .filter(Skill.id.in_(mentor.details.skills))
        .all()
    )

    return MentorResponse(
        user_id=mentor.id,
        username=mentor.username,
        user_info={
            "name": mentor.details.name,
            "family_name": mentor.details.family_name,
            "city": mentor.details.city,
            "country": mentor.details.country,
            "degree": mentor.details.degree,
            "field_of_study": mentor.details.field_of_study,
            "university": mentor.details.university,
            "skills_names": [skill[0] for skill in skills_names],
            "bio": mentor.details.bio,
            "profile_image": mentor.details.profile_image,
        },
    )
