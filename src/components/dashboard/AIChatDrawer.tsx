import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  X, 
  Send, 
  Sparkles, 
  FileText, 
  Bot, 
  User, 
  Copy, 
  Check, 
  Maximize2,
  Minimize2
} from 'lucide-react';

export const AIChatDrawer: React.FC = () => {
  const { 
    isChatDrawerOpen, 
    toggleChatDrawer, 
    chatMessages, 
    isChatStreaming, 
    sendChatMessage, 
    uploadedFiles, 
    projects, 
    activeProjectId 
  } = useAppStore();

  const [inputMsg, setInputMsg] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatStreaming]);

  if (!isChatDrawerOpen) return null;

  const currentProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || isChatStreaming) return;
    sendChatMessage(inputMsg.trim());
    setInputMsg('');
  };

  const handlePromptClick = (prompt: string) => {
    if (isChatStreaming) return;
    sendChatMessage(prompt);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to format text with simple markdown-like code blocks and bold text
  const renderMessageText = (text: string, id: string) => {
    if (text.includes('```json')) {
      const parts = text.split('```json');
      const beforeCode = parts[0];
      const afterSplit = parts[1].split('```');
      const codePart = afterSplit[0];
      const afterCode = afterSplit[1] || '';

      return (
        <div className="space-y-3 font-sans">
          <p className="text-zinc-200 leading-relaxed text-xs">{beforeCode}</p>
          <div className="relative">
            <div className="absolute top-2 right-2 flex items-center space-x-2">
              <span className="text-[10px] font-mono text-zinc-500">JIRA JSON</span>
              <button
                onClick={() => handleCopy(codePart, id)}
                className="flex items-center space-x-1 text-zinc-300 bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded text-xs transition"
              >
                {copiedId === id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === id ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 font-mono text-xs text-amber-400 overflow-x-auto pt-8">
              <code>{codePart.trim()}</code>
            </pre>
          </div>
          <p className="text-zinc-400 text-[11px] italic">{afterCode}</p>
        </div>
      );
    }

    // Standard text formatting
    return <p className="text-zinc-200 leading-relaxed text-xs whitespace-pre-wrap font-sans">{text}</p>;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm pointer-events-auto transition-opacity"
        onClick={toggleChatDrawer} 
      />

      {/* Drawer Container */}
      <div className={`pointer-events-auto bg-zinc-950 border-l border-zinc-800 text-zinc-100 flex flex-col h-full shadow-2xl transition-all duration-300 z-10 ${
        expanded ? 'w-full max-w-4xl' : 'w-full max-w-md md:max-w-lg'
      }`}>
        {/* Drawer Header */}
        <div className="h-14 px-4 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-mono">
              <Bot className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
                NexusAI RAG Copilot
                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.2 rounded font-mono uppercase font-bold animate-pulse">
                  Active RAG
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono truncate">
                Context: {currentProject.name} ({uploadedFiles.length} Docs)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setExpanded(!expanded)}
              title={expanded ? 'Default view' : 'Expand width'}
              className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition"
            >
              {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleChatDrawer}
              title="Close Copilot"
              className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* System Active Grounding Status Bar */}
        <div className="px-4 py-2 bg-zinc-900/40 border-b border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-400 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
            <span className="text-zinc-300">Vector Knowledge Base Synced</span>
          </div>
          <span className="text-zinc-500">Llama 3.3 70B</span>
        </div>

        {/* Chat History Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-zinc-950">
          {chatMessages.map((msg) => {
            const isAssistant = msg.sender === 'assistant';
            return (
              <div 
                key={msg.id} 
                className={`flex space-x-3 ${isAssistant ? 'items-start' : 'items-start flex-row-reverse space-x-reverse'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border text-xs font-bold ${
                  isAssistant 
                    ? 'bg-zinc-900 border-zinc-700 text-indigo-400 shadow-sm' 
                    : 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                }`}>
                  {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className={`max-w-[85%] rounded-xl p-4 space-y-3 ${
                  isAssistant 
                    ? 'bg-zinc-900/60 border border-zinc-800/80 text-zinc-200 shadow-sm' 
                    : 'bg-indigo-600/20 border border-indigo-500/30 text-zinc-100 ml-auto'
                }`}>
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pb-1 border-b border-zinc-800/50">
                    <span className="font-bold text-zinc-400">{isAssistant ? 'NexusAI System' : 'Architect'}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Message content */}
                  {renderMessageText(msg.text, msg.id)}

                  {/* Citations Grounding Box */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-2 border-t border-zinc-800/60 space-y-1.5">
                      <div className="flex items-center space-x-1.5 text-[10px] font-mono text-emerald-400 font-bold uppercase">
                        <FileText className="w-3 h-3" />
                        <span>Vector Grounding References</span>
                      </div>
                      {msg.citations.map((cite, i) => (
                        <div key={i} className="p-2 bg-zinc-950 rounded border border-zinc-800 text-[11px] font-mono text-zinc-300">
                          <span className="text-zinc-500 font-bold">{cite.docName}:</span> "{cite.quote}"
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggested Prompts Pills */}
                  {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && !isChatStreaming && (
                    <div className="pt-3 space-y-1.5">
                      <p className="text-[10px] font-mono uppercase text-zinc-500">Suggested Prompts</p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedPrompts.map((prompt, i) => (
                          <button
                            key={i}
                            onClick={() => handlePromptClick(prompt)}
                            className="px-2.5 py-1 rounded bg-zinc-800/80 hover:bg-indigo-600 border border-zinc-700 text-[11px] font-mono text-zinc-300 hover:text-white transition text-left cursor-pointer shadow-sm"
                          >
                            &rarr; {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Footer */}
        <form onSubmit={handleSend} className="p-4 bg-zinc-900/80 border-t border-zinc-800 shrink-0 space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              disabled={isChatStreaming}
              placeholder={isChatStreaming ? "AI is typing..." : "Ask questions about uploaded documents, e.g. 'Generate Jira tickets'..."}
              className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-lg px-4 py-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition shadow-inner font-sans"
            />
            <button
              type="submit"
              disabled={!inputMsg.trim() || isChatStreaming}
              className={`p-3 rounded-lg flex items-center justify-center transition shadow-md shrink-0 cursor-pointer ${
                !inputMsg.trim() || isChatStreaming
                  ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 px-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Multi-Document RAG Search & Citations Enabled
            </span>
            <span>Return to submit</span>
          </div>
        </form>
      </div>
    </div>
  );
};
