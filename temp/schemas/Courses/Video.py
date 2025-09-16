from pydantic import BaseModel

class CreateVideoRequest(BaseModel):
    title: str
    download_link: str

class VideoResponse(CreateVideoRequest):
    id: int

    class Config:
        from_attributes = True
