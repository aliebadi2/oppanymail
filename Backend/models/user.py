from sqlalchemy import Column, String, Boolean, Integer, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSON
from database import Base
from persiantools.jdatetime import JalaliDate
import enum
from models.request import Request
from models.active_plan import ActivePlan
from models.active_session import ActiveSession


class UserRole(enum.Enum):
    admin = "admin"
    mentor = "mentor"
    mentee = "mentee"

class Degree(enum.Enum):
    under_bachelor = "under_bachelor"
    bachelor = "bachelor"
    master = "master"
    phd = "phd"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    password = Column(String(128), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    role = Column(Enum(UserRole), nullable=False)
    email_validation = Column(Boolean, default=False)
    signup_date = Column(String(10), default=JalaliDate.today().strftime('%Y/%m/%d'))

    details = relationship("UserDetails", back_populates="user", uselist=False)

    mentee_comments = relationship("Comment", foreign_keys="[Comment.mentee_id]", back_populates="mentee")
    mentor_comments = relationship("Comment", foreign_keys="[Comment.mentor_id]", back_populates="mentor")

    wallet = relationship("Wallet", uselist=False, back_populates="user")
    plans = relationship("Plan", back_populates="mentor")
    sessions = relationship("Session", back_populates="mentor")
    mentee_requests = relationship("Request", back_populates="mentee", foreign_keys=[Request.mentee_id])
    mentor_requests = relationship("Request", back_populates="mentor", foreign_keys=[Request.mentor_id])
    active_plans_as_mentee = relationship("ActivePlan", back_populates="mentee", foreign_keys=[ActivePlan.mentee_id])
    active_plans_as_mentor = relationship("ActivePlan", back_populates="mentor", foreign_keys=[ActivePlan.mentor_id])
    active_sessions_as_mentee = relationship("ActiveSession", back_populates="mentee", foreign_keys=[ActiveSession.mentee_id])
    active_sessions_as_mentor = relationship("ActiveSession", back_populates="mentor", foreign_keys=[ActiveSession.mentor_id])


class UserDetails(Base):
    __tablename__ = "user_details"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(50), nullable=False)
    family_name = Column(String(50), nullable=False)
    city = Column(String(100), nullable=False, default="Unknown")
    country = Column(String(100), nullable=False, default="Unknown")
    degree = Column(Enum(Degree), nullable=True)
    field_of_study = Column(String(100), nullable=True)
    university = Column(String(100), nullable=True)
    skills = Column(JSON, nullable=True, default=[])
    bio = Column(Text, nullable=True)
    cv_file = Column(String(255), nullable=True)
    phone_number = Column(String(15), nullable=True)
    profile_image = Column(String(255), nullable=True)
    admin_validation = Column(Boolean, default=False)


    user = relationship("User", back_populates="details")




