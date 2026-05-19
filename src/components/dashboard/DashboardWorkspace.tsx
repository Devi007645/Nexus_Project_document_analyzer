import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Topbar } from '../common/Topbar';
import { Sidebar } from '../common/Sidebar';
import { OverviewQuadrant } from './OverviewQuadrant';
import { RequirementsQuadrant } from './RequirementsQuadrant';
import { TimelineQuadrant } from './TimelineQuadrant';
import { ArchitectureQuadrant } from './ArchitectureQuadrant';
import { ProjectIngestionModal } from './ProjectIngestionModal';
import { TraceabilityModal } from './TraceabilityModal';
import { AIChatDrawer } from './AIChatDrawer';
import { UploadCloud, Cpu, BookOpen, Layers } from 'lucide-react';


export const DashboardWorkspace: React.FC = () => {
  const { projects, activeProjectId, activeQuadrantFocus, setActiveQuadrantFocus, loadMockData } = useAppStore();

  const openIngestionModal = () => {
    const modal = document.getElementById('ingestion-modal') as HTMLDialogElement;
    if (modal) modal.showModal();
  };

  if (projects.length === 0) {
    return (
      <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans select-none">
        {/* Left Navigation */}
        <Sidebar />

        {/* Main Workspace Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
          <Topbar />

          {/* Premium Empty State Screen */}
          <main className="flex-1 p-8 overflow-y-auto bg-zinc-950/40 flex flex-col items-center justify-center relative">
            {/* Soft Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />

            <div className="max-w-2xl text-center space-y-8 z-10">
              {/* Glowing Icon Container */}
              <div className="inline-flex relative animate-bounce duration-1000">
                <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl animate-pulse" />
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-400 relative shadow-2xl">
                  <Cpu className="w-8 h-8 animate-pulse" />
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100 bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 via-zinc-200 to-indigo-300">
                  Awaiting Engineering Blueprints
                </h1>
                <p className="text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
                  Ingest system specifications, RFPs, or product documentation. 
                  NexusAI will analyze the content and synthesize a dual-mode project dashboard.
                </p>
              </div>

              {/* Action Button */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={openIngestionModal}
                  className="px-8 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-200 shadow-xl shadow-indigo-500/15 hover:shadow-indigo-500/20 flex items-center space-x-2.5 cursor-pointer border border-indigo-400/20 active:scale-98"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Launch Ingestion Pipeline</span>
                </button>
                <button
                  onClick={loadMockData}
                  className="px-6 py-3.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-semibold text-sm transition cursor-pointer flex items-center space-x-2 active:scale-98"
                >
                  <span>Load Demo Data</span>
                </button>
              </div>

              {/* Capability Grid */}
              <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto pt-6 border-t border-zinc-900">
                <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900/60 text-left space-y-1.5 hover:border-zinc-800 transition">
                  <div className="flex items-center space-x-2 text-indigo-400">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider font-mono">Quadrant 1 & 2</span>
                  </div>
                  <h3 className="text-xs font-semibold text-zinc-200">Semantic Requirements</h3>
                  <p className="text-[10px] text-zinc-500 leading-normal">
                    P0/P1 categorization, dynamic complexity indexing, and strict context file citations.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900/60 text-left space-y-1.5 hover:border-zinc-800 transition">
                  <div className="flex items-center space-x-2 text-purple-400">
                    <Layers className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider font-mono">Quadrant 3 & 4</span>
                  </div>
                  <h3 className="text-xs font-semibold text-zinc-200">Architecture & Timelines</h3>
                  <p className="text-[10px] text-zinc-500 leading-normal">
                    Interactive dependency milestone timelines, microservice definitions, and database recommendations.
                  </p>
                </div>
              </div>

              <div className="text-[10px] text-zinc-600 font-mono">
                NexusAI Engine Version 1.0.0 (FastAPI + SQLAlchemy + SQLite Fallback)
              </div>
            </div>
          </main>
        </div>

        {/* Overlays / Modals */}
        <ProjectIngestionModal />
        <TraceabilityModal />
        <AIChatDrawer />
      </div>
    );
  }

  const currentProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const toggleFocus = (quadrant: 'overview' | 'requirements' | 'timeline' | 'architecture') => {
    if (activeQuadrantFocus === quadrant) {
      setActiveQuadrantFocus('all');
    } else {
      setActiveQuadrantFocus(quadrant);
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans select-none">
      {/* Left Navigation */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Topbar />

        {/* 4 Quadrants Container */}
        <main className="flex-1 p-6 overflow-y-auto bg-zinc-950/40">
          <div className={`grid gap-6 ${
            activeQuadrantFocus === 'all' 
              ? 'grid-cols-1 xl:grid-cols-2 auto-rows-fr' 
              : 'grid-cols-1 h-full'
          }`}>
            {(activeQuadrantFocus === 'all' || activeQuadrantFocus === 'overview') && (
              <OverviewQuadrant 
                project={currentProject} 
                onFocus={() => toggleFocus('overview')} 
                isFocused={activeQuadrantFocus === 'overview'} 
              />
            )}

            {(activeQuadrantFocus === 'all' || activeQuadrantFocus === 'requirements') && (
              <RequirementsQuadrant 
                project={currentProject} 
                onFocus={() => toggleFocus('requirements')} 
                isFocused={activeQuadrantFocus === 'requirements'} 
              />
            )}

            {(activeQuadrantFocus === 'all' || activeQuadrantFocus === 'timeline') && (
              <TimelineQuadrant 
                project={currentProject} 
                onFocus={() => toggleFocus('timeline')} 
                isFocused={activeQuadrantFocus === 'timeline'} 
              />
            )}

            {(activeQuadrantFocus === 'all' || activeQuadrantFocus === 'architecture') && (
              <ArchitectureQuadrant 
                project={currentProject} 
                onFocus={() => toggleFocus('architecture')} 
                isFocused={activeQuadrantFocus === 'architecture'} 
              />
            )}
          </div>
        </main>
      </div>

      {/* Overlays / Modals */}
      <ProjectIngestionModal />
      <TraceabilityModal />
      <AIChatDrawer />
    </div>
  );
};
