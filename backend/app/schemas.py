from typing import List, Optional
from pydantic import BaseModel, Field

class RequirementItem(BaseModel):
    description: str = Field(..., description="The detailed requirement text")
    category: str = Field(..., description="Sub-category of the requirement")
    source_file: Optional[str] = None
    page_number: Optional[int] = None
    confidence_score: float = Field(..., ge=0.0, le=1.0)

class RequirementExtraction(BaseModel):
    functional_requirements: List[RequirementItem]
    non_functional_requirements: List[RequirementItem]
    constraints: List[RequirementItem]
    deliverables: List[str]
    integrations: List[str]

class ProjectPhase(BaseModel):
    name: str
    duration_weeks: int
    objectives: List[str]

class ProjectPlan(BaseModel):
    estimated_weeks: int
    phases: List[ProjectPhase]
    recommended_stack: List[str]
    architecture_type: str

class APIEndpoint(BaseModel):
    path: str
    method: str
    description: str
    is_explicit: bool

class APIAnalysis(BaseModel):
    api_specs: List[APIEndpoint]

class RiskItem(BaseModel):
    risk_type: str
    description: str
    severity: str
    mitigation: str

class RiskAnalysis(BaseModel):
    risks: List[RiskItem]

class ChatRequest(BaseModel):
    project_id: str
    question: str
    session_id: str

class ChatResponse(BaseModel):
    answer: str
    session_id: str
