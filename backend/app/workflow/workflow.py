from langgraph.graph import StateGraph, END
from app.workflow.state import ProjectState
from app.workflow.nodes import (
    parse_documents_node,
    embedding_node,
    extract_requirements_node,
    generate_plan_node,
    analyze_apis_node,
    analyze_risks_node,
    generate_dashboard_node
)

def build_graph() -> StateGraph:
    workflow = StateGraph(ProjectState)

    # Register Nodes
    workflow.add_node("parse_documents", parse_documents_node)
    workflow.add_node("embed_documents", embedding_node)
    workflow.add_node("extract_requirements", extract_requirements_node)
    workflow.add_node("generate_plan", generate_plan_node)
    workflow.add_node("analyze_apis", analyze_apis_node)
    workflow.add_node("analyze_risks", analyze_risks_node)
    workflow.add_node("generate_dashboard", generate_dashboard_node)

    # Setup Edges
    workflow.set_entry_point("parse_documents")
    workflow.add_edge("parse_documents", "embed_documents")
    workflow.add_edge("embed_documents", "extract_requirements")
    workflow.add_edge("extract_requirements", "generate_plan")
    workflow.add_edge("generate_plan", "analyze_apis")
    workflow.add_edge("analyze_apis", "analyze_risks")
    workflow.add_edge("analyze_risks", "generate_dashboard")
    workflow.add_edge("generate_dashboard", END)

    return workflow.compile()
