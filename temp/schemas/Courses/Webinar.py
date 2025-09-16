from pydantic import BaseModel
from datetime import date, time

class CreateWebinarRequest(BaseModel):
    name: str
    date: date
    time: str
    link: str

class WebinarResponse(CreateWebinarRequest):
    id: int

    class Config:
        from_attributes = True
