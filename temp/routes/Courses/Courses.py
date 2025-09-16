from fastapi import APIRouter, Depends, HTTPException, Path, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from datetime import datetime, date

from models.active_plan import ActivePlan
from models.user import User, UserRole
from schemas.Courses.Courses import MentorCourseResponse, MilestoneResponse, ProjectResponse, WebinarResponse, VideoResponse, FileResponse
from utils.auth import get_db, get_current_user

router = APIRouter()

@router.get("/mentor/courses/{active_plan_id}", response_model=MentorCourseResponse)
def get_active_plan_details(
    active_plan_id: int = Path(..., description="ID of the active plan"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if (current_user.role != UserRole.mentor) and (current_user.role != UserRole.mentee):
        raise HTTPException(status_code=403, detail="Only mentors can access this endpoint")

    active_plan = (
        db.query(ActivePlan)
        .options(
            joinedload(ActivePlan.mentee).joinedload(User.details),
            joinedload(ActivePlan.mentor).joinedload(User.details),
            joinedload(ActivePlan.plan),
            joinedload(ActivePlan.milestones),
            joinedload(ActivePlan.projects),
            joinedload(ActivePlan.webinars),
            joinedload(ActivePlan.videos),
            joinedload(ActivePlan.files)
        )
        .filter(ActivePlan.id == active_plan_id, ActivePlan.mentor_id == current_user.id)
        .first()
    )

    if not active_plan:
        raise HTTPException(status_code=404, detail="Active plan not found for this mentor")

    mentee_details = active_plan.mentee.details
    mentor_details = active_plan.mentor.details
    plan = active_plan.plan

    days_left = 0
    if active_plan.end_date:
        today = date.today()
        end_date = active_plan.end_date.date()
        days_left = max((end_date - today).days, 0)

    milestones = [
        MilestoneResponse(
            id=milestone.id,
            title=milestone.title,
            text=milestone.text,
            type=milestone.type,
            level=milestone.level
        )
        for milestone in active_plan.milestones
    ]

    projects = [
        ProjectResponse(
            nameOfProject=project.name,
            explanation=project.description,
            operation=project.status,
            downloadLink=project.download_link
        )
        for project in active_plan.projects
    ]

    webinars = [
        WebinarResponse(
            webinarName=webinar.name,
            dateAndTime=f"{webinar.date} ساعت {webinar.time}",
            webinarLink=webinar.link
        )
        for webinar in active_plan.webinars
    ]

    videos = [
        VideoResponse(
            titleOfVideo=video.title,
            downloadLink=video.download_link
        )
        for video in active_plan.videos
    ]

    files = [
        FileResponse(
            fileTitle=file.title,
            fileDownloadLink=file.download_link
        )
        for file in active_plan.files
    ]

    return MentorCourseResponse(
        mentorName=f"{mentor_details.name} {mentor_details.family_name}" if mentor_details else "Unknown",
        activation=True,
        menteeName=f"{mentee_details.name} {mentee_details.family_name}" if mentee_details else "Unknown",
        startDate=active_plan.start_date.strftime("%Y/%m/%d"),
        paymentAmount=f"{plan.price} تومان",
        timeLeft=f"{days_left} روز",
        dateOfEnd=active_plan.end_date.strftime("%Y/%m/%d") if active_plan.end_date else "نامعلوم",
        nowLevel=1,
        listOfMilestones=milestones,
        listOfProjects=projects,
        listOfWebinars=webinars,
        listOfVideos=videos,
        listOfFiles=files
    )

