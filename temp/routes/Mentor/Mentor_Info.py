from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from utils.auth import get_current_user, get_db
import os
import shutil
from utils.hashing import Hash
from schemas.Mentor.Mentor_Info import *
from models.user import User, UserRole, UserDetails, Degree
from models.skill import Skill

router = APIRouter()

@router.get("/mentor/info", response_model=MentorInfoResponse)
def get_mentor_info(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.mentor:
        raise HTTPException(status_code=403, detail="Only mentors can access this endpoint")

    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    details = user.details
    if not details:
        details = UserDetails(user_id=user.id)
        db.add(details)
        db.commit()
        db.refresh(details)

    skill_ids = details.skills if details.skills else []
    skills = db.query(Skill).filter(Skill.id.in_(skill_ids)).all()
    skill_list = [{"id": skill.id, "name": skill.name} for skill in skills]

    return MentorInfoResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        name=details.name,
        family_name=details.family_name,
        city=details.city,
        country=details.country,
        degree=details.degree.value if details.degree else None,
        field_of_study=details.field_of_study,
        university=details.university,
        skills=skill_list,
        bio=details.bio,
        cv_file=details.cv_file,
        phone_number=details.phone_number,
        profile_image=details.profile_image,
        admin_validation=details.admin_validation
    )

@router.put("/mentor/info", response_model=MentorInfoResponse)
def update_mentor_info(
    data: MentorInfoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.mentor:
        raise HTTPException(status_code=403, detail="Only mentors can access this endpoint")

    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    details = user.details
    if not details:
        details = UserDetails(user_id=user.id)
        db.add(details)

    update_data = data.dict(exclude_unset=True)

    if "degree" in update_data and update_data["degree"] is not None:
        update_data["degree"] = Degree(update_data["degree"])

    if "skills" in update_data and update_data["skills"] is not None:
        try:
            skill_ids = [int(skill_id) for skill_id in update_data["skills"]]
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid skill IDs provided")
        update_data["skills"] = skill_ids

    for key, value in update_data.items():
        setattr(details, key, value)

    db.commit()
    db.refresh(details)

    skills = db.query(Skill).filter(Skill.id.in_(details.skills)).all()
    skill_list = [{"id": skill.id, "name": skill.name} for skill in skills]

    return MentorInfoResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        name=details.name,
        family_name=details.family_name,
        city=details.city,
        country=details.country,
        degree=details.degree.value if details.degree else None,
        field_of_study=details.field_of_study,
        university=details.university,
        skills=skill_list,
        bio=details.bio,
        cv_file=details.cv_file,
        phone_number=details.phone_number,
        profile_image=details.profile_image,
        admin_validation=details.admin_validation
    )

@router.put("/mentor/update_password")
def update_password(
    data: MentorPasswordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.mentor:
        raise HTTPException(status_code=403, detail="Only mentors can update password")

    user = db.query(User).filter(User.id == current_user.id).first()
    if not Hash.verify(data.old_password, user.password):
        raise HTTPException(status_code=400, detail="Old password is incorrect")

    user.password = Hash.bcrypt(data.new_password)
    db.commit()

    return {"message": "Password updated successfully"}

@router.post("/mentor/profile_image")
def update_profile_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.mentor:
        raise HTTPException(status_code=403, detail="Only mentors can update profile image")

    allowed_extensions = ["jpg", "jpeg", "png", "gif"]
    file_extension = file.filename.split(".")[-1].lower()
    if file_extension not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    upload_dir = "static/profile_images"
    os.makedirs(upload_dir, exist_ok=True)
    file_name = f"{current_user.id}.{file_extension}"
    file_location = os.path.join(upload_dir, file_name)

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    relative_path = f"static/profile_images/{file_name}"
    details = db.query(UserDetails).filter(UserDetails.user_id == current_user.id).first()
    if not details:
        details = UserDetails(user_id=current_user.id)
        db.add(details)

    details.profile_image = relative_path
    db.commit()
    db.refresh(details)

    return {"message": "Profile image updated successfully"}
