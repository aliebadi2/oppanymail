import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from starlette.middleware.cors import CORSMiddleware

from database import Base, engine

# Routers
from routes.LoginSignup import login, signup, welcome
from routes.Admin import (
    Admin_Mentors, Admin_Skill, Admin_Comment,
    Admin_Common_Question, Admin_Manage_Requests, Admin_Blog
)
from routes.General import comments, common_question, show_mentors, skill, Blog
from routes.Mentee import (
    Mentee_Plans, Mentee_Session, Mentee_Money, Mentee_Request,
    Mentee_Info, Mentee_Comment, Mentee_Check_Requests
)
from routes.Mentor import (
    Mentor_Info, Mentor_Plans, Mentor_Money,
    Mentor_Profile_Card, Mentor_Sessions
)
from routes.Courses import Milestone, Project, Webinar, Video, File, Courses

app = FastAPI()

# ===================== Backend static (uploads) =====================
# قبلاً روی /static بود؛ برای جلوگیری از تداخل با CRA می‌بریمش روی /uploads
UPLOADS_DIR = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(UPLOADS_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# ساخت جداول (سریع برای dev؛ در تولید بهتره Alembic استفاده کنی)
Base.metadata.create_all(bind=engine)

# ===================== CORS =====================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===================== Routers =====================
app.include_router(login.router, tags=["login"])
app.include_router(welcome.router, tags=["welcome"])
app.include_router(signup.router, tags=["signup"])
app.include_router(skill.router, tags=["skills"])
app.include_router(comments.router, tags=["comments"])
app.include_router(show_mentors.router, tags=["show mentors"])
app.include_router(common_question.router, tags=["common questions"])
app.include_router(Blog.router, tags=["Blogs"])

app.include_router(Mentor_Info.router, tags=["Mentor Info"])
app.include_router(Mentor_Plans.router, tags=["Mentor Plans"])
app.include_router(Mentor_Sessions.router, tags=["Mentor Sessions"])
app.include_router(Mentor_Profile_Card.router, tags=["Mentor Profile Card"])
app.include_router(Mentor_Money.router, tags=["Mentor Money"])

app.include_router(Mentee_Info.router, tags=["Mentee Info"])
app.include_router(Mentee_Plans.router, tags=["Mentee Plans"])
app.include_router(Mentee_Session.router, tags=["Mentee Sessions"])
app.include_router(Mentee_Money.router, tags=["Mentee Money"])
app.include_router(Mentee_Request.router, tags=["Mentee Request"])
app.include_router(Mentee_Comment.router, tags=["Mentee Comment"])
app.include_router(Mentee_Check_Requests.router, tags=["Mentee Check Requests"])

app.include_router(Admin_Mentors.router, tags=["Admin Mentors"])
app.include_router(Admin_Skill.router, tags=["Admin Skills"])
app.include_router(Admin_Comment.router, tags=["Admin Comments"])
app.include_router(Admin_Common_Question.router, tags=["Admin Common Question"])
app.include_router(Admin_Manage_Requests.router, tags=["Admin Manage Requests"])
app.include_router(Admin_Blog.router, tags=["Admin Blog"])

app.include_router(Courses.router, tags=["Course"])
app.include_router(Milestone.router, tags=["Milestone"])
app.include_router(Project.router, tags=["Project"])
app.include_router(Webinar.router, tags=["Webinar"])
app.include_router(Video.router, tags=["Video"])
app.include_router(File.router, tags=["File"])

# ===================== Frontend (CRA build) =====================
# مسیر فولدر build فرانت (نسبت به این فایل)
FRONTEND_BUILD_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "Frontend", "build")
)

# فایل‌های استاتیکِ فرانت (CRA در /static می‌سازد)
frontend_static_dir = os.path.join(FRONTEND_BUILD_DIR, "static")
if os.path.isdir(frontend_static_dir):
    app.mount(
        "/static",
        StaticFiles(directory=frontend_static_dir),
        name="frontend-static",
    )

# Fallback برای SPA — باید بعد از همه‌ی روترها بیاد
@app.get("/{full_path:path}")
def spa_fallback(full_path: str):
    index_path = os.path.join(FRONTEND_BUILD_DIR, "index.html")
    return FileResponse(index_path)
