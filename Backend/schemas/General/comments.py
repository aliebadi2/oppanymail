from pydantic import BaseModel

class CommentCreate(BaseModel):
    mentor_id: int
    text: str
    score: float

class CommentResponse(BaseModel):
    id: int
    mentee_name: str
    mentee_family_name: str
    mentee_profile_image: str
    mentor_name: str
    mentor_family_name: str
    text: str
    score: float
    date_created: str
    show_on_main: bool

    class Config:
        orm_mode = True

class AverageScoreResponse(BaseModel):
    mentor_id: int
    average_score: float
