import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X, FileText, CheckCircle2, Sparkles } from 'lucide-react';

export const TraceabilityModal: React.FC = () => {
  const { selectedRequirement, setSelectedRequirement } = useAppStore();

  if (!selectedRequirement) return null;

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden w-full max-w-2xl text-zinc-100 font-sans flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
              {selectedRequirement.priority}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <span>{selectedRequirement.code}</span>
                <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono font-normal">
                  {selectedRequirement.category}
                </span>
              </h3>
              <p className="text-xs text-zinc-400 truncate max-w-md">{selectedRequirement.title}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedRequirement(null)}
            className="text-zinc-500 hover:text-zinc-300 p-1 rounded hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* AI Requirement Interpretation */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Extracted Specification</h4>
            <div className="p-4 bg-zinc-900/30 rounded-lg border border-zinc-800 text-xs text-zinc-200 leading-relaxed font-sans">
              {selectedRequirement.description}
            </div>
            <div className="flex items-center space-x-4 text-[11px] font-mono text-zinc-400">
              <span>Status: <strong className="text-indigo-400">{selectedRequirement.status}</strong></span>
              <span>•</span>
              <span>Complexity: <strong className="text-amber-400">{selectedRequirement.estimatedComplexity}</strong></span>
            </div>
          </div>

          {/* Grounding Excerpts */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider">
              <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Source Documents ({selectedRequirement.citations?.length || 0})</span>
              </span>
            </div>

            {selectedRequirement.citations && selectedRequirement.citations.length > 0 ? (
              <div className="space-y-4">
                {selectedRequirement.citations.map((cite, idx) => (
                  <div key={idx} className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-zinc-800">
                      <div className="flex items-center space-x-2 text-xs font-mono text-zinc-300">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-zinc-100">{cite.documentName}</span>
                        {cite.pageNumber && (
                          <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-[10px] text-zinc-400">
                            Page {cite.pageNumber}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                          {(cite.confidenceScore * 100).toFixed(1)}% Grounding Match
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">{cite.sectionTitle}</span>
                      <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900 font-mono text-xs text-zinc-300 leading-relaxed overflow-x-auto select-all">
                        "{cite.originalText}"
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-zinc-900/20 rounded-xl border border-zinc-800 text-xs text-zinc-500 font-mono">
                No explicit citations anchored to this requirement.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-900/60 border-t border-zinc-800 flex items-center justify-between shrink-0 font-mono text-xs">
          <div className="flex items-center space-x-2 text-zinc-500">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>ID: {selectedRequirement.id}</span>
          </div>
          <button
            onClick={() => setSelectedRequirement(null)}
            className="px-5 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition font-sans font-semibold cursor-pointer text-xs"
          >
            Done Inspecting
          </button>
        </div>
      </div>
    </div>
  );
};
