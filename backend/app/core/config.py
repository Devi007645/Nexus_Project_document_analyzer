import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Project Intelligence Platform"
    DEBUG: bool = True
    
    # Database Configuration
    POSTGRES_URL: str = "postgresql://user:pass@localhost:5432/pidb"
    REDIS_URL: str = "redis://localhost:6379/0"
    RABBITMQ_URL: str = "amqp://guest:guest@localhost:5672//"
    
    # API & Keys
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    LANGSMITH_API_KEY: str = "lsv2_your-langsmith-key"
    LANGSMITH_PROJECT: str = "pi-platform"
    PINECONE_API_KEY: str = "pcsk-your-pinecone-key"
    PINECONE_INDEX_NAME: str = "project-docs"
    JWT_SECRET_KEY: str = "super-secret-jet-key"
    
    # Upload Constraints
    MAX_UPLOAD_SIZE_MB: int = 50

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

# Setup Google Gemini & LangSmith Tracing env variables
os.environ["GOOGLE_API_KEY"] = settings.GEMINI_API_KEY
os.environ["OPENAI_API_KEY"] = settings.OPENAI_API_KEY
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = settings.LANGSMITH_API_KEY
os.environ["LANGCHAIN_PROJECT"] = settings.LANGSMITH_PROJECT

