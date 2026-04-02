import React, { useState, useEffect } from 'react';
import MemoryViewer from './components/MemoryViewer';
import Settings from './components/Settings';
import DataSync from './components/DataSync';
import LibraryAnalyzer from './components/LibraryAnalyzer';
import { getSettings } from './lib/api';
import { 
  Settings as SettingsIcon, 
  Cpu, 
  Shield, 
  Book, 
  Info, 
  Globe, 
  Zap, 
  RefreshCw, 
  Microscope,
  Home
} from 'lucide-react';

type Tab = 'home' | 'analyzer' | 'sync' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('analyzer');
  const [currentMode, setCurrentMode] = useState(getSettings().mode);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setCurrentMode(getSettings().mode);
    };
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleTabChange = (tab: Tab) => {
    console.log(`${tab} Tab Clicked`);
    setActiveTab(tab);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans pb-24 md:pb-8 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="flex items-center justify-between gap-4 border-b border-zinc-900 pb-6 pt-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white tracking-tight">OneCore Engine <span className="text-[#00ff88] text-sm font-mono">v2.0</span></h1>
            <p className="text-zinc-400 text-[10px] uppercase tracking-widest">Full Offline Library Analyzer</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
              currentMode === 'local' 
                ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                : 'bg-blue-500/10 border-blue-500/20 text-blue-500'
            }`}>
              {currentMode === 'local' ? <Zap size={12} /> : <Globe size={12} />}
              {currentMode}
            </div>
            <div className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${
              isOnline ? 'bg-green-500 shadow-green-500/50' : 'bg-red-500 shadow-red-500/50'
            }`} title={isOnline ? 'Online' : 'Offline'}></div>
          </div>
        </header>

        {/* Desktop Tab Navigation (Hidden on Mobile) */}
        <div className="hidden md:flex flex-wrap gap-2 justify-center bg-zinc-900 p-2 rounded-xl border border-zinc-800">
          <button
            onClick={() => handleTabChange('home')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'home' 
                ? 'bg-[#00ff88] text-black shadow-lg shadow-[#00ff88]/20' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            <Home size={16} />
            Home
          </button>
          <button
            onClick={() => handleTabChange('analyzer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'analyzer' 
                ? 'bg-[#00ff88] text-black shadow-lg shadow-[#00ff88]/20' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            <Microscope size={16} />
            Analyzer
          </button>
          <button
            onClick={() => handleTabChange('sync')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'sync' 
                ? 'bg-[#00ff88] text-black shadow-lg shadow-[#00ff88]/20' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            <RefreshCw size={16} />
            Sync
          </button>
          <button
            onClick={() => handleTabChange('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'settings' 
                ? 'bg-[#00ff88] text-black shadow-lg shadow-[#00ff88]/20' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            <SettingsIcon size={16} />
            Settings
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6 min-h-[450px]">
          {activeTab === 'home' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-zinc-100 mb-2">
                <Home size={24} className="text-[#00ff88]" />
                <h2 className="text-2xl font-bold">Welcome to OneCore v2.0</h2>
              </div>
              <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
                <p>OneCore v2.0 is a powerful, offline-first library analyzer designed for Unreal Engine game research.</p>
                <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-4">
                  <h3 className="text-white font-bold">How to use:</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Go to the <span className="text-[#00ff88]">Library Analyzer</span> tab.</li>
                    <li>Upload your <code className="text-[#00ff88]">.so</code> files (libUE4.so, libanogs.so, etc.).</li>
                    <li>Wait for the byte-by-byte pattern scanner to complete.</li>
                    <li>Copy the generated C++ header report into your source code.</li>
                  </ol>
                </div>
                <div className="p-4 bg-[#00ff88]/5 border border-[#00ff88]/20 rounded-xl text-[#00ff88] text-xs">
                  Note: This tool runs 100% locally in your browser. No data is ever uploaded to any server.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analyzer' && <LibraryAnalyzer />}

          {activeTab === 'sync' && <DataSync />}

          {activeTab === 'settings' && <Settings />}
        </div>

        <footer className="text-center space-y-4 pt-8 hidden md:block">
          <div className="flex justify-center gap-4">
            <a href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors"><Info size={18} /></a>
          </div>
          <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
            OneCore v2.0 - Built for Research
          </p>
        </footer>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-lg border-t border-zinc-800 px-2 py-3 z-50 flex justify-around items-center shadow-2xl">
        <button
          onClick={() => handleTabChange('home')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'home' ? 'text-[#00ff88]' : 'text-zinc-500'
          }`}
        >
          <Home size={24} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
        </button>
        <button
          onClick={() => handleTabChange('analyzer')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'analyzer' ? 'text-[#00ff88]' : 'text-zinc-500'
          }`}
        >
          <Microscope size={24} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Analyzer</span>
        </button>
        <button
          onClick={() => handleTabChange('sync')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'sync' ? 'text-[#00ff88]' : 'text-zinc-500'
          }`}
        >
          <RefreshCw size={24} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Sync</span>
        </button>
        <button
          onClick={() => handleTabChange('settings')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'settings' ? 'text-[#00ff88]' : 'text-zinc-500'
          }`}
        >
          <SettingsIcon size={24} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Settings</span>
        </button>
      </nav>
    </div>
  );
}
