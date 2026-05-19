import os
import secrets
from pydantic_settings import BaseSettings

# Dynamically resolve backend/.env path relative to this file
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.abspath(os.path.join(current_dir, "..", ".."))
env_path = os.path.join(backend_dir, ".env")

class Settings(BaseSettings):
    APP_NAME: str = "Project Intelligence Platform"
    DEBUG: bool = True
    
    # # Database Configuration
    # POSTGRES_URL: str = "postgresql://postgres:devi197@localhost:5432/pidb"
    # REDIS_URL: str = "redis://localhost:6379/0"
    # RABBITMQ_URL: str = "amqp://guest:guest@localhost:5672//"
    
    # API & Keys
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    LANGSMITH_API_KEY: str = ""
    LANGSMITH_PROJECT: str = "Nexus_Project_document_analyzer"
    PINECONE_API_KEY: str = ""
    PINECONE_INDEX_NAME: str = ""
    JWT_SECRET_KEY: str = ""
    
    # Upload Constraints
    MAX_UPLOAD_SIZE_MB: int = 50

    class Config:
        env_file = env_path
        extra = "ignore"

settings = Settings()

# Setup Google Gemini, Pinecone, & LangSmith Tracing env variables
os.environ["GOOGLE_API_KEY"] = settings.GEMINI_API_KEY
os.environ["OPENAI_API_KEY"] = settings.OPENAI_API_KEY
os.environ["PINECONE_API_KEY"] = settings.PINECONE_API_KEY
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = settings.LANGSMITH_API_KEY
os.environ["LANGCHAIN_PROJECT"] = settings.LANGSMITH_PROJECT

