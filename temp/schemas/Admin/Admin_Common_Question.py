from pydantic import BaseModel

class AdminCommonQuestionBase(BaseModel):
    question: str
    answer: str

class AdminCommonQuestionCreate(AdminCommonQuestionBase):
    pass

class AdminCommonQuestionUpdate(AdminCommonQuestionBase):
    flag: bool

class AdminCommonQuestionResponse(AdminCommonQuestionBase):
    id: int
    flag: bool

    class Config:
        orm_mode = True
