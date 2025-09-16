from pydantic import BaseModel

class UserWelcome(BaseModel):
    name: str
    family_name: str

    class Config:
        orm_mode = True