from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.blog import Blogs
from schemas.General.Blog import BlogListResponse, BlogDetailResponse

router = APIRouter(prefix="/blogs")

@router.get("/", response_model=List[BlogListResponse])
def list_blogs(db: Session = Depends(get_db)):
    return db.query(Blogs).order_by(Blogs.created_at.desc()).all()

@router.get("/{blog_id}", response_model=BlogDetailResponse)
def get_blog(blog_id: int, db: Session = Depends(get_db)):
    blog = db.query(Blogs).filter(Blogs.id == blog_id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog
