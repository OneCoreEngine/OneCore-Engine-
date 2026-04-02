import React, { useState, useEffect } from 'react';
import { getLocalSyncData, syncDataFromGithub, SyncData } from '../lib/sync';
import { RefreshCw, CheckCircle, Clock, Database, AlertCircle, RotateCcw } from 'lucide-react';

export default function DataSync() {
  const [syncData, setSyncData] = useState<SyncData | null>(getLocalSyncData());
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    console.log('Sync Data button clicked');
    setIsSyncing(true);
    setError(null);
    try {
      const result = await syncDataFromGithub();
      setSyncData(result);
      console.log('Sync Successful:', result);
    } catch (err) {
      console.error('Sync Failed:', err);
      setError('Failed to sync. Please check your internet connection.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center gap-3 text-zinc-100">
        <Database size={24} className="text-blue-400" />
        <h2 className="text-2xl font-bold">Data Update</h2>
      </div>

      <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-zinc-400 text-sm leading-relaxed">
            Download the latest Unreal Engine structure patterns and signatures directly from GitHub.
          </p>
        </div>

        {/* Big Sync Button */}
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className={`w-full py-6 rounded-2xl font-bold text-lg flex flex-col items-center justify-center gap-3 transition-all active:scale-95 ${
            isSyncing 
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/30'
          }`}
        >
          <RefreshCw size={32} className={isSyncing ? 'animate-spin' : ''} />
          <span>{isSyncing ? 'Downloading...' : 'Sync Data Now'}</span>
        </button>

        {/* Last Sync Info */}
        {syncData && (
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-zinc-500">
              <span className="flex items-center gap-1"><Clock size={12} /> Last Sync</span>
              <span className="text-blue-400">{syncData.lastSync}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-zinc-500">
              <span className="flex items-center gap-1"><CheckCircle size={12} /> Version</span>
              <span className="text-green-400">{syncData.version}</span>
            </div>
            
            <div className="pt-2 border-t border-zinc-900">
              <h4 className="text-[10px] font-bold text-zinc-600 uppercase mb-2">Available Signatures</h4>
              <div className="flex flex-wrap gap-2">
                {syncData.signatures.map((sig, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-[10px] text-blue-400 font-mono">
                    {sig.substring(0, 15)}...
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="space-y-4">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle size={20} />
              {error}
            </div>
            <button
              onClick={handleSync}
              className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
            >
              <RotateCcw size={18} />
              Retry Sync
            </button>
          </div>
        )}
      </div>

      <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/50">
        <h4 className="text-xs font-bold text-zinc-500 uppercase mb-2">Data Source</h4>
        <p className="text-[10px] text-zinc-600 leading-relaxed">
          This data is pulled from the public OneCore-Engine/data repository. It contains non-sensitive research patterns for educational UE4 analysis.
        </p>
      </div>
    </div>
  );
}
