import React from 'react';
import { Project, TimelineMilestone } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  UserCircle, 
  GitCommit
} from 'lucide-react';

interface TimelineQuadrantProps {
  project: Project;
  onFocus: () => void;
  isFocused: boolean;
}

export const TimelineQuadrant: React.FC<TimelineQuadrantProps> = ({ project, onFocus, isFocused }) => {
  const { updateMilestone } = useAppStore();

  const getStatusBadge = (status: TimelineMilestone['status']) => {
    switch (status) {
      case 'Completed':
        return <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-semibold border border-emerald-500/20 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Done</span>;
      case 'In Progress':
        return <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono text-[10px] font-semibold border border-indigo-500/20 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />Active</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono text-[10px] border border-zinc-700 flex items-center gap-1"><Clock className="w-3 h-3" />Queued</span>;
    }
  };

  return (
    <div className={`flex flex-col bg-zinc-950 border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm transition ${
      isFocused ? 'h-full min-h-[600px] ring-1 ring-indigo-500' : 'h-[380px]'
    }`}>
      {/* Header */}
      <div className="px-4 py-3 bg-zinc-900/60 border-b border-zinc-800/80 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
            Quadrant 3 — Execution Timeline
          </span>
        </div>
        <button
          onClick={onFocus}
          className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 transition"
        >
          {isFocused ? 'Collapse' : 'Maximize'}
        </button>
      </div>

      {/* Timeline Gantt / Milestone Cards */}
      <div className="p-4 overflow-y-auto flex-1 space-y-4 font-sans">
        {project.timeline.map((ms, index) => (
          <div
            key={ms.id}
            className={`p-4 bg-zinc-900/40 border rounded-lg space-y-3 transition ${
              ms.status === 'In Progress' 
                ? 'border-indigo-500/50 bg-indigo-500/5 shadow-sm' 
                : 'border-zinc-800/80 hover:border-zinc-700'
            }`}
          >
            {/* Top Phase bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-800/60">
              <div className="flex items-center space-x-2 overflow-hidden">
                <span className="w-5 h-5 rounded bg-zinc-800 font-mono text-xs font-bold text-zinc-300 flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <span className="text-xs font-mono font-bold text-zinc-300 truncate">{ms.phase}</span>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-[11px] font-mono text-zinc-500">{ms.estimatedDurationWeeks} Weeks</span>
                {getStatusBadge(ms.status)}
                
                {/* Status Switcher */}
                <select
                  value={ms.status}
                  onChange={(e) => updateMilestone(ms.id, { status: e.target.value as any })}
                  className="bg-zinc-900 text-[10px] font-mono text-zinc-400 rounded px-1.5 py-0.5 border border-zinc-800 focus:outline-none cursor-pointer"
                >
                  <option value="Not Started" className="bg-zinc-900 text-zinc-200">Not Started</option>
                  <option value="In Progress" className="bg-zinc-900 text-zinc-200">In Progress</option>
                  <option value="Completed" className="bg-zinc-900 text-zinc-200">Completed</option>
                </select>
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">{ms.title}</h3>
              <div className="flex items-center space-x-4 text-[11px] font-mono text-zinc-500">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-zinc-500" />
                  <span>{ms.startDate} &rarr; {ms.endDate}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <UserCircle className="w-3 h-3 text-zinc-500" />
                  <span>Assignee: {ms.assigneeRole}</span>
                </span>
              </div>
            </div>

            {/* Deliverables Checklist */}
            <div className="pt-2">
              <p className="text-[10px] font-mono uppercase text-zinc-500 mb-1.5">Deliverable Package</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-xs">
                {ms.deliverables.map((deliv, i) => (
                  <div key={i} className="flex items-center space-x-2 text-zinc-300 bg-zinc-900/60 p-2 rounded border border-zinc-800/60">
                    <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${ms.status === 'Completed' ? 'text-emerald-400' : 'text-zinc-600'}`} />
                    <span className="truncate">{deliv}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dependencies */}
            {ms.dependencies && ms.dependencies.length > 0 && (
              <div className="pt-2 flex items-center space-x-2 text-[11px] font-mono text-zinc-500 border-t border-zinc-900">
                <GitCommit className="w-3.5 h-3.5 text-amber-500" />
                <span>Requires completion of Milestone:</span>
                <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">{ms.dependencies.join(', ')}</span>
              </div>
            )}
          </div>
        ))}

        {project.timeline.length === 0 && (
          <div className="text-center py-12 text-zinc-500 text-xs font-mono italic">
            No milestones planned for this project yet.
          </div>
        )}
      </div>
    </div>
  );
};
