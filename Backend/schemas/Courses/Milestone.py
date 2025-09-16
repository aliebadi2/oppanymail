from pydantic import BaseModel

class CreateMilestoneRequest(BaseModel):
    title: str
    text: str
    type: str
    level: int

class MilestoneResponse(CreateMilestoneRequest):
    id: int

    class Config:
        from_attributes = True
