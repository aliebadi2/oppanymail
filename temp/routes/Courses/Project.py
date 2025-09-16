from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy.orm import Session
from typing import List

from models.Project import Project
from models.active_plan import ActivePlan
from models.user import User, UserRole
from schemas.Courses.Project import CreateProjectRequest, ProjectResponse
from utils.auth import get_db, get_current_user

router = APIRouter()

def check_mentor_role(current_user: User):
    if current_user.role != UserRole.mentor and current_user.role != UserRole.mentee:
        raise HTTPException(status_code=403, detail="Only mentors or mentees can perform this action")

@router.get("/mentor/courses/{active_plan_id}/projects", response_model=List[ProjectResponse])
def get_projects(
    active_plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_mentor_role(current_user)
    active_plan = db.query(ActivePlan).filter(
        ActivePlan.id == active_plan_id, ActivePlan.mentor_id == current_user.id
    ).first()

    if not active_plan:
        raise HTTPException(status_code=404, detail="Active plan not found")

    return active_plan.projects


@router.post("/mentor/courses/{active_plan_id}/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    active_plan_id: int,
    request: CreateProjectRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_mentor_role(current_user)
    active_plan = db.query(ActivePlan).filter(
        ActivePlan.id == active_plan_id, ActivePlan.mentor_id == current_user.id
    ).first()

    if not active_plan:
        raise HTTPException(status_code=404, detail="Active plan not found")

    new_project = Project(
        active_plan_id=active_plan.id,
        name=request.name,
        description=request.description,
        status=request.status,
        download_link=request.download_link
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project


@router.put("/mentor/projects/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    request: CreateProjectRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_mentor_role(current_user)
    project = db.query(Project).filter(Project.id == project_id).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project.name = request.name
    project.description = request.description
    project.status = request.status
    project.download_link = request.download_link

    db.commit()
    db.refresh(project)
    return project


@router.delete("/mentor/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_mentor_role(current_user)
    project = db.query(Project).filter(Project.id == project_id).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(project)
    db.commit()
