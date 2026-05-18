import React, { useRef, useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  X,
  FileCode,
  FileSpreadsheet
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const ProjectIngestionModal: React.FC = () => {
  const { 
    uploadedFiles, 
    addUploadedFiles, 
    removeUploadedFile, 
    startParsing, 
    isParsing, 
    parsingProgress, 
    parsingStepText,
    parsingError
  } = useAppStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    addUploadedFiles(fileArray);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type === 'json') return <FileCode className="w-5 h-5 text-amber-400" />;
    if (type === 'pdf') return <FileText className="w-5 h-5 text-rose-400" />;
    if (type === 'docx') return <FileSpreadsheet className="w-5 h-5 text-blue-400" />;
    return <FileText className="w-5 h-5 text-emerald-400" />;
  };

  const closeModal = () => {
    const modal = document.getElementById('ingestion-modal') as HTMLDialogElement;
    if (modal) modal.close();
  };

  const handleGenerate = async () => {
    await startParsing();
    setTimeout(() => {
      closeModal();
    }, 500);
  };

  return (
    <dialog id="ingestion-modal" className="modal backdrop:bg-zinc-950/80 backdrop:backdrop-blur-sm bg-transparent w-full max-w-2xl m-auto p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden text-zinc-100 font-sans w-full flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-900/60 border-b border-zinc-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Project Ingestion Vault</h3>
              <p className="text-[11px] text-zinc-400 font-mono">FastAPI Multi-Modal Pipeline (.pdf, .docx, .md, .json)</p>
            </div>
          </div>
          <button 
            onClick={closeModal} 
            disabled={isParsing}
            className="text-zinc-500 hover:text-zinc-300 p-1.5 rounded-lg hover:bg-zinc-800/80 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Drag & Drop Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition cursor-pointer flex flex-col items-center justify-center ${
              dragOver 
                ? 'border-indigo-500 bg-indigo-500/5' 
                : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/20 hover:bg-zinc-900/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.txt,.md,.json"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-3 shadow-inner">
              <UploadCloud className={`w-6 h-6 ${dragOver ? 'text-indigo-400 scale-110' : ''} transition-all`} />
            </div>
            <p className="text-xs font-semibold text-zinc-200 mb-1">
              Click to browse or drag documents here
            </p>
            <p className="text-[11px] text-zinc-500 max-w-xs font-mono">
              Supported formats: PDF, DOCX, TXT, MD, JSON up to 100MB per file.
            </p>
          </div>

          {/* Uploaded Files Queue */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
                <span>UPLOADED QUEUE ({uploadedFiles.length})</span>
                <span>TOTAL SIZE: {formatBytes(uploadedFiles.reduce((acc, f) => acc + f.size, 0))}</span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-lg flex items-center justify-between hover:border-zinc-700 transition group"
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      {getFileIcon(file.type)}
                      <div className="overflow-hidden">
                        <p className="text-xs font-medium text-zinc-200 truncate">{file.name}</p>
                        <div className="flex items-center space-x-2 text-[10px] text-zinc-500 font-mono">
                          <span>{formatBytes(file.size)}</span>
                          <span>•</span>
                          <span>{file.extractedTokens ? `${file.extractedTokens.toLocaleString()} tokens` : 'Extracting tokens...'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0 ml-4">
                      {file.status === 'completed' ? (
                        <span className="flex items-center space-x-1 text-emerald-400 font-mono text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Indexed</span>
                        </span>
                      ) : file.status === 'error' ? (
                        <span className="flex items-center space-x-1 text-rose-400 font-mono text-[11px]">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Failed</span>
                        </span>
                      ) : (
                        <div className="w-24 bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                          <div 
                            className="bg-indigo-500 h-full transition-all duration-300 animate-pulse" 
                            style={{ width: `${file.uploadProgress}%` }} 
                          />
                        </div>
                      )}

                      <button
                        onClick={() => removeUploadedFile(file.id)}
                        disabled={isParsing}
                        className="text-zinc-500 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Parsing Progress Section */}
          {isParsing && (
            <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center space-x-2 text-indigo-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>AI PARSING PIPELINE ACTIVE</span>
                </span>
                <span className="text-zinc-400">{parsingProgress}%</span>
              </div>

              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
                <div 
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${parsingProgress}%` }}
                />
              </div>

              <p className="text-xs text-zinc-400 font-mono animate-pulse flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block animate-ping" />
                <span>{parsingStepText}</span>
              </p>
            </div>
          )}

          {/* Error Message Section */}
          {parsingError && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-rose-400 font-semibold text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 animate-bounce" />
                <span>Ingestion Pipeline Failed</span>
              </div>
              <p className="text-xs text-zinc-300 font-mono leading-relaxed bg-zinc-950/60 p-2.5 rounded border border-zinc-900 overflow-x-auto">
                {parsingError}
              </p>
              <div className="text-[10px] text-zinc-500 leading-normal">
                Please verify that the FastAPI backend server is active at <code className="text-indigo-400">http://127.0.0.1:8000</code> and the Gemini API key is configured.
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-zinc-900/60 border-t border-zinc-800/80 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-zinc-500 font-mono">
            {uploadedFiles.length} files selected for ingestion
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={closeModal}
              disabled={isParsing}
              className="px-4 py-2 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={uploadedFiles.length === 0 || isParsing}
              className={`px-6 py-2 rounded-md font-semibold text-xs transition flex items-center space-x-2 shadow-lg cursor-pointer ${
                uploadedFiles.length === 0 || isParsing
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate AI Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};
