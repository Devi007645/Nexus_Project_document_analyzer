import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    projects = relationship("Project", back_populates="owner")

class Project(Base):
    __tablename__ = "projects"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    status = Column(String, default="processing") 
    error_message = Column(Text, nullable=True)
    result_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    owner = relationship("User", back_populates="projects")
    files = relationship("UploadedFile", back_populates="project")
    requirements = relationship("Requirement", back_populates="project")
    timeline = relationship("Timeline", back_populates="project", uselist=False)
    risks = relationship("Risk", back_populates="project")
    api_specs = relationship("APISpec", back_populates="project")

class UploadedFile(Base):
    __tablename__ = "uploaded_files"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    filename = Column(String, nullable=False)
    s3_key = Column(String, nullable=False)
    
    project = relationship("Project", back_populates="files")

class Requirement(Base):
    __tablename__ = "requirements"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    req_type = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    source_file = Column(String, nullable=True)
    page_number = Column(Integer, nullable=True)
    confidence_score = Column(Float, nullable=True)
    
    project = relationship("Project", back_populates="requirements")

class Timeline(Base):
    __tablename__ = "timelines"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    estimated_weeks = Column(Integer, nullable=False)
    phases = Column(JSON, nullable=False)
    recommended_stack = Column(JSON, nullable=False)
    architecture_type = Column(String, nullable=False)
    
    project = relationship("Project", back_populates="timeline")

class Risk(Base):
    __tablename__ = "risks"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    risk_type = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String, nullable=False)
    
    project = relationship("Project", back_populates="risks")

class APISpec(Base):
    __tablename__ = "api_specs"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    endpoint = Column(String, nullable=False)
    method = Column(String, nullable=False)
    
    project = relationship("Project", back_populates="api_specs")
