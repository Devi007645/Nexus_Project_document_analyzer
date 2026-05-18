import React from 'react';
import { 
  FolderGit2, 
  FileText, 
  MessageSquareCode, 
  Settings, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  Database,
  Building,
  ShieldAlert
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const Sidebar: React.FC = () => {
  const { 
    projects, 
    activeProjectId, 
    selectProject, 
    uploadedFiles, 
    toggleChatDrawer, 
    setActiveView,
    resetIngestion,
    user
  } = useAppStore();

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800/80 flex flex-col h-screen text-zinc-300 font-sans select-none shrink-0">
      {/* Top Brand Logo */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-zinc-800/80">
        <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveView('landing')}>
          <div className="w-7 h-7 rounded bg-gradient-to-tr from-zinc-700 to-zinc-900 border border-zinc-700 flex items-center justify-center text-white shadow-sm">
            <span className="text-xs font-mono font-bold tracking-tighter">N</span>
          </div>
          <span className="font-semibold text-sm tracking-tight text-zinc-100 flex items-center gap-1.5">
            NexusAI
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800/90 text-zinc-400 border border-zinc-700/50 uppercase tracking-wider">
              Enterprise
            </span>
          </span>
        </div>
      </div>

      {/* Action Button: Ingest New Documents */}
      <div className="p-3">
        <button
          onClick={() => {
            resetIngestion();
            setActiveView('dashboard');
            // Trigger upload modal state or view
            const modal = document.getElementById('ingestion-modal');
            if (modal) (modal as HTMLDialogElement).showModal();
          }}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-md bg-zinc-100 hover:bg-white text-zinc-900 transition font-medium text-xs shadow-sm cursor-pointer group"
        >
          <Sparkles className="w-3.5 h-3.5 text-zinc-900 group-hover:rotate-12 transition-transform" />
          <span>Ingest Client Documents</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
        {/* Project History */}
        <div>
          <div className="flex items-center justify-between px-2 text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
            <span>Project History</span>
            <span className="bg-zinc-800/60 text-zinc-400 px-1.5 py-0.2 rounded text-[10px]">
              {projects.length}
            </span>
          </div>
          <div className="space-y-0.5">
            {projects.map((proj) => {
              const isActive = proj.id === activeProjectId;
              return (
                <button
                  key={proj.id}
                  onClick={() => selectProject(proj.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition cursor-pointer text-left ${
                    isActive
                      ? 'bg-zinc-800 text-zinc-100 shadow-inner border border-zinc-700/50 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <FolderGit2 className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-zinc-500'}`} />
                    <span className="truncate">{proj.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Uploaded Documents */}
        <div>
          <div className="flex items-center justify-between px-2 text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
            <span>Active Documents</span>
            <span className="bg-zinc-800/60 text-zinc-400 px-1.5 py-0.2 rounded text-[10px]">
              {uploadedFiles.length}
            </span>
          </div>
          <div className="space-y-1">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-zinc-900/40 border border-zinc-800/50 text-xs text-zinc-400 hover:text-zinc-300"
              >
                <div className="flex items-center space-x-2 truncate">
                  <FileText className="w-3.5 h-3.5 text-emerald-500/80 shrink-0" />
                  <span className="truncate text-[11px] font-mono">{file.name}</span>
                </div>
                {file.status === 'completed' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
                ) : (
                  <div className="w-3 h-3 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin shrink-0 ml-1" />
                )}
              </div>
            ))}
            {uploadedFiles.length === 0 && (
              <div className="text-[11px] text-zinc-600 px-2 italic">No documents uploaded for this project yet.</div>
            )}
          </div>
        </div>

        {/* AI & Intelligence */}
        <div>
          <div className="px-2 text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
            <span>AI Orchestration</span>
          </div>
          <button
            onClick={toggleChatDrawer}
            className="w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium text-zinc-300 hover:bg-zinc-900/80 hover:text-white transition border border-zinc-800/60 bg-zinc-900/30 cursor-pointer group"
          >
            <div className="flex items-center space-x-2">
              <MessageSquareCode className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span>RAG Assistant & Citations</span>
            </div>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded font-mono font-bold">
              AI Chat
            </span>
          </button>
        </div>

        {/* Workspace Info */}
        <div className="pt-2 border-t border-zinc-800/60">
          <div className="px-2 text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
            <span>Workspace</span>
          </div>
          <div className="space-y-0.5">
            <button className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition">
              <Building className="w-3.5 h-3.5 text-zinc-500" />
              <span>Client Vaults</span>
            </button>
            <button className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition">
              <Database className="w-3.5 h-3.5 text-zinc-500" />
              <span>Vector Embeddings</span>
            </button>
            <button className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition">
              <ShieldAlert className="w-3.5 h-3.5 text-zinc-500" />
              <span>SOC2 Compliance Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom User Profile info */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/90 flex items-center justify-between">
        <div className="flex items-center space-x-2.5 overflow-hidden">
          <img
            src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
            alt="User Avatar"
            className="w-8 h-8 rounded-full border border-zinc-700 object-cover shrink-0"
          />
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-zinc-200 truncate">{user?.name || 'Alex Vance'}</p>
            <p className="text-[10px] text-zinc-500 truncate font-mono">{user?.role || 'Lead Architect'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => setActiveView('landing')}
            title="Workspace Settings"
            className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-200 cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

    </aside>
  );
};
