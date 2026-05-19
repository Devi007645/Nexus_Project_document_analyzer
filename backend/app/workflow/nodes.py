import os
import json
from typing import Dict, Any
from app.core.config import settings
from app.services.document_parser import DocumentParser
from app.services.vector_store import VectorStoreManager
from langchain_openai import ChatOpenAI
from app.workflow.state import ProjectState
from app.schemas import (
    RequirementExtraction,
    ProjectPlan,
    APIAnalysis,
    RiskAnalysis
)

# ==============================================================================
# SYSTEM PROMPTS FOR WORKFLOW NODES
# ==============================================================================
REQ_EXTRACTION_PROMPT = """
You are a Senior Business Analyst AI. Extract structured project requirements from the raw document context.
Categorize requirements, constraints, and integrations. Map every requirement to its source.
If inferred, set confidence_score < 0.8.
CONTEXT FROM DOCUMENTS:
{context}
"""

PLANNING_PROMPT = """
You are a Solution Architect. Based on the extracted requirements, generate a project execution plan.
Include phases, timeline in weeks, tech stack, and architecture type.
REQUIREMENTS:
{requirements}
"""

# ==============================================================================
# SPECIALIZED AGENTS (LangGraph Nodes)
# ==============================================================================
agent_llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.1,
    api_key=settings.OPENAI_API_KEY
)

def parse_documents_node(state: ProjectState) -> ProjectState:
    print("--- [Graph Node] PARSING DOCUMENTS ---")
    all_chunks = []
    for file_path in state["uploaded_files"]:
        filename = os.path.basename(file_path)
        if filename.endswith(".pdf"):
            all_chunks.extend(DocumentParser.parse_pdf(file_path, filename))
        elif filename.endswith(".docx"):
            all_chunks.extend(DocumentParser.parse_docx(file_path, filename))
        elif filename.endswith(".txt") or filename.endswith(".md"):
            all_chunks.extend(DocumentParser.parse_txt(file_path, filename))
    return {"extracted_chunks": all_chunks}

def embedding_node(state: ProjectState) -> ProjectState:
    print("--- [Graph Node] INDEXING EMBEDDINGS ---")
    vs = VectorStoreManager()
    vs.index_documents(state["extracted_chunks"], state["project_id"])
    return {"embeddings_complete": True}

def extract_requirements_node(state: ProjectState) -> ProjectState:
    print("--- [Graph Node] EXTRACTING REQUIREMENTS ---")
    vs = VectorStoreManager()
    retriever = vs.retriever(state["project_id"], k=20)
    docs = retriever.invoke("functional requirements, non-functional requirements, constraints, deliverables")
    context_text = "\n".join([f"Source: {d.metadata['filename']} (Page {d.metadata.get('page_number')})\n{d.page_content}" for d in docs])
    
    structured_llm = agent_llm.with_structured_output(RequirementExtraction)
    response = structured_llm.invoke(REQ_EXTRACTION_PROMPT.format(context=context_text))
    return {"requirements": response.model_dump()}

def generate_plan_node(state: ProjectState) -> ProjectState:
    print("--- [Graph Node] GENERATING PROJECT PLAN ---")
    req_summary = json.dumps(state["requirements"], indent=2)
    structured_llm = agent_llm.with_structured_output(ProjectPlan)
    plan = structured_llm.invoke(PLANNING_PROMPT.format(requirements=req_summary))
    return {"timeline": plan.model_dump()}

def analyze_apis_node(state: ProjectState) -> ProjectState:
    print("--- [Graph Node] ANALYZING APIS ---")
    structured_llm = agent_llm.with_structured_output(APIAnalysis)
    apis = structured_llm.invoke(f"Infer API endpoints needed for this project based on requirements: {str(state['requirements'])[:500]}")
    return {"api_specs": apis.model_dump()}

def analyze_risks_node(state: ProjectState) -> ProjectState:
    print("--- [Graph Node] ANALYZING RISKS ---")
    structured_llm = agent_llm.with_structured_output(RiskAnalysis)
    risks = structured_llm.invoke(f"Analyze risks for this project: {str(state['requirements'])[:500]}")
    return {"risks": risks.model_dump()['risks']}

def generate_dashboard_node(state: ProjectState) -> ProjectState:
    print("--- [Graph Node] GENERATING DASHBOARD JSON ---")
    return {"dashboard_output": {"requirements_count": len(state.get('requirements', {})), "status": "ready"}}
