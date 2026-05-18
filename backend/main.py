# ==============================================================================
# PROJECT INTELLIGENCE PLATFORM - ENTERPRISE ENTRYPOINT
# ==============================================================================
# This serves as a lightweight gateway forwarding all application layers 
# (FastAPI web routes, LangGraph states, Background task queue runners) to the
# modularized "app/" package directory structure.
# ==============================================================================

import sys
import os

# Add parent directory to sys.path if running as submodule or standalone
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.main import app
from app.workers.celery_app import celery_app

__all__ = ["app", "celery_app"]
