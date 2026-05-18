from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.middleware import RequestTraceMiddleware
from app.api.endpoints.projects import router as projects_router
from app.api.endpoints.chat import router as chat_router

# Initialize database tables automatically on startup
from app.core.database import Base, engine
import app.models  # Import to register models on Base
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.APP_NAME, version="1.0.0", docs_url="/docs")

# Register correlation request tracing middleware
app.add_middleware(RequestTraceMiddleware)

# Configure Cross-Origin Resource Sharing (CORS) policies
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

# Register endpoints routers
app.include_router(projects_router)
app.include_router(chat_router)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
