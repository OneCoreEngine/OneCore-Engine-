import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings, AppSettings, ProcessingMode } from '../lib/api';
import { clearCache } from '../lib/sync';
import { Settings as SettingsIcon, Save, Info, ExternalLink, Trash2 } from 'lucide-react';

export default function Settings() {
  const [settings, setLocalSettings] = useState<AppSettings>(getSettings());
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    saveSettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    // Reload to update header badge
    window.dispatchEvent(new Event('settingsUpdated'));
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data and settings?')) {
      clearCache();
    }
  };

  const updateMode = (mode: ProcessingMode) => {
    setLocalSettings(prev => ({ ...prev, mode }));
  };

  const updateCloudUrl = (cloudUrl: string) => {
    setLocalSettings(prev => ({ ...prev, cloudUrl }));
  };

  const updateApiKey = (apiKey: string) => {
    setLocalSettings(prev => ({ ...prev, apiKey }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-zinc-100">
        <SettingsIcon size={20} className="text-blue-400" />
        <h2 className="text-xl font-bold">Processing Settings</h2>
      </div>

      <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 space-y-6">
        {/* Mode Selector */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-zinc-300">Processing Mode</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => updateMode('local')}
              className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                settings.mode === 'local'
                  ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
              }`}
            >
              <span className="font-bold">Local Mode</span>
              <span className="text-[10px] text-center">Termux Localhost (8080)</span>
            </button>
            <button
              onClick={() => updateMode('cloud')}
              className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                settings.mode === 'cloud'
                  ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
              }`}
            >
              <span className="font-bold">Cloud Mode</span>
              <span className="text-[10px] text-center">Custom Server URL</span>
            </button>
          </div>
        </div>

        {/* Cloud Config */}
        <div className={`space-y-4 transition-opacity ${settings.mode === 'local' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Cloud Server URL</label>
            <input
              type="text"
              value={settings.cloudUrl}
              onChange={(e) => updateCloudUrl(e.target.value)}
              placeholder="https://your-server.com:8080"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">API Key (Optional)</label>
            <input
              type="password"
              value={settings.apiKey}
              onChange={(e) => updateApiKey(e.target.value)}
              placeholder="Your API Key"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
            isSaved ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
          }`}
        >
          {isSaved ? <><Save size={18} /> Settings Saved!</> : <><Save size={18} /> Save Configuration</>}
        </button>

        {/* Clear Data Button */}
        <button
          onClick={handleClearData}
          className="w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 bg-zinc-800 hover:bg-red-900/20 hover:text-red-400 text-zinc-400 transition-all border border-zinc-700"
        >
          <Trash2 size={18} />
          Clear All Data
        </button>
      </div>

      {/* Documentation Link */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-blue-400">
          <Info size={18} />
          <h4 className="text-sm font-semibold">Setup Instructions</h4>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          {settings.mode === 'local' 
            ? "Local Mode requires a Termux server running on your Android device at http://localhost:8080. Make sure to enable 'Localhost Access' in your Termux settings."
            : "Cloud Mode allows you to use a self-hosted server. Ensure your server is accessible via HTTPS if you are using GitHub Pages (which is HTTPS)."}
        </p>
        <a 
          href="https://github.com/OneCore-Engine/docs" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-blue-400 hover:underline"
        >
          View Setup Guide <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
