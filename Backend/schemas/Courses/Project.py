from pydantic import BaseModel

class CreateProjectRequest(BaseModel):
    name: str
    description: str
    status: str
    download_link: str

class ProjectResponse(CreateProjectRequest):
    id: int

    class Config:
        from_attributes = True
