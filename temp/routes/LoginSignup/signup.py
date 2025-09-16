import os
import json
from fastapi import APIRouter, HTTPException, Depends, UploadFile, Form, File
from sqlalchemy.orm import Session
from utils.hashing import Hash
from utils.email_utils import send_email_validation_link, validate_email_token
from schemas.LoginSignup.signup import UserResponse, Degree
from models.user import User, UserDetails, UserRole
from models.skill import Skill
from database import get_db

router = APIRouter()

UPLOAD_DIR = "static/uploaded_cv"

os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/signup/mentor", response_model=UserResponse)
async def signup_mentor(
    username: str = Form(...),
    password: str = Form(...),
    email: str = Form(...),
    name: str = Form(...),
    family_name: str = Form(...),
    city: str = Form(...),
    country: str = Form(...),
    degree: Degree = Form(...),
    field_of_study: str = Form(...),
    university: str = Form(...),
    skills: str = Form(...),  
    bio: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    # Check if username or email already exists
    existing_user = db.query(User).filter((User.username == username) | (User.email == email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already exists")

    # Save CV file with username as part of the filename
    cv_filename = f"{username}_{file.filename}"
    cv_path = os.path.join(UPLOAD_DIR, cv_filename)
    with open(cv_path, "wb") as f:
        f.write(await file.read())

    # Parse and validate skills
    try:
        parsed_skills = json.loads(skills)
        if not isinstance(parsed_skills, list) or not all(isinstance(skill, int) for skill in parsed_skills):
            raise ValueError
    except (json.JSONDecodeError, ValueError):
        raise HTTPException(status_code=400, detail="Skills must be a valid JSON array of integers")

    # Validate skill IDs
    existing_skills = db.query(Skill.id).filter(Skill.id.in_(parsed_skills)).all()
    existing_skill_ids = {skill.id for skill in existing_skills}
    invalid_skills = set(parsed_skills) - existing_skill_ids
    if invalid_skills:
        raise HTTPException(status_code=400, detail=f"Invalid skill IDs: {invalid_skills}")

    # Create new user
    new_user = User(
        username=username,
        password=Hash.bcrypt(password),
        email=email,
        role=UserRole.mentor,
        email_validation=False,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create user details
    user_details = UserDetails(
        user_id=new_user.id,
        name=name,
        family_name=family_name,
        city=city,
        country=country,
        degree=degree,
        field_of_study=field_of_study,
        university=university,
        skills=parsed_skills,
        bio=bio,
        cv_file=cv_path,
        admin_validation=False,
    )
    db.add(user_details)
    db.commit()

    # Send email validation link (ensure send_email_validation_link is properly implemented)
    send_email_validation_link(new_user.username, new_user.role.value, new_user.email)

    return UserResponse(
        id=new_user.id,
        username=new_user.username,
        email=new_user.email,
        role=new_user.role.value,
        signup_date=new_user.signup_date,
    )

# Mentee Signup Endpoint
@router.post("/signup/mentee", response_model=UserResponse)
async def signup_mentee(
    username: str = Form(...),
    password: str = Form(...),
    email: str = Form(...),
    name: str = Form(...),
    family_name: str = Form(...),
    db: Session = Depends(get_db),
):
    # Check if username or email already exists
    existing_user = db.query(User).filter((User.username == username) | (User.email == email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already exists")

    # Create new user
    new_user = User(
        username=username,
        password=Hash.bcrypt(password),
        email=email,
        role=UserRole.mentee,
        email_validation=False,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create user details
    user_details = UserDetails(
        user_id=new_user.id,
        name=name,
        family_name=family_name,
        admin_validation=True,
    )
    db.add(user_details)
    db.commit()

    # Send email validation link
    send_email_validation_link(new_user.username, new_user.role.value, new_user.email)

    return UserResponse(
        id=new_user.id,
        username=new_user.username,
        email=new_user.email,
        role=new_user.role.value,
        signup_date=new_user.signup_date,
    )

# Email Activation Endpoint
@router.get("/signup/activate/{token}")
def activate_account(token: str, db: Session = Depends(get_db)):
    username = validate_email_token(token)
    user = db.query(User).filter(User.username == username).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.email_validation = True
    db.commit()

    return {"message": "Email validated successfully", "role": user.role.value}
