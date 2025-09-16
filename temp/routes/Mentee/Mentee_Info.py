from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from utils.auth import get_current_user, get_db
from models.user import User, UserRole, UserDetails, Degree
from models.session import Session
from schemas.Mentee.Mentee_Info import MenteeInfoResponse, MenteeInfoUpdate
import shutil
import os
from utils.hashing import Hash
from schemas.Mentee.Mentee_Info import *

router = APIRouter()

@router.get("/mentee/info", response_model=MenteeInfoResponse)
def get_mentee_info(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    details = user.details
    if not details:
        details = UserDetails(user_id=user.id)
        db.add(details)
        db.commit()
        db.refresh(details)
    return MenteeInfoResponse(
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
        skills=[str(skill) for skill in details.skills] if details.skills else None,
        bio=details.bio, 
        phone_number=details.phone_number,
        profile_image=details.profile_image
    )

@router.put("/mentee/info", response_model=MenteeInfoResponse)
def update_mentee_info(
    data: MenteeInfoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    details = user.details
    if not details:
        details = UserDetails(user_id=user.id)
        db.add(details)
    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        if key == "degree" and value is not None:
            value = Degree(value)
        setattr(details, key, value)
    db.commit()
    db.refresh(details)
    return MenteeInfoResponse(
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
        skills=[str(skill) for skill in details.skills] if details.skills else None,
        bio=details.bio,  
        phone_number=details.phone_number,
        profile_image=details.profile_image
    )

@router.put("/mentee/update_password")
def update_password(
    data: MenteePasswordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.mentee:
        raise HTTPException(status_code=403, detail="Only mentees can update password")

    user = db.query(User).filter(User.id == current_user.id).first()
    if not Hash.verify(data.old_password, user.password):
        raise HTTPException(status_code=400, detail="Old password is incorrect")

    user.password = Hash.bcrypt(data.new_password)
    db.commit()

    return {"message": "Password updated successfully"}

@router.post("/mentee/profile_image")
def update_profile_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.mentee:
        raise HTTPException(status_code=403, detail="Only mentees can update profile image")

    allowed_extensions = ["jpg", "jpeg", "png", "gif"]
    file_extension = file.filename.split(".")[-1].lower()
    if file_extension not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    # Save the file
    upload_dir = "static/profile_images"
    os.makedirs(upload_dir, exist_ok=True)
    file_location = f"{upload_dir}/{current_user.id}_{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    details = db.query(UserDetails).filter(UserDetails.user_id == current_user.id).first()
    if not details:
        details = UserDetails(user_id=current_user.id)
        db.add(details)
    details.profile_image = file_location
    db.commit()
    db.refresh(details)
    return {"message": "Profile image updated successfully"}
