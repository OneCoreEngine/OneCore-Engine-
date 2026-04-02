import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Upload, 
  X, 
  FileCode, 
  Cpu, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  Download, 
  Terminal,
  ShieldCheck,
  Loader2,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Hash,
  Type,
  Trash2
} from 'lucide-react';

import FileUploader from './FileUploader';
import { identifyBypassCandidates, BypassCandidate } from '../lib/bypassDetector';

interface ScanResult {
  fileName: string;
  fileSize: number;
  matches: {
    name: string;
    rva: string;
    found: boolean;
    category: string;
    isString?: boolean;
    isClosestMatch?: boolean;
    type?: 'PATCH' | 'HOOK' | 'NORMAL';
  }[];
}

type Category = 'core' | 'function' | 'actor' | 'anticheat' | 'security' | 'strings';

export default function LibraryAnalyzer() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<Category[]>(['core', 'function', 'actor', 'anticheat', 'security', 'strings']);
  const [expandedResults, setExpandedResults] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Cleanup worker on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(f => f.size <= 500 * 1024 * 1024);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleCategory = (cat: Category) => {
    setActiveCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleResult = (index: number) => {
    setExpandedResults(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const startScan = async () => {
    if (files.length === 0) return;
    
    setIsScanning(true);
    setError(null);
    setProgress(0);
    const newResults: ScanResult[] = [];

    try {
      for (const file of files) {
        // Initialize Web Worker
        const worker = new Worker(new URL('../lib/scanner.worker.ts', import.meta.url), { type: 'module' });
        workerRef.current = worker;

        const resultPromise = new Promise<any[]>((resolve, reject) => {
          worker.onmessage = (e) => {
            if (e.data.type === 'progress') {
              setProgress(e.data.progress);
            } else if (e.data.type === 'result') {
              resolve(e.data.matches);
            } else if (e.data.type === 'error') {
              reject(new Error(e.data.message));
            }
          };
          worker.onerror = (err) => reject(err);
        });

        // Pass the file object directly to the worker
        // The worker will read it in chunks or as a whole
        // For 400MB support, we should ideally read it in chunks in the worker
        worker.postMessage({ file, fileName: file.name });

        const matches = await resultPromise;
        const bypassCandidates = identifyBypassCandidates(matches);
        
        // Merge bypass info into matches
        const enrichedMatches = matches.map(m => {
          const candidate = bypassCandidates.find(c => c.name === m.name);
          return {
            ...m,
            type: candidate?.type || 'NORMAL'
          };
        });

        newResults.push({
          fileName: file.name,
          fileSize: file.size,
          matches: enrichedMatches
        });
        
        worker.terminate();
        workerRef.current = null;
      }
      setResults(newResults);
      setExpandedResults(newResults.map((_, i) => i));
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Analysis cancelled by user');
      } else {
        console.error('Scan failed:', err);
        setError(`Analysis failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    } finally {
      setIsScanning(false);
      setProgress(0);
    }
  };

  const stopScan = () => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
      setIsScanning(false);
      setProgress(0);
      setError('Analysis cancelled');
    }
  };

  const filteredResults = useMemo(() => {
    return results.map(res => ({
      ...res,
      matches: res.matches.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             m.rva.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             m.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategories.includes(m.category as Category);
        return matchesSearch && matchesCategory;
      })
    }));
  }, [results, searchQuery, activeCategories]);

  const totalMatchesFound = useMemo(() => {
    return filteredResults.reduce((acc, res) => acc + res.matches.length, 0);
  }, [filteredResults]);

  const generateReport = (res: ScanResult) => {
    let report = `// OneCore v2.0 - BGMI OFFSETS REPORT\n`;
    report += `// Generated: ${new Date().toLocaleString()}\n\n`;

    // ===== BYPASS OFFSETS (NOP THESE) =====
    const patchMatches = res.matches.filter(m => m.type === 'PATCH' && m.found);
    if (patchMatches.length > 0) {
      report += `// ===== BYPASS OFFSETS (NOP THESE) =====\n`;
      patchMatches.forEach(m => {
        report += `${m.rva}  // ${m.name}\n`;
      });
      report += `\n`;
    }

    // ===== HOOK OFFSETS =====
    const hookMatches = res.matches.filter(m => m.type === 'HOOK' && m.found);
    if (hookMatches.length > 0) {
      report += `// ===== HOOK OFFSETS =====\n`;
      hookMatches.forEach(m => {
        report += `${m.rva} // ${m.name}\n`;
      });
      report += `\n`;
    }

    // ===== NORMAL OFFSETS =====
    report += `// ===== NORMAL OFFSETS =====\n`;
    const categories: Category[] = ['core', 'function', 'actor', 'anticheat', 'security', 'strings'];
    categories.forEach(cat => {
      const catMatches = res.matches.filter(m => m.category === cat && m.found && m.type === 'NORMAL');
      if (catMatches.length > 0) {
        catMatches.forEach(m => {
          report += `${m.name} = ${m.rva}\n`;
        });
      }
    });

    return report;
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() 
            ? <span key={i} className="bg-[#00ff88]/30 text-[#00ff88] rounded px-0.5">{part}</span> 
            : part
        )}
      </span>
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Report copied to clipboard!');
  };

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center gap-3 text-zinc-100">
        <Cpu size={28} className="text-[#00ff88]" />
        <h2 className="text-2xl font-bold tracking-tight">Library Analyzer <span className="text-xs bg-[#00ff88]/20 text-[#00ff88] px-2 py-0.5 rounded-full ml-2">v2.0 PRO</span></h2>
      </div>

      {/* Control Panel */}
      <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 space-y-6">
        <div className="space-y-2">
          <p className="text-zinc-400 text-sm leading-relaxed">
            Upload large <code className="text-[#00ff88]">.so</code> libraries (up to 500MB) for deep analysis.
          </p>
        </div>

        {/* Upload Area */}
        <FileUploader files={files} onFilesChange={setFiles} />

        {/* Action Button */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={startScan}
              disabled={isScanning || files.length === 0}
              className={`flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
                isScanning || files.length === 0
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                  : 'bg-[#00ff88] hover:bg-[#00ff88]/90 text-black shadow-xl shadow-[#00ff88]/20'
              }`}
            >
              {isScanning ? <Loader2 className="animate-spin" size={24} /> : <Terminal size={24} />}
              <span>{isScanning ? `Analyzing (${progress}%)...` : 'Start Deep Scan'}</span>
            </button>
            {isScanning && (
              <button
                onClick={stopScan}
                className="px-6 py-4 rounded-xl font-bold text-lg bg-red-500/20 text-red-500 border border-red-500/30 hover:bg-red-500/30 transition-all active:scale-95"
              >
                Cancel
              </button>
            )}
          </div>

          {isScanning && (
            <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
              <div 
                className="bg-[#00ff88] h-full transition-all duration-300 shadow-[0_0_10px_#00ff88]"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={20} />
            {error}
          </div>
        )}
      </div>

      {/* Results Filters & Search */}
      {results.length > 0 && (
        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="text"
                placeholder="Search offsets, names, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-10 text-sm focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88] outline-none transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {(['core', 'function', 'actor', 'anticheat', 'security', 'strings'] as Category[]).map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${
                    activeCategories.includes(cat)
                      ? 'bg-[#00ff88]/10 border-[#00ff88]/30 text-[#00ff88]'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
            <span>Found <span className="text-[#00ff88]">{totalMatchesFound}</span> results</span>
            {searchQuery && <span>Filtering for: "{searchQuery}"</span>}
          </div>
        </div>
      )}

      {/* Results Section */}
      {filteredResults.length > 0 && (
        <div className="space-y-6">
          {filteredResults.map((result, i) => (
            <div key={i} className="bg-zinc-900/80 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
              <div 
                onClick={() => toggleResult(i)}
                className="bg-zinc-800/50 px-6 py-4 flex items-center justify-between border-b border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileCode size={20} className="text-[#00ff88]" />
                  <div className="flex flex-col">
                    <span className="font-bold text-zinc-100">{result.fileName}</span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                      {result.matches.filter(m => m.found).length} Offsets Found • {(result.fileSize / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(generateReport(result));
                    }}
                    className="p-2 text-zinc-400 hover:text-[#00ff88] transition-colors"
                    title="Copy Report"
                  >
                    <Copy size={18} />
                  </button>
                  {expandedResults.includes(i) ? <ChevronUp size={20} className="text-zinc-500" /> : <ChevronDown size={20} className="text-zinc-500" />}
                </div>
              </div>
              
              {expandedResults.includes(i) && (
                <div className="p-6 space-y-6">
                  {/* Matches List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.matches.map((match, mi) => (
                      <div key={mi} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center justify-between group hover:border-[#00ff88]/30 transition-all">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${match.isString ? 'bg-purple-500/10 text-purple-400' : 'bg-[#00ff88]/10 text-[#00ff88]'}`}>
                            {match.isString ? <Type size={14} /> : <Hash size={14} />}
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                              {highlightText(match.name, searchQuery)}
                              {match.isClosestMatch && <span className="text-[8px] bg-yellow-500/20 text-yellow-500 px-1 rounded">CLOSEST</span>}
                              {match.type === 'PATCH' && <span className="text-[8px] bg-red-500/20 text-red-500 px-1 rounded font-bold">PATCH</span>}
                              {match.type === 'HOOK' && <span className="text-[8px] bg-blue-500/20 text-blue-500 px-1 rounded font-bold">HOOK</span>}
                            </span>
                            <span className={`text-sm font-mono ${match.found ? 'text-[#00ff88]' : 'text-red-500'}`}>
                              {highlightText(match.rva, searchQuery)}
                            </span>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded text-[8px] font-bold uppercase ${
                          match.category === 'anticheat' || match.category === 'security' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {highlightText(match.category, searchQuery)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Code Preview */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">C++ Header Preview</h4>
                      <button 
                        onClick={() => {
                          const blob = new Blob([generateReport(result)], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${result.fileName.replace('.so', '')}_offsets.h`;
                          a.click();
                        }}
                        className="text-[10px] font-bold text-[#00ff88] hover:underline flex items-center gap-1"
                      >
                        <Download size={12} /> DOWNLOAD .H
                      </button>
                    </div>
                    <pre className="bg-black p-6 rounded-2xl border border-zinc-800 text-[10px] md:text-xs font-mono text-zinc-400 overflow-x-auto leading-relaxed max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
                      {generateReport(result)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/50">
        <h4 className="text-xs font-bold text-zinc-500 uppercase mb-2">Security Notice</h4>
        <p className="text-[10px] text-zinc-600 leading-relaxed">
          OneCore v2.0 PRO uses Web Workers for background processing. Analysis is performed entirely within your browser's memory sandbox. No library data is ever uploaded to any server.
        </p>
      </div>
    </div>
  );
}
