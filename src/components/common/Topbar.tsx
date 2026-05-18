import React from 'react';
import { Search, Sparkles, LayoutGrid, Maximize2, ShieldCheck, LogOut } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const Topbar: React.FC = () => {
  const { 
    projects, 
    activeProjectId, 
    searchQuery, 
    setSearchQuery, 
    toggleChatDrawer, 
    activeQuadrantFocus, 
    setActiveQuadrantFocus, 
    logout 
  } = useAppStore();

  const currentProject = projects.find((p) => p.id === activeProjectId) || projects[0] || null;

  return (
    <header className="h-14 bg-zinc-950/90 backdrop-blur border-b border-zinc-800/80 px-6 flex items-center justify-between text-zinc-300 font-sans select-none shrink-0 z-10">
      {/* Left side: Project Title & Stats */}
      <div className="flex items-center space-x-4 overflow-hidden">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-zinc-100 tracking-tight truncate max-w-xs md:max-w-md">
            {currentProject ? currentProject.name : 'NexusAI Workspace'}
          </span>
          {currentProject && (
            <span className="bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 px-2 py-0.5 rounded text-[10px] font-mono tracking-wide hidden sm:inline-block">
              {currentProject.clientIndustry}
            </span>
          )}
        </div>

        {currentProject && (
          <div className="hidden lg:flex items-center space-x-2 text-xs text-zinc-500 font-mono">
            <span>•</span>
            <span className="text-indigo-400 font-semibold">{currentProject.requirements.length} REQs</span>
            <span>•</span>
            <span>{currentProject.documentsCount} Docs Indexed</span>
          </div>
        )}
      </div>


      {/* Middle: Universal Search */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search requirements, API endpoints, risks, milestones..."
            className="w-full bg-zinc-900/60 text-xs text-zinc-200 placeholder-zinc-500 pl-9 pr-3 py-1.5 rounded-md border border-zinc-800 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 transition"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 hover:text-zinc-300 bg-zinc-800 px-1 rounded"
            >
              ESC
            </button>
          )}
        </div>
      </div>

      {/* Right side: Actions & User Dropdown */}
      <div className="flex items-center space-x-3">
        {/* Quadrant focus controller */}
        <div className="flex items-center bg-zinc-900/80 p-0.5 rounded-md border border-zinc-800 text-xs">
          <button
            onClick={() => setActiveQuadrantFocus('all')}
            title="4-Quadrant Grid View"
            className={`px-2 py-1 rounded flex items-center space-x-1 transition ${
              activeQuadrantFocus === 'all' 
                ? 'bg-zinc-800 text-zinc-100 font-medium shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Grid</span>
          </button>
          <button
            onClick={() => setActiveQuadrantFocus('overview')}
            title="Focus Project Overview"
            className={`px-2 py-1 rounded flex items-center space-x-1 transition ${
              activeQuadrantFocus === 'overview' 
                ? 'bg-zinc-800 text-zinc-100 font-medium shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Q1</span>
          </button>
          <button
            onClick={() => setActiveQuadrantFocus('requirements')}
            title="Focus Requirements Tree"
            className={`px-2 py-1 rounded flex items-center space-x-1 transition ${
              activeQuadrantFocus === 'requirements' 
                ? 'bg-zinc-800 text-zinc-100 font-medium shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Q2</span>
          </button>
        </div>

        {/* AI Assistant Trigger Button */}
        <button
          onClick={toggleChatDrawer}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-sm transition cursor-pointer relative group"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Ask AI</span>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-zinc-950 animate-ping" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-zinc-950" />
        </button>

        <div className="h-4 w-px bg-zinc-800/80" />

        {/* User Status / Logout */}
        <button
          onClick={logout}
          title="Sign out & Lock session"
          className="flex items-center space-x-1 text-xs text-zinc-400 hover:text-rose-400 px-2 py-1.5 rounded hover:bg-zinc-900 transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Exit Session</span>
        </button>
      </div>
    </header>
  );
};
