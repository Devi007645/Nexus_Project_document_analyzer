import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

# Fallback to SQLite if default PostgreSQL parameters are unchanged or missing
db_url = getattr(settings, "POSTGRES_URL", None) or "sqlite:///./project_intelligence.db"
if db_url.startswith("postgresql://user:pass@"):
    db_url = "sqlite:///./project_intelligence.db"

if db_url.startswith("sqlite"):
    engine = create_engine(db_url, connect_args={"check_same_thread": False})
else:
    engine = create_engine(db_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Request session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
