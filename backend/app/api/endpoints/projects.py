import uuid
import os
import tempfile
import socket
from urllib.parse import urlparse
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Project, UploadedFile
from app.workers.tasks import process_project_intelligence, run_pipeline_logic
from app.core.config import settings

router = APIRouter(tags=["Projects"])

def is_service_online(url: str, default_port: int) -> bool:
    """Helper to check if a TCP service is online with a fast 0.5s timeout."""
    try:
        parsed = urlparse(url)
        host = parsed.hostname or "localhost"
        port = parsed.port or default_port
        with socket.create_connection((host, port), timeout=0.5):
            return True
    except Exception:
        return False

@router.post("/api/v1/upload")
async def upload_documents(
    background_tasks: BackgroundTasks,
    files: list[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    project_id = str(uuid.uuid4())
    project_name = files[0].filename.split('.')[0].replace('_', ' ').replace('-', ' ').title()
    
    # Create project record in DB
    project = Project(id=project_id, name=project_name, user_id="system", status="processing")
    db.add(project)
    db.commit()

    # Create temporary directory inside standard system temp for cross-platform upload safety
    upload_dir = os.path.join(tempfile.gettempdir(), "pip_uploads")
    os.makedirs(upload_dir, exist_ok=True)

    file_paths = []
    for file in files:
        file_location = os.path.join(upload_dir, f"{project_id}_{file.filename}")
        with open(file_location, "wb+") as file_object:
            file_object.write(file.file.read())
        file_paths.append(file_location)
        db.add(UploadedFile(project_id=project_id, filename=file.filename, s3_key=file_location))
    db.commit()

    # Fast-check if RabbitMQ and Redis are active before using Celery to prevent hanging
    rabbitmq_online = is_service_online(settings.RABBITMQ_URL, 5672)
    redis_online = is_service_online(settings.REDIS_URL, 6379)

    if rabbitmq_online and redis_online:
        try:
            process_project_intelligence.delay(project_id, file_paths)
            print("Successfully dispatched task to Celery.")
        except Exception as e:
            print(f"Celery connection failed ({e}). Running synchronously via BackgroundTasks.")
            background_tasks.add_task(run_pipeline_logic, project_id, file_paths)
    else:
        print("RabbitMQ or Redis is offline. Running synchronously via BackgroundTasks.")
        background_tasks.add_task(run_pipeline_logic, project_id, file_paths)

    return {"project_id": project_id, "status": "processing"}


@router.get("/api/v1/dashboard/{project_id}")
async def get_dashboard(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    response = {
        "id": project.id,
        "name": project.name,
        "status": project.status,
        "error_message": project.error_message,
        "created_at": project.created_at.isoformat() if project.created_at else None,
    }
    
    if project.status == "completed" and project.result_json:
        response.update(project.result_json)
        
    return response
