import React, { useState } from 'react';
import { Project, RequirementCategory, RequirementStatus } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { 
  ShieldCheck, 
  Search, 
  ExternalLink, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  FileText
} from 'lucide-react';

interface RequirementsQuadrantProps {
  project: Project;
  onFocus: () => void;
  isFocused: boolean;
}

export const RequirementsQuadrant: React.FC<RequirementsQuadrantProps> = ({ project, onFocus, isFocused }) => {
  const { updateRequirement, setSelectedRequirement } = useAppStore();
  const [filterCategory, setFilterCategory] = useState<RequirementCategory | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categories: ('All' | RequirementCategory)[] = ['All', 'Functional', 'Non-functional', 'Constraints', 'Integrations'];

  const filteredRequirements = project.requirements.filter((req) => {
    const matchesCategory = filterCategory === 'All' || req.category === filterCategory;
    const matchesSearch = searchTerm === '' || 
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'P0':
        return <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono text-[10px] font-bold border border-rose-500/30">P0</span>;
      case 'P1':
        return <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-[10px] font-bold border border-amber-500/30">P1</span>;
      case 'P2':
        return <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono text-[10px] font-bold border border-blue-500/30">P2</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono text-[10px] border border-zinc-700">P3</span>;
    }
  };

  const getStatusIcon = (status: RequirementStatus) => {
    switch (status) {
      case 'Verified':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'In Progress':
        return <div className="w-3 h-3 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />;
      case 'Blocked':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  return (
    <div className={`flex flex-col bg-zinc-950 border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm transition ${
      isFocused ? 'h-full min-h-[600px] ring-1 ring-indigo-500' : 'h-[380px]'
    }`}>
      {/* Header */}
      <div className="px-4 py-3 bg-zinc-900/60 border-b border-zinc-800/80 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
            Quadrant 2 — Requirements Tree ({filteredRequirements.length})
          </span>
        </div>
        <button
          onClick={onFocus}
          className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 transition"
        >
          {isFocused ? 'Collapse' : 'Maximize'}
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="p-3 bg-zinc-900/30 border-b border-zinc-800/60 flex flex-col sm:flex-row items-center gap-2 shrink-0">
        <div className="relative w-full sm:w-48 shrink-0">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search REQs..."
            className="w-full bg-zinc-900 text-xs text-zinc-200 placeholder-zinc-500 pl-8 pr-2 py-1 rounded border border-zinc-800 focus:outline-none focus:border-zinc-600"
          />
        </div>

        {/* Categories Tab Pill */}
        <div className="flex items-center space-x-1 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2 py-1 rounded text-[11px] font-mono transition shrink-0 ${
                filterCategory === cat
                  ? 'bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700/80'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion Tree List */}
      <div className="p-3 overflow-y-auto flex-1 space-y-2">
        {filteredRequirements.map((req) => {
          const isExpanded = !!expandedIds[req.id];
          return (
            <div
              key={req.id}
              className="bg-zinc-900/40 border border-zinc-800/80 rounded-lg overflow-hidden transition hover:border-zinc-700"
            >
              {/* Requirement Row Header */}
              <div 
                onClick={() => toggleExpand(req.id)}
                className="px-3 py-2.5 flex items-center justify-between cursor-pointer select-none bg-zinc-900/20 hover:bg-zinc-900/60 transition"
              >
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  <span className="text-zinc-500 hover:text-zinc-300">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </span>
                  {getPriorityBadge(req.priority)}
                  <span className="text-xs font-mono font-semibold text-zinc-400 shrink-0">{req.code}</span>
                  <span className="text-xs font-medium text-zinc-200 truncate">{req.title}</span>
                </div>

                <div className="flex items-center space-x-3 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                  {/* Status Dropdown selector */}
                  <div className="flex items-center space-x-1.5 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                    {getStatusIcon(req.status)}
                    <select
                      value={req.status}
                      onChange={(e) => updateRequirement(req.id, { status: e.target.value as RequirementStatus })}
                      className="bg-transparent text-[11px] font-mono text-zinc-300 focus:outline-none cursor-pointer"
                    >
                      <option value="Pending AI Review" className="bg-zinc-900 text-zinc-200">Pending AI Review</option>
                      <option value="In Progress" className="bg-zinc-900 text-zinc-200">In Progress</option>
                      <option value="Verified" className="bg-zinc-900 text-zinc-200">Verified</option>
                      <option value="Blocked" className="bg-zinc-900 text-zinc-200">Blocked</option>
                    </select>
                  </div>

                  {/* Traceability Modal Trigger */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRequirement(req);
                    }}
                    title="View Traceability Grounding"
                    className="p-1.5 rounded bg-zinc-800/80 hover:bg-indigo-600 text-zinc-400 hover:text-white transition group"
                  >
                    <ExternalLink className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Requirement Expanded Details */}
              {isExpanded && (
                <div className="px-4 py-3 bg-zinc-950 border-t border-zinc-800/60 space-y-3 font-sans animate-fadeIn">
                  <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                    {req.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-900 text-[11px] font-mono">
                    <div className="flex items-center space-x-2">
                      <span className="text-zinc-500">Category:</span>
                      <span className="text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">{req.category}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-zinc-500">Complexity:</span>
                      <span className="text-indigo-400 font-semibold">{req.estimatedComplexity}</span>
                    </div>
                  </div>

                  {/* Grounding Source Citation */}
                  {req.citations && req.citations.length > 0 && (
                    <div className="pt-2">
                      <div className="text-[10px] font-mono uppercase text-zinc-500 mb-1 flex items-center justify-between">
                        <span>AI Grounding Citation</span>
                        <span className="text-emerald-400">{(req.citations[0].confidenceScore * 100).toFixed(1)}% Confidence</span>
                      </div>
                      <div 
                        onClick={() => setSelectedRequirement(req)}
                        className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition cursor-pointer group"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <FileText className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 shrink-0" />
                          <span className="truncate">{req.citations[0].documentName} (Pg. {req.citations[0].pageNumber})</span>
                        </div>
                        <span className="text-[10px] text-indigo-400 underline group-hover:text-indigo-300 shrink-0 ml-2">Inspect Source &rarr;</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredRequirements.length === 0 && (
          <div className="text-center py-12 text-zinc-500 text-xs font-mono italic">
            No requirements match your current search/filter.
          </div>
        )}
      </div>
    </div>
  );
};
