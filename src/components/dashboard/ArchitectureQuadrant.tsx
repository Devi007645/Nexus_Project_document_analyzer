import React, { useState } from 'react';
import { Project, APIEndpoint } from '../../types';
import { 
  Server, 
  Copy, 
  Check, 
  Database, 
  ShieldCheck, 
  Cloud, 
  Layers 
} from 'lucide-react';

interface ArchitectureQuadrantProps {
  project: Project;
  onFocus: () => void;
  isFocused: boolean;
}

export const ArchitectureQuadrant: React.FC<ArchitectureQuadrantProps> = ({ project, onFocus, isFocused }) => {
  const [activeTab, setActiveTab] = useState<'endpoints' | 'architecture'>('endpoints');
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(project.apiEndpoints?.[0] || null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'GET':
        return <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">GET</span>;
      case 'POST':
        return <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-[10px] font-bold border border-amber-500/30">POST</span>;
      case 'PUT':
      case 'PATCH':
        return <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono text-[10px] font-bold border border-blue-500/30">{method}</span>;
      case 'DELETE':
        return <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono text-[10px] font-bold border border-rose-500/30">DELETE</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-mono text-[10px] font-bold border border-purple-500/30">{method}</span>;
    }
  };

  const hasEndpoints = project.apiEndpoints && project.apiEndpoints.length > 0;

  return (
    <div className={`flex flex-col bg-zinc-950 border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm transition ${
      isFocused ? 'h-full min-h-[600px] ring-1 ring-indigo-500' : 'h-[380px]'
    }`}>
      {/* Header */}
      <div className="px-4 py-3 bg-zinc-900/60 border-b border-zinc-800/80 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center space-x-2">
          <Server className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
            Quadrant 4 — Architecture & APIs
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-zinc-900 p-0.5 rounded border border-zinc-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('endpoints')}
              className={`px-2 py-0.5 rounded transition ${activeTab === 'endpoints' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Endpoints ({project.apiEndpoints?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-2 py-0.5 rounded transition ${activeTab === 'architecture' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Blueprint
            </button>
          </div>
          <button
            onClick={onFocus}
            className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 transition"
          >
            {isFocused ? 'Collapse' : 'Maximize'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden flex flex-col font-sans">
        {activeTab === 'endpoints' && hasEndpoints && (
          <div className="flex flex-1 overflow-hidden flex-col sm:flex-row">
            {/* Endpoints navigation list */}
            <div className="w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-zinc-800/80 bg-zinc-950/40 p-2 overflow-y-auto space-y-1 shrink-0">
              {project.apiEndpoints.map((ep) => {
                const isSelected = selectedEndpoint?.id === ep.id;
                return (
                  <div
                    key={ep.id}
                    onClick={() => setSelectedEndpoint(ep)}
                    className={`p-2.5 rounded-lg flex items-center justify-between transition cursor-pointer text-xs ${
                      isSelected ? 'bg-zinc-800/90 text-zinc-100 font-semibold border border-zinc-700/80' : 'hover:bg-zinc-900/60 text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      {getMethodBadge(ep.method)}
                      <span className="font-mono text-[11px] truncate">{ep.path}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Endpoint payload view */}
            {selectedEndpoint ? (
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-900/20">
                <div className="space-y-1 pb-2 border-b border-zinc-800/60">
                  <div className="flex items-center space-x-2">
                    {getMethodBadge(selectedEndpoint.method)}
                    <span className="font-mono text-sm font-bold text-zinc-200">{selectedEndpoint.path}</span>
                  </div>
                  <p className="text-xs text-zinc-400">{selectedEndpoint.summary}</p>
                </div>

                {selectedEndpoint.requestPayloadExample && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500">
                      <span>Request Payload Example (JSON)</span>
                      <button 
                        onClick={() => handleCopy(selectedEndpoint.requestPayloadExample || '', 'req')}
                        className="flex items-center space-x-1 text-zinc-400 hover:text-zinc-200 bg-zinc-800/80 px-2 py-0.5 rounded transition"
                      >
                        {copiedKey === 'req' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'req' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 font-mono text-xs text-amber-400 overflow-x-auto">
                      <code>{selectedEndpoint.requestPayloadExample}</code>
                    </pre>
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500">
                    <span>Response Payload Example (200 OK)</span>
                    <button 
                      onClick={() => handleCopy(selectedEndpoint.responsePayloadExample, 'res')}
                      className="flex items-center space-x-1 text-zinc-400 hover:text-zinc-200 bg-zinc-800/80 px-2 py-0.5 rounded transition"
                    >
                      {copiedKey === 'res' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'res' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 font-mono text-xs text-emerald-400 overflow-x-auto">
                    <code>{selectedEndpoint.responsePayloadExample}</code>
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs font-mono text-zinc-500">
                Select an endpoint to inspect payloads.
              </div>
            )}
          </div>
        )}

        {(!hasEndpoints || activeTab === 'architecture') && project.architecture && (
          <div className="p-4 overflow-y-auto flex-1 space-y-6 bg-zinc-900/10">
            {/* Suggested Services */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono uppercase text-indigo-400 font-semibold">
                <Layers className="w-4 h-4" />
                <span>Microservice Container Topology</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.architecture.suggestedServices.map((svc, i) => (
                  <div key={i} className="p-3 bg-zinc-900/40 border border-zinc-800/80 rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-zinc-200">{svc.name}</h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">{svc.type}</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">{svc.description}</p>
                    <div className="flex flex-wrap gap-1 pt-2">
                      {svc.tech.map((t) => (
                        <span key={t} className="text-[10px] font-mono bg-zinc-950 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-800/80">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Databases */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono uppercase text-emerald-400 font-semibold">
                <Database className="w-4 h-4" />
                <span>Persistence & Data Stores</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.architecture.databases.map((db, i) => (
                  <div key={i} className="p-3 bg-zinc-900/40 border border-zinc-800/80 rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-zinc-200">{db.name}</h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400">{db.type}</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">{db.purpose}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Auth Methods */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono uppercase text-amber-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Authentication & Authorization Matrix</span>
              </div>
              <div className="space-y-1.5 text-xs font-mono text-zinc-300">
                {project.architecture.authMethods.map((auth, i) => (
                  <div key={i} className="p-2 bg-zinc-900/30 rounded border border-zinc-800/60 flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{auth}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deployment Recommendations */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono uppercase text-blue-400 font-semibold">
                <Cloud className="w-4 h-4" />
                <span>Deployment & CI/CD Blueprint</span>
              </div>
              <div className="space-y-1.5 text-xs font-mono text-zinc-300">
                {project.architecture.deploymentRecommendations.map((dep, i) => (
                  <div key={i} className="p-2 bg-zinc-900/30 rounded border border-zinc-800/60 flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>{dep}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
