import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models.blog import Blogs, BlogContents
from schemas.Admin.Admin_Blog import (
    Blog, BlogCreate, BlogUpdate,
    BlogContent, BlogContentCreate, BlogContentUpdate, ContentType
)
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/admin/blog", tags=["Admin - Blog"])

UPLOAD_DIR = "static/uploads/blogs"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("/", response_model=List[Blog])
def get_blogs(db: Session = Depends(get_db)):
    blogs = db.query(Blogs).all()
    return blogs


@router.post("/create_blog", response_model=Blog)
async def create_blog(
    blog_title: str = Form(...),
    blog_explanation: Optional[str] = Form(None),
    writer_name: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),
    blog_image: Optional[UploadFile] = File(None),
    writer_image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):

    blog_image_path = None
    writer_image_path = None

    if blog_image:
        blog_image_path = f"{UPLOAD_DIR}/{blog_image.filename}"
        with open(blog_image_path, "wb") as buffer:
            buffer.write(await blog_image.read())

    if writer_image:
        writer_image_path = f"{UPLOAD_DIR}/{writer_image.filename}"
        with open(writer_image_path, "wb") as buffer:
            buffer.write(await writer_image.read())

    new_blog = Blogs(
        blog_title=blog_title,
        blog_explanation=blog_explanation,
        writer_name=writer_name,
        blog_image_path=blog_image_path,
        writer_image_path=writer_image_path,
        tags=tags,
    )

    db.add(new_blog)
    db.commit()
    db.refresh(new_blog)

    return new_blog

@router.put("/{blog_id}", response_model=Blog)
async def update_blog(
    blog_id: int,
    blog_title: Optional[str] = Form(None),
    blog_explanation: Optional[str] = Form(None),
    writer_name: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),
    blog_image: Optional[UploadFile] = File(None),
    writer_image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    """Update a blog and optionally its images."""

    blog = db.query(Blogs).filter(Blogs.blog_id == blog_id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")

    if blog_image:
        blog.blog_image_path = f"{UPLOAD_DIR}/{blog_image.filename}"
        with open(blog.blog_image_path, "wb") as buffer:
            buffer.write(await blog_image.read())

    if writer_image:
        blog.writer_image_path = f"{UPLOAD_DIR}/{writer_image.filename}"
        with open(blog.writer_image_path, "wb") as buffer:
            buffer.write(await writer_image.read())

    if blog_title:
        blog.blog_title = blog_title
    if blog_explanation:
        blog.blog_explanation = blog_explanation
    if writer_name:
        blog.writer_name = writer_name
    if tags:
        blog.tags = tags

    db.commit()
    db.refresh(blog)
    return blog


@router.delete("/{blog_id}")
def delete_blog(blog_id: int, db: Session = Depends(get_db)):
    """Delete a blog and its associated contents."""

    blog = db.query(Blogs).filter(Blogs.blog_id == blog_id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")

    if blog.blog_image_path and os.path.exists(blog.blog_image_path):
        os.remove(blog.blog_image_path)
    if blog.writer_image_path and os.path.exists(blog.writer_image_path):
        os.remove(blog.writer_image_path)

    db.delete(blog)
    db.commit()
    return JSONResponse(content={"message": "Blog deleted successfully"}, status_code=200)


# ------------------------ NEW CONTENT ENDPOINTS ------------------------

@router.post("/{blog_id}/content", response_model=BlogContent)
async def add_content(
    blog_id: int,
    content_type: ContentType = Form(...),
    content: Optional[str] = Form(None),
    content_number: int = Form(...),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    """Add new content (header, paragraph, or image) to a blog."""

    blog = db.query(Blogs).filter(Blogs.blog_id == blog_id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")

    if content_type == ContentType.image and image:
        image_path = f"{UPLOAD_DIR}/{image.filename}"
        with open(image_path, "wb") as buffer:
            buffer.write(await image.read())
        content = image_path  # Store the file path in the database

    new_content = BlogContents(
        blog_id=blog_id,
        content_type=content_type,
        content=content,
        content_number=content_number,
    )
    db.add(new_content)
    db.commit()
    db.refresh(new_content)

    return new_content


@router.get("/{blog_id}/content", response_model=List[BlogContent])
def get_blog_contents(blog_id: int, db: Session = Depends(get_db)):
    """Retrieve all contents of a specific blog."""
    contents = db.query(BlogContents).filter(BlogContents.blog_id == blog_id).all()
    return contents


@router.put("/content/{content_id}", response_model=BlogContent)
def update_content(content_id: int, update_data: BlogContentUpdate, db: Session = Depends(get_db)):
    """Update a specific content item."""
    content = db.query(BlogContents).filter(BlogContents.content_id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    for field, value in update_data.dict(exclude_unset=True).items():
        setattr(content, field, value)

    db.commit()
    db.refresh(content)
    return content


@router.delete("/content/{content_id}")
def delete_content(content_id: int, db: Session = Depends(get_db)):
    """Delete a specific content item from a blog."""
    content = db.query(BlogContents).filter(BlogContents.content_id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    db.delete(content)
    db.commit()
    return {"message": "Content deleted successfully"}
