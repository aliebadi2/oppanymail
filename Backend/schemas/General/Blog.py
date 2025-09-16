# schemas/General/blog.py

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

class ContentType(str, Enum):
    header = "header"
    paragraph = "paragraph"
    image = "image"

# Each item inside the blog (title, paragraph, image)
class BlogContentResponse(BaseModel):
    content_type: ContentType
    content: Optional[str] = None  # Text for headers/paragraphs
    src: Optional[str] = None      # Image source (if content_type is "image")
    alt: Optional[str] = None      # Alternative text for images
    order: Optional[int] = None    # Order of items in the blog

    class Config:
        orm_mode = True

# Public response for blog list (no contents)
class BlogListResponse(BaseModel):
    id: int
    title: str
    main_title: str
    tag: Optional[str]
    cover_image: Optional[str]
    author_image: Optional[str]
    author_name: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True

# Public response for single blog (with all contents)
class BlogDetailResponse(BlogListResponse):
    contents: List[BlogContentResponse]

    class Config:
        orm_mode = True
