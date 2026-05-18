from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "pi_worker",
    broker=settings.RABBITMQ_URL,
    backend=settings.REDIS_URL
)

celery_app.conf.task_serializer = "json"
celery_app.conf.result_serializer = "json"
# Discover tasks inside workers module automatically
celery_app.autodiscover_tasks(["app.workers"])
