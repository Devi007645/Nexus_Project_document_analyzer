export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Admin' | 'Lead Architect' | 'Engineering Manager';
  organization: string;
};

export type UploadedFile = {
  id: string;
  name: string;
  size: number; // in bytes
  type: string; // pdf, docx, txt, md, json
  uploadProgress: number; // 0-100
  status: 'uploading' | 'queued' | 'parsing' | 'completed' | 'error';
  extractedTokens?: number;
  errorMessage?: string;
};

export type RequirementPriority = 'P0' | 'P1' | 'P2' | 'P3';
export type RequirementStatus = 'Pending AI Review' | 'In Progress' | 'Verified' | 'Blocked';
export type RequirementCategory = 'Functional' | 'Non-functional' | 'Constraints' | 'Integrations';

export type SourceCitation = {
  documentId: string;
  documentName: string;
  pageNumber?: number;
  sectionTitle: string;
  originalText: string;
  confidenceScore: number; // 0.0 - 1.0
};

export type RequirementItem = {
  id: string;
  code: string; // e.g. REQ-AUTH-01
  title: string;
  description: string;
  category: RequirementCategory;
  priority: RequirementPriority;
  status: RequirementStatus;
  estimatedComplexity: 'Low' | 'Medium' | 'High' | 'Extreme';
  citations: SourceCitation[];
  dependencies: string[]; // requirement codes
};

export type TimelineMilestone = {
  id: string;
  phase: string;
  title: string;
  deliverables: string[];
  estimatedDurationWeeks: number;
  startDate: string;
  endDate: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  assigneeRole: string;
  dependencies: string[]; // milestone IDs
};

export type APIEndpoint = {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'WEBSOCKET';
  path: string;
  summary: string;
  description: string;
  authRequired: boolean;
  requestPayloadExample?: string;
  responsePayloadExample: string;
};

export type ArchitectureSpec = {
  suggestedServices: {
    name: string;
    type: 'Frontend' | 'Backend Microservice' | 'Data Pipeline' | 'Gateway' | 'Worker';
    description: string;
    tech: string[];
  }[];
  databases: {
    name: string;
    type: 'Relational' | 'NoSQL' | 'Vector' | 'Cache';
    purpose: string;
  }[];
  authMethods: string[];
  deploymentRecommendations: string[];
};

export type ProjectRisk = {
  id: string;
  title: string;
  impact: 'Low' | 'Medium' | 'High' | 'Critical';
  probability: 'Low' | 'Medium' | 'High';
  mitigationStrategy: string;
};

export type Project = {
  id: string;
  name: string;
  clientName: string;
  clientIndustry: string;
  aiSummary: string;
  complexityScore: number; // 0 - 100
  estimatedTotalWeeks: number;
  recommendedTechStack: string[];
  createdAt: string;
  updatedAt: string;
  documentsCount: number;
  requirements: RequirementItem[];
  timeline: TimelineMilestone[];
  apiEndpoints: APIEndpoint[];
  architecture: ArchitectureSpec;
  risks: ProjectRisk[];
};

export type ChatMessage = {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: { docName: string; quote: string }[];
  suggestedPrompts?: string[];
  isStreaming?: boolean;
};
