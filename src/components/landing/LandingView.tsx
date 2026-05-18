import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  FileText, 
  UploadCloud, 
  Cpu, 
  GitPullRequest, 
  Boxes
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const LandingView: React.FC = () => {
  const { setActiveView, resetIngestion } = useAppStore();
  const [activeTab, setActiveTab] = useState<'architecture' | 'requirements' | 'timeline'>('architecture');

  const handleStartParsing = () => {
    resetIngestion();
    setActiveView('dashboard');
    setTimeout(() => {
      const modal = document.getElementById('ingestion-modal');
      if (modal) (modal as HTMLDialogElement).showModal();
    }, 150);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col justify-between overflow-x-hidden">
      {/* Top minimal nav */}
      <nav className="max-w-7xl w-full mx-auto px-6 h-20 flex items-center justify-between border-b border-zinc-900/80 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center shadow-lg">
            <span className="font-mono text-sm font-black tracking-tighter text-white">N</span>
          </div>
          <span className="font-bold text-lg tracking-tight flex items-center gap-2">
            NexusAI
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-mono uppercase tracking-widest font-normal">
              Platform v4.2
            </span>
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-zinc-200 transition">Intelligence Core</a>
          <a href="#preview" className="hover:text-zinc-200 transition">Live Preview</a>
          <a href="#compliance" className="hover:text-zinc-200 transition">Security & RAG</a>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveView('dashboard')}
            className="text-xs font-semibold text-zinc-300 hover:text-white px-3 py-2 transition"
          >
            Sign In
          </button>
          <button
            onClick={handleStartParsing}
            className="flex items-center space-x-2 text-xs font-semibold bg-zinc-100 hover:bg-white text-zinc-950 px-4 py-2.5 rounded-md transition shadow-md hover:shadow-zinc-800/50 cursor-pointer"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Main Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-16 pb-20 relative z-10 max-w-5xl mx-auto">
        <div className="absolute inset-0 -z-10 pointer-events-none flex items-center justify-center overflow-hidden opacity-30">
          <div className="w-[600px] h-[600px] bg-gradient-to-tr from-indigo-900/30 via-zinc-900/10 to-purple-900/20 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* AI Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 mb-8 shadow-inner font-mono tracking-wide"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Enterprise Project Intelligence Engine</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </motion.div>

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-100 max-w-4xl leading-[1.1] mb-6"
        >
          Convert chaotic client documents into structured <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500 underline decoration-indigo-500/40 decoration-wavy">execution plans.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed mb-10"
        >
          Upload messy RFPs, security questionnaires, and architecture diagrams. Our multi-modal AI extracts requirements, computes timeline risks, and synthesizes microservice blueprints instantly.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto mb-16"
        >
          <button
            onClick={handleStartParsing}
            className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-lg font-semibold text-sm shadow-xl hover:shadow-indigo-500/25 transition cursor-pointer group"
          >
            <UploadCloud className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            <span>Start Parsing Project</span>
          </button>
          <button
            onClick={() => setActiveView('dashboard')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 px-6 py-4 rounded-lg font-semibold text-sm transition cursor-pointer"
          >
            <span>Explore Live Demo</span>
          </button>
        </motion.div>

        {/* Animated Dashboard Preview Showcase */}
        <motion.div 
          id="preview"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-5xl rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden text-left"
        >
          {/* Mock Window Header */}
          <div className="h-10 bg-zinc-900/90 px-4 flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center space-x-2 font-mono text-[11px] text-zinc-400">
              <div className="flex space-x-1.5 mr-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-zinc-500">nexus-ai-workspace // project-blueprint-live</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                SYSTEM PARSING: COMPLETE
              </span>
            </div>
          </div>

          {/* Interactive Preview Content */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-950/80">
            {/* Left Nav in preview */}
            <div className="space-y-4">
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4 space-y-3">
                <div className="text-xs font-semibold text-zinc-300 font-mono flex items-center justify-between">
                  <span>PROJECT INGESTION</span>
                  <span className="text-indigo-400">4 FILES</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs text-zinc-400 bg-zinc-950 p-2 rounded border border-zinc-800/80 font-mono">
                    <FileText className="w-3.5 h-3.5 text-rose-400" />
                    <span className="truncate">Aegis_Architecture_RFP_v4.pdf</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-zinc-400 bg-zinc-950 p-2 rounded border border-zinc-800/80 font-mono">
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    <span className="truncate">Security_Compliance_Addendum.docx</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-zinc-400 bg-zinc-950 p-2 rounded border border-zinc-800/80 font-mono">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span className="truncate">Database_Schema_Dump.json</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-950/30 to-zinc-900/60 border border-indigo-900/50 rounded-lg p-4">
                <p className="text-xs font-bold text-indigo-300 uppercase font-mono mb-2">AI Execution Summary</p>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  "Migration from legacy mainframe to distributed event-driven microservice architecture. Identified 14 core dependencies and 2 critical SLA risks."
                </p>
                <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">Complexity</span>
                  <span className="text-emerald-400 font-bold">89 / 100 (High)</span>
                </div>
              </div>
            </div>

            {/* Right 2 cols: Dynamic Tabs */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center space-x-2 border-b border-zinc-800 pb-2 font-mono text-xs">
                <button
                  onClick={() => setActiveTab('architecture')}
                  className={`px-3 py-1.5 rounded transition ${activeTab === 'architecture' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Architecture Spec
                </button>
                <button
                  onClick={() => setActiveTab('requirements')}
                  className={`px-3 py-1.5 rounded transition ${activeTab === 'requirements' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Requirements Tree
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`px-3 py-1.5 rounded transition ${activeTab === 'timeline' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Milestone Gantt
                </button>
              </div>

              {activeTab === 'architecture' && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-1 bg-amber-500/20 text-amber-400 font-mono text-[10px] font-bold rounded">POST</span>
                      <span className="text-xs font-mono text-zinc-200">/v1/ledger/transactions</span>
                    </div>
                    <span className="text-xs text-zinc-500">mTLS Required</span>
                  </div>
                  <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold rounded">GET</span>
                      <span className="text-xs font-mono text-zinc-200">/v1/accounts/balance</span>
                    </div>
                    <span className="text-xs text-zinc-500">24ms Latency</span>
                  </div>
                  <div className="p-4 bg-zinc-900/80 rounded-lg border border-zinc-800 font-mono text-xs text-zinc-400 space-y-1">
                    <p className="text-zinc-200 font-semibold mb-2">// Recommended System Topology</p>
                    <p>• Ledger Engine Core (Go + Temporal.io)</p>
                    <p>• Security Proxy Gateway (Envoy mTLS 1.3)</p>
                    <p>• Data Pipeline (Apache Kafka + Debezium CDC)</p>
                  </div>
                </div>
              )}

              {activeTab === 'requirements' && (
                <div className="space-y-2 animate-fadeIn">
                  <div className="p-3 bg-zinc-900/70 border border-zinc-800 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 font-mono font-bold text-[10px] rounded">P0</span>
                      <span className="text-xs text-zinc-200 font-semibold">Dual-Entry Immutable Ledger Engine</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded font-mono">Verified</span>
                  </div>
                  <div className="p-3 bg-zinc-900/70 border border-zinc-800 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 font-mono font-bold text-[10px] rounded">P0</span>
                      <span className="text-xs text-zinc-200 font-semibold">99.999% Active-Active Failover SLA</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded font-mono">In Progress</span>
                  </div>
                  <div className="p-3 bg-zinc-900/70 border border-zinc-800 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 font-mono font-bold text-[10px] rounded">P1</span>
                      <span className="text-xs text-zinc-200 font-semibold">SWIFT & FedNow Instant Webhook Adapter</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded font-mono">Pending AI Review</span>
                  </div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-200">Phase 1: Ingestion & Kafka Mesh</span>
                      <span className="text-emerald-400">Weeks 1-6</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-full" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-200">Phase 2: Mainframe CDC & Postgres Ledger</span>
                      <span className="text-indigo-400">Weeks 7-16 (In Progress)</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full w-[45%]" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-500">Phase 3: Client Portal & SOC2 Compliance</span>
                      <span className="text-zinc-500">Weeks 17-24 (Queued)</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                      <div className="bg-zinc-800 h-full w-0" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Feature Grid Section */}
      <section id="features" className="py-20 border-t border-zinc-900 bg-zinc-950/60 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-100 mb-4 font-sans">
              Designed for Enterprise Architectures
            </h2>
            <p className="text-zinc-400 text-sm">
              We replace endless manual discovery meetings with deterministic AI extraction and verifiable requirement traceability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-zinc-900/40 border border-zinc-800/80 rounded-xl space-y-4 hover:border-zinc-700 transition">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-zinc-100 tracking-tight">Multi-Modal Ingestion Engine</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Parses unstructured PDFs, Word documents, Markdown specs, and JSON database dumps into unified vector knowledge graphs.
              </p>
            </div>

            <div className="p-6 bg-zinc-900/40 border border-zinc-800/80 rounded-xl space-y-4 hover:border-zinc-700 transition">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                <GitPullRequest className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-zinc-100 tracking-tight">Requirement Traceability</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Every generated requirement links directly to the exact source document, paragraph, and confidence score for absolute auditability.
              </p>
            </div>

            <div className="p-6 bg-zinc-900/40 border border-zinc-800/80 rounded-xl space-y-4 hover:border-zinc-700 transition">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                <Boxes className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-zinc-100 tracking-tight">API & Architecture Synthesizer</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Automatically drafts REST/GraphQL schemas, microservice container boundaries, and database models optimized for AWS/Kubernetes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12 text-xs text-zinc-500 px-6 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span>© 2026 NexusAI Enterprise Corp. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span>SOC2 Type II Certified</span>
            </span>
            <a href="#" className="hover:text-zinc-300">Privacy Shield</a>
            <a href="#" className="hover:text-zinc-300">API Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
