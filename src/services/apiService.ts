import { Project, RequirementItem } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const apiService = {
  /**
   * Uploads multiple document files to the backend.
   */
  async uploadDocuments(files: File[]): Promise<{ project_id: string; status: string }> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await fetch(`${API_BASE_URL}/api/v1/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || 'Failed to upload documents');
    }

    return response.json();
  },

  /**
   * Fetches the complete project dashboard metadata from the backend.
   */
  async getProjectDashboard(projectId: string): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/api/v1/dashboard/${projectId}`);
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || 'Failed to fetch project dashboard');
    }
    return response.json();
  },

  /**
   * Asks the specialized AI assistant a question relative to the project.
   */
  async chatWithProject(projectId: string, question: string, sessionId: string = 'global-session'): Promise<{ answer: string; session_id: string }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project_id: projectId,
        question: question,
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || 'Chat connection error');
    }

    return response.json();
  },

  /**
   * Generates a Jira-compatible JSON import format from requirements.
   */
  async exportRequirementsJira(requirements: RequirementItem[]): Promise<string> {
    const payload = requirements.map((r) => ({
      summary: `[${r.code}] ${r.title}`,
      description: `${r.description}\n\nCategory: ${r.category}\nPriority: ${r.priority}\nComplexity: ${r.estimatedComplexity}`,
      priority: r.priority === 'P0' ? 'Highest' : r.priority === 'P1' ? 'High' : 'Medium'
    }));
    return JSON.stringify(payload, null, 2);
  }
};
