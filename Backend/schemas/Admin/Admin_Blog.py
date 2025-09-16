# schemas/Admin/Admin_Blog.py

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import enum


class ContentType(str, enum.Enum):
    header = "header"
    paragraph = "paragraph"
    image = "image"


class BlogContentBase(BaseModel):
    content_type: ContentType
    content: str
    content_number: int


class BlogContentCreate(BlogContentBase):
    pass


class BlogContentUpdate(BaseModel):
    content_type: Optional[ContentType] = None
    content: Optional[str] = None
    content_number: Optional[int] = None


class BlogContent(BlogContentBase):
    content_id: int

    class Config:
        from_attributes = True


class BlogBase(BaseModel):
    blog_title: str
    blog_explanation: Optional[str] = None
    writer_name: Optional[str] = None
    tags: Optional[str] = None


class BlogCreate(BlogBase):
    contents: List[BlogContentCreate]


class BlogUpdate(BlogBase):
    contents: Optional[List[BlogContentCreate]] = None


class Blog(BlogBase):
    blog_id: int
    create_date: datetime
    last_update_date: datetime
    blog_image_path: Optional[str] = None
    writer_image_path: Optional[str] = None
    contents: List[BlogContent]

    class Config:
        from_attributes = True
