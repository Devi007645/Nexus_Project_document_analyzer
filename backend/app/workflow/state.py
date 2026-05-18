from typing import List, Dict, Any
from typing_extensions import TypedDict

class ProjectState(TypedDict):
    project_id: str
    uploaded_files: List[str]
    extracted_chunks: List[Dict[str, Any]]
    embeddings_complete: bool
    errors: List[str]
    requirements: Dict[str, Any]
    timeline: Dict[str, Any]
    api_specs: Dict[str, Any]
    risks: List[Dict[str, Any]]
    dashboard_output: Dict[str, Any]
