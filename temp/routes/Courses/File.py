from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy.orm import Session
from typing import List

from models.File import File
from models.active_plan import ActivePlan
from models.user import User, UserRole
from schemas.Courses.File import CreateFileRequest, FileResponse
from utils.auth import get_db, get_current_user

router = APIRouter()

def check_mentor_role(current_user: User):
    if current_user.role != UserRole.mentor and current_user.role != UserRole.mentee:
        raise HTTPException(status_code=403, detail="Only mentors or mentees can perform this action")

@router.get("/mentor/courses/{active_plan_id}/files", response_model=List[FileResponse])
def get_files(
    active_plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_mentor_role(current_user)
    active_plan = db.query(ActivePlan).filter(
        ActivePlan.id == active_plan_id, ActivePlan.mentor_id == current_user.id
    ).first()

    if not active_plan:
        raise HTTPException(status_code=404, detail="Active plan not found or unauthorized access")

    return active_plan.files


@router.post("/mentor/courses/{active_plan_id}/files", response_model=FileResponse, status_code=status.HTTP_201_CREATED)
def create_file(
    active_plan_id: int,
    request: CreateFileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_mentor_role(current_user)
    active_plan = db.query(ActivePlan).filter(
        ActivePlan.id == active_plan_id, ActivePlan.mentor_id == current_user.id
    ).first()

    if not active_plan:
        raise HTTPException(status_code=404, detail="Active plan not found or unauthorized access")

    new_file = File(
        active_plan_id=active_plan.id,
        title=request.title,
        download_link=request.download_link
    )
    db.add(new_file)
    db.commit()
    db.refresh(new_file)
    return new_file


@router.put("/mentor/files/{file_id}", response_model=FileResponse)
def update_file(
    file_id: int,
    request: CreateFileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_mentor_role(current_user)
    file = db.query(File).filter(File.id == file_id).first()

    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    # Check if the current user is the mentor associated with the active plan
    if file.active_plan.mentor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized access")

    file.title = request.title
    file.download_link = request.download_link

    db.commit()
    db.refresh(file)
    return file


@router.delete("/mentor/files/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_mentor_role(current_user)
    file = db.query(File).filter(File.id == file_id).first()

    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    # Check if the current user is the mentor associated with the active plan
    if file.active_plan.mentor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized access")

    db.delete(file)
    db.commit()
