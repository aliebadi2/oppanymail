from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class MilestoneResponse(BaseModel):
    id: int
    title: str
    text: str
    type: str
    level: int

    class Config:
        from_attributes = True


class ProjectResponse(BaseModel):
    nameOfProject: str
    explanation: str
    operation: str
    downloadLink: str

    class Config:
        from_attributes = True


class WebinarResponse(BaseModel):
    webinarName: str
    dateAndTime: str
    webinarLink: str

    class Config:
        from_attributes = True


class VideoResponse(BaseModel):
    titleOfVideo: str
    downloadLink: str

    class Config:
        from_attributes = True


class FileResponse(BaseModel):
    fileTitle: str
    fileDownloadLink: str

    class Config:
        from_attributes = True


class MentorCourseResponse(BaseModel):
    mentorName: str
    activation: bool
    menteeName: str
    startDate: str
    paymentAmount: str
    timeLeft: str
    dateOfEnd: str
    nowLevel: int
    listOfMilestones: List[MilestoneResponse]
    listOfProjects: List[ProjectResponse]
    listOfWebinars: List[WebinarResponse]
    listOfVideos: List[VideoResponse]
    listOfFiles: List[FileResponse]

    class Config:
        from_attributes = True

