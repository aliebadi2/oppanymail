from pydantic import BaseModel

class CreateFileRequest(BaseModel):
    title: str
    download_link: str

class FileResponse(CreateFileRequest):
    id: int

    class Config:
        from_attributes = True
