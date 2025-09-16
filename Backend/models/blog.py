# models/blog.py

import enum
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    func
)
from sqlalchemy.orm import relationship
from database import Base

class ContentType(str, enum.Enum):
    header = "header"
    paragraph = "paragraph"
    image = "image"

class Blogs(Base):
    __tablename__ = "blogs"

    blog_id = Column(Integer, primary_key=True, index=True)
    blog_title = Column(String(255), nullable=False)
    blog_explanation = Column(Text, nullable=True)
    writer_name = Column(String(100), nullable=True)
    blog_image_path = Column(String(255), nullable=True)
    writer_image_path = Column(String(255), nullable=True)
    create_date = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_update_date = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    tags = Column(Text, nullable=True)  # store as comma-separated or JSON if needed

    # Relationship to contents
    contents = relationship("BlogContents", back_populates="blog", cascade="all, delete-orphan")

class BlogContents(Base):
    __tablename__ = "blog_contents"

    content_id = Column(Integer, primary_key=True, index=True)
    blog_id = Column(Integer, ForeignKey("blogs.blog_id"), nullable=False)

    content_type = Column(String(50), nullable=False)  # or an enum name if you want
    content = Column(Text, nullable=False)  # could be text, image path, or header
    content_number = Column(Integer, nullable=False)   # order of the item in the blog

    # Relationship back to the blog
    blog = relationship("Blogs", back_populates="contents")
