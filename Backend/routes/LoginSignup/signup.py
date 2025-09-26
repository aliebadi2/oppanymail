import os
import json
from fastapi import APIRouter, HTTPException, Depends, UploadFile, Form, File
from fastapi.responses import HTMLResponse
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

    # Return HTML success page instead of JSON
    html_content = f"""
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تأیید حساب - Oppany</title>
        <style>
            * {{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }}
            
            body {{
                font-family: 'BYekan', 'Tahoma', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                direction: rtl;
            }}
            
            .success-container {{
                background: white;
                padding: 2rem;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 400px;
                width: 90%;
                animation: slideUp 0.5s ease-out;
            }}
            
            @keyframes slideUp {{
                from {{
                    opacity: 0;
                    transform: translateY(20px);
                }}
                to {{
                    opacity: 1;
                    transform: translateY(0);
                }}
            }}
            
            .success-icon {{
                font-size: 3rem;
                color: #4CAF50;
                margin-bottom: 1rem;
            }}
            
            h1 {{
                color: #333;
                font-size: 1.5rem;
                margin-bottom: 1rem;
                font-weight: bold;
            }}
            
            .countdown {{
                color: #667eea;
                font-size: 1rem;
                font-weight: bold;
                margin-top: 1rem;
            }}
            
            .loading-bar {{
                width: 100%;
                height: 3px;
                background: #f0f0f0;
                border-radius: 2px;
                margin-top: 1rem;
                overflow: hidden;
            }}
            
            .loading-progress {{
                height: 100%;
                background: linear-gradient(135deg, #667eea, #764ba2);
                border-radius: 2px;
                animation: loading 3s linear forwards;
            }}
            
            @keyframes loading {{
                from {{
                    width: 0%;
                }}
                to {{
                    width: 100%;
                }}
            }}
        </style>
    </head>
    <body>
        <div class="success-container">
            <div class="success-icon">✅</div>
            <h1>حساب شما تایید شد</h1>
            <div class="countdown" id="countdown">در حال انتقال... (3)</div>
            <div class="loading-bar">
                <div class="loading-progress"></div>
            </div>
        </div>
        
        <script>
            let countdown = 3;
            const countdownElement = document.getElementById('countdown');
            
            // Update frontend URL based on environment
            const frontendUrl = window.location.hostname === 'localhost' ? 
                'http://localhost:3000' : 
                'https://oppany.com';
            
            const timer = setInterval(() => {{
                countdown--;
                countdownElement.textContent = `در حال انتقال... (${{countdown}})`;
                
                if (countdown <= 0) {{
                    clearInterval(timer);
                    window.location.href = frontendUrl + '/login';
                }}
            }}, 1000);
        </script>
    </body>
    </html>
    """
    
    return HTMLResponse(content=html_content)
