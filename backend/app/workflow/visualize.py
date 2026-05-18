from app.workflow.workflow import build_graph

def generate_visualization():
    """
    Generates and saves a visualization of the LangGraph workflow.
    """
    app = build_graph()
    try:
        # Generate Mermaid PNG
        png_data = app.get_graph().draw_mermaid_png()
        with open("app/workflow/graph_visualization.png", "wb") as f:
            f.write(png_data)
        print("Visualization successfully generated: app/workflow/graph_visualization.png")
    except Exception as e:
        print(f"Failed to generate visualization. Ensure you have the required dependencies installed (e.g., grandalf or pygraphviz). Error: {e}")
        
if __name__ == "__main__":
    generate_visualization()
