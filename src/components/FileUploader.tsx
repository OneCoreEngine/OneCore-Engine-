import React, { useState, useRef } from 'react';
import { Upload, X, FileCode, Trash2 } from 'lucide-react';

interface FileUploaderProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxSizeMB?: number;
}

export default function FileUploader({ files, onFilesChange, maxSizeMB = 500 }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(f => f.size <= maxSizeMB * 1024 * 1024);
      onFilesChange([...files, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).filter(f => f.size <= maxSizeMB * 1024 * 1024);
      onFilesChange([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group ${
          isDragging 
            ? 'border-[#00ff88] bg-[#00ff88]/10 scale-[1.02]' 
            : 'border-zinc-800 hover:border-[#00ff88]/50 hover:bg-[#00ff88]/5'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          multiple 
          accept=".so" 
          className="hidden" 
        />
        <div className={`w-16 h-16 rounded-full bg-zinc-950 flex items-center justify-center group-hover:scale-110 transition-transform ${
          isDragging ? 'scale-110' : ''
        }`}>
          <Upload size={32} className={`transition-colors ${isDragging ? 'text-[#00ff88]' : 'text-zinc-500 group-hover:text-[#00ff88]'}`} />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-zinc-300">
            {isDragging ? 'Drop files here' : 'Click or Drag & Drop .so files'}
          </p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Max {maxSizeMB}MB per file</p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Selected Files ({files.length})</h4>
            <button onClick={() => onFilesChange([])} className="text-[10px] text-red-400 hover:underline flex items-center gap-1">
              <Trash2 size={12} /> Clear All
            </button>
          </div>
          <div className="grid gap-2">
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-3">
                  <FileCode size={20} className="text-[#00ff88]" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-200 truncate max-w-[200px]">{file.name}</span>
                    <span className="text-[10px] text-zinc-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(i);
                  }} 
                  className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
