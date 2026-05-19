import { create } from 'zustand';
import { AuthUser, Project, UploadedFile, RequirementItem, ChatMessage, TimelineMilestone } from '../types';
import { MOCK_USER, MOCK_PROJECTS } from '../mock/projectData';
import { apiService } from '../services/apiService';

interface AppState {
  // Auth
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;

  // Navigation & Layout
  activeView: 'landing' | 'auth' | 'dashboard';
  setActiveView: (view: 'landing' | 'auth' | 'dashboard') => void;
  activeProjectId: string | null;
  selectProject: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeQuadrantFocus: 'all' | 'overview' | 'requirements' | 'timeline' | 'architecture';
  setActiveQuadrantFocus: (quadrant: 'all' | 'overview' | 'requirements' | 'timeline' | 'architecture') => void;

  // Projects data
  projects: Project[];
  addProject: (project: Project) => void;
  updateRequirement: (reqId: string, updates: Partial<RequirementItem>) => void;
  updateMilestone: (milestoneId: string, updates: Partial<TimelineMilestone>) => void;

  // Ingestion / Upload
  uploadedFiles: UploadedFile[];
  rawFiles: File[];
  isParsing: boolean;
  parsingProgress: number; // 0-100
  parsingStepText: string;
  parsingError: string | null;
  addUploadedFiles: (files: File[]) => void;
  removeUploadedFile: (id: string) => void;
  startParsing: () => Promise<void>;
  resetIngestion: () => void;

  // Traceability Modal / Side Sheet
  selectedRequirement: RequirementItem | null;
  setSelectedRequirement: (req: RequirementItem | null) => void;

  // RAG Chat Assistant
  isChatDrawerOpen: boolean;
  toggleChatDrawer: () => void;
  chatMessages: ChatMessage[];
  isChatStreaming: boolean;
  sendChatMessage: (text: string) => void;
  loadMockData: () => void;
}

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    text: 'Hello! I am your NexusAI Project Intelligence Assistant. I have analyzed all uploaded documents for the active project. Ask me to clarify requirements, generate Jira tickets, verify compliance risks, or draft client emails.',
    timestamp: 'Just now',
    suggestedPrompts: [
      'Generate Jira epics for the Verified requirements',
      'Are there any unmitigated critical security risks?',
      'Draft a client status update email for Phase 1'
    ]
  }
];

export const useAppStore = create<AppState>((set, get) => ({
  // Auth State (Started logged in for seamless demo navigation, but with completely empty data)
  user: MOCK_USER,
  isAuthenticated: true,
  login: (email: string) => {
    set({
      user: {
        ...MOCK_USER,
        email: email || MOCK_USER.email,
        name: email ? email.split('@')[0].toUpperCase() : MOCK_USER.name
      },
      isAuthenticated: true,
      activeView: 'dashboard'
    });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false, activeView: 'landing' });
  },

  // Navigation
  activeView: 'landing',
  setActiveView: (view) => set({ activeView: view }),
  activeProjectId: null,
  selectProject: (id) => set({ activeProjectId: id, activeQuadrantFocus: 'all' }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  activeQuadrantFocus: 'all',
  setActiveQuadrantFocus: (quadrant) => set({ activeQuadrantFocus: quadrant }),

  // Projects data (Started completely blank to remove demo/static datasets)
  projects: [],
  addProject: (project) => set((state) => ({
    projects: [project, ...state.projects],
    activeProjectId: project.id
  })),
  updateRequirement: (reqId, updates) => set((state) => {
    const updatedProjects = state.projects.map((proj) => {
      if (proj.id !== state.activeProjectId) return proj;
      return {
        ...proj,
        requirements: proj.requirements.map((req) => 
          req.id === reqId ? { ...req, ...updates } : req
        )
      };
    });
    return { projects: updatedProjects };
  }),
  updateMilestone: (milestoneId, updates) => set((state) => {
    const updatedProjects = state.projects.map((proj) => {
      if (proj.id !== state.activeProjectId) return proj;
      return {
        ...proj,
        timeline: proj.timeline.map((ms) => 
          ms.id === milestoneId ? { ...ms, ...updates } : ms
        )
      };
    });
    return { projects: updatedProjects };
  }),

  // Ingestion (Started completely blank to remove demo/static datasets)
  uploadedFiles: [],
  rawFiles: [],
  isParsing: false,
  parsingProgress: 0,
  parsingStepText: 'Idle',
  parsingError: null,

  addUploadedFiles: (files) => set((state) => {
    const newFiles: UploadedFile[] = files.map((f, i) => {
      const ext = f.name.split('.').pop() || 'txt';
      return {
        id: `file-${Date.now()}-${i}`,
        name: f.name,
        size: f.size,
        type: ext,
        uploadProgress: 100,
        status: 'completed',
        extractedTokens: Math.floor(f.size / 3.8)
      };
    });

    return { 
      uploadedFiles: [...state.uploadedFiles, ...newFiles],
      rawFiles: [...state.rawFiles, ...files],
      parsingError: null
    };
  }),

  removeUploadedFile: (id) => set((state) => {
    const index = state.uploadedFiles.findIndex((f) => f.id === id);
    if (index === -1) return {};
    const newRawFiles = [...state.rawFiles];
    newRawFiles.splice(index, 1);
    return {
      uploadedFiles: state.uploadedFiles.filter((f) => f.id !== id),
      rawFiles: newRawFiles
    };
  }),

  startParsing: async () => {
    const { rawFiles } = get();
    if (rawFiles.length === 0) return;

    set({ 
      isParsing: true, 
      parsingProgress: 5, 
      parsingStepText: 'Uploading documents to ingestion vault...',
      parsingError: null 
    });

    try {
      // 1. Upload files to FastAPI backend
      const uploadRes = await apiService.uploadDocuments(rawFiles);
      const projectId = uploadRes.project_id;

      set({ parsingProgress: 20, parsingStepText: 'Documents uploaded. Processing system intelligence...' });

      // 2. Poll the backend dashboard endpoint until compilation succeeds or fails
      let attempts = 0;
      const maxAttempts = 150; // up to 5 minutes
      
      const poll = async () => {
        if (attempts >= maxAttempts) {
          throw new Error('Pipeline request timed out. Please verify backend logs.');
        }

        attempts++;
        try {
          const dashboard = await apiService.getProjectDashboard(projectId);
          
          if (dashboard.status === 'processing') {
            // Update progress text dynamically based on polling duration
            let progress = Math.min(95, 20 + Math.floor(attempts * 1.5));
            let stepText = 'Structuring multi-modal layout chunks & tables...';
            if (attempts > 10) stepText = 'Running dense OCR & embedding generation on documents...';
            if (attempts > 25) stepText = 'Structuring requirements into Functional, Non-functional, & Constraints...';
            if (attempts > 40) stepText = 'Cross-referencing citations & evaluating technical complexity scores...';
            if (attempts > 60) stepText = 'Generating architectural specifications & timeline dependency graphs...';
            if (attempts > 85) stepText = 'Analyzing compliance benchmarks & resolving project risks...';
            
            set({ 
              parsingProgress: progress, 
              parsingStepText: stepText 
            });
            
            // Poll again after 2 seconds
            await new Promise((resolve) => setTimeout(resolve, 2000));
            await poll();
          } else if (dashboard.status === 'failed') {
            throw new Error(dashboard.error_message || 'Pipeline analysis execution failed.');
          } else if (dashboard.status === 'completed') {
            // Successful compilation! Add project to list and navigate
            set({ 
              parsingProgress: 100, 
              parsingStepText: 'Project compilation complete!',
              projects: [dashboard, ...get().projects],
              activeProjectId: dashboard.id,
              isParsing: false,
              rawFiles: [],
              uploadedFiles: [],
              activeView: 'dashboard'
            });
          }
        } catch (pollErr: any) {
          throw pollErr;
        }
      };

      await poll();

    } catch (err: any) {
      console.error('Ingestion pipeline failed:', err);
      set({ 
        isParsing: false, 
        parsingProgress: 0, 
        parsingStepText: 'Failed',
        parsingError: err.message || 'An unexpected ingestion pipeline error occurred.'
      });
    }
  },

  resetIngestion: () => set({
    uploadedFiles: [],
    rawFiles: [],
    isParsing: false,
    parsingProgress: 0,
    parsingStepText: 'Idle',
    parsingError: null
  }),

  // Traceability Modal
  selectedRequirement: null,
  setSelectedRequirement: (req) => set({ selectedRequirement: req }),

  // Chat Assistant
  isChatDrawerOpen: false,
  toggleChatDrawer: () => set((state) => ({ isChatDrawerOpen: !state.isChatDrawerOpen })),
  chatMessages: INITIAL_CHAT_MESSAGES,
  isChatStreaming: false,
  sendChatMessage: async (text) => {
    const { activeProjectId } = get();
    if (!activeProjectId) return;

    const userMsgId = `msg-usr-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    set((state) => ({
      chatMessages: [...state.chatMessages, newMsg],
      isChatStreaming: true
    }));

    // Generate typing message container
    const replyMsgId = `msg-ast-${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: replyMsgId,
      sender: 'assistant',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true
    };

    set((state) => ({
      chatMessages: [...state.chatMessages, initialAssistantMsg]
    }));

    try {
      // Call real backend API chat
      const chatRes = await apiService.chatWithProject(activeProjectId, text);
      const replyText = chatRes.answer;

      // Stream the response with beautiful typewriter effect
      const chunks = replyText.split(' ');
      let currentText = '';

      for (const chunk of chunks) {
        await new Promise((res) => setTimeout(res, 35));
        currentText += (currentText ? ' ' : '') + chunk;
        set((state) => ({
          chatMessages: state.chatMessages.map((m) => 
            m.id === replyMsgId ? { ...m, text: currentText } : m
          )
        }));
      }

      set((state) => ({
        isChatStreaming: false,
        chatMessages: state.chatMessages.map((m) => 
          m.id === replyMsgId ? { ...m, isStreaming: false } : m
        )
      }));

    } catch (err: any) {
      console.error('Chat request failed:', err);
      const errMsg = `I encountered a connection error while trying to reach the AI assistant. Please check if the backend is running. (Error: ${err.message || err})`;
      
      set((state) => ({
        isChatStreaming: false,
        chatMessages: state.chatMessages.map((m) => 
          m.id === replyMsgId ? { ...m, text: errMsg, isStreaming: false } : m
        )
      }));
    }
  },
  loadMockData: () => {
    set({
      projects: MOCK_PROJECTS,
      activeProjectId: MOCK_PROJECTS[0].id,
      activeView: 'dashboard'
    });
  }
}));
