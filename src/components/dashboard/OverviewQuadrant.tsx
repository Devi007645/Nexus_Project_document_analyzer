import React from 'react';
import { Project } from '../../types';
import { Activity, Clock, Tag, Sparkles, Building2, Flame } from 'lucide-react';

interface OverviewQuadrantProps {
  project: Project;
  onFocus: () => void;
  isFocused: boolean;
}

export const OverviewQuadrant: React.FC<OverviewQuadrantProps> = ({ project, onFocus, isFocused }) => {
  const getComplexityColor = (score: number) => {
    if (score >= 90) return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    if (score >= 80) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  };

  const getComplexityLabel = (score: number) => {
    if (score >= 90) return 'Extreme Risk';
    if (score >= 80) return 'High Complexity';
    return 'Standard Scale';
  };

  return (
    <div className={`flex flex-col bg-zinc-950 border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm transition ${
      isFocused ? 'h-full min-h-[600px] ring-1 ring-indigo-500' : 'h-[380px]'
    }`}>
      {/* Quadrant Header */}
      <div className="px-4 py-3 bg-zinc-900/60 border-b border-zinc-800/80 flex items-center justify-between select-none">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
            Quadrant 1 — Project Overview
          </span>
        </div>
        <button
          onClick={onFocus}
          title={isFocused ? 'Collapse to Grid' : 'Maximize Quadrant'}
          className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 transition"
        >
          {isFocused ? 'Collapse' : 'Maximize'}
        </button>
      </div>

      {/* Quadrant Body */}
      <div className="p-5 overflow-y-auto flex-1 space-y-5 text-zinc-300 font-sans">
        {/* Main Title & Client */}
        <div className="space-y-1.5 pb-4 border-b border-zinc-800/60">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-zinc-100 tracking-tight">{project.name}</h2>
            <span className={`px-2 py-0.5 rounded font-mono text-xs font-bold border ${getComplexityColor(project.complexityScore)}`}>
              Score: {project.complexityScore}/100
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs text-zinc-400 font-mono">
            <div className="flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-zinc-500" />
              <span>{project.clientName}</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1.5">
              <Tag className="w-3.5 h-3.5 text-zinc-500" />
              <span>{project.clientIndustry}</span>
            </div>
          </div>
        </div>

        {/* AI Executive Summary Box */}
        <div className="p-4 rounded-lg bg-zinc-900/40 border border-indigo-500/20 relative space-y-2">
          <div className="absolute top-3 right-3 text-indigo-400/30 font-mono text-[10px]">AI SYNTHESIZED</div>
          <div className="flex items-center space-x-2 text-indigo-400 font-mono text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXECUTIVE EXECUTION BLUEPRINT</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed font-normal">
            "{project.aiSummary}"
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-zinc-900/30 border border-zinc-800/80 rounded-lg space-y-1">
            <div className="flex items-center space-x-1.5 text-zinc-500 text-[11px] font-mono uppercase">
              <Clock className="w-3.5 h-3.5" />
              <span>Estimated Duration</span>
            </div>
            <div className="text-lg font-mono font-bold text-zinc-100">
              {project.estimatedTotalWeeks} Weeks
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">Based on dependency velocity</div>
          </div>

          <div className="p-3 bg-zinc-900/30 border border-zinc-800/80 rounded-lg space-y-1">
            <div className="flex items-center space-x-1.5 text-zinc-500 text-[11px] font-mono uppercase">
              <Activity className="w-3.5 h-3.5" />
              <span>Complexity Assessment</span>
            </div>
            <div className="text-lg font-mono font-bold text-amber-400">
              {getComplexityLabel(project.complexityScore)}
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">Calculated from {project.requirements.length} REQs</div>
          </div>
        </div>

        {/* Recommended Tech Stack */}
        <div className="space-y-2 pt-2">
          <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider flex items-center justify-between">
            <span>Recommended Tech Stack</span>
            <span>{project.recommendedTechStack.length} Technologies</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {project.recommendedTechStack.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 hover:border-zinc-600 transition cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Top Risk Warning box */}
        {project.risks && project.risks.length > 0 && (
          <div className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-lg space-y-1.5 mt-2">
            <div className="flex items-center space-x-1.5 text-rose-400 font-mono text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 shrink-0" />
              <span>PRIMARY ARCHITECTURE RISK</span>
            </div>
            <p className="text-xs text-zinc-300 font-sans">
              <strong className="text-zinc-100">{project.risks[0].title}:</strong> {project.risks[0].mitigationStrategy}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
