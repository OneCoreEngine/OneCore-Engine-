import React, { useState } from 'react';
import { performAnalysis } from '../lib/api';
import { Search, Loader2, AlertCircle } from 'lucide-react';

export default function MemoryViewer() {
  const [value, setValue] = useState(100);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleIncrease = () => {
    console.log('Increase button clicked');
    setValue(prev => prev + 10);
  };

  const handleDecrease = () => {
    console.log('Decrease button clicked');
    setValue(prev => prev - 10);
  };

  const handleScan = async () => {
    console.log('Scan Process button clicked');
    setIsScanning(true);
    setError(null);
    try {
      const result = await performAnalysis('1234');
      console.log('Scan Result:', result);
      alert(`Scan Successful! Found ${result.count || 0} offsets.`);
    } catch (err) {
      console.error('Scan Failed:', err);
      setError('Connection failed. Please check your Local/Cloud settings.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 shadow-xl max-w-sm mx-auto">
        <h3 className="text-xl font-bold text-white mb-4 text-center">Memory Simulator</h3>
        <div className="flex flex-col items-center gap-6">
          <div className="text-4xl font-mono text-blue-400 bg-black px-6 py-3 rounded-lg border border-blue-500/30">
            {value}
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleDecrease}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold rounded-lg transition-all shadow-lg shadow-red-900/20"
            >
              -10
            </button>
            <button
              onClick={handleIncrease}
              className="px-6 py-3 bg-green-600 hover:bg-green-500 active:scale-95 text-white font-bold rounded-lg transition-all shadow-lg shadow-green-900/20"
            >
              +10
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-sm mx-auto space-y-4">
        <button
          onClick={handleScan}
          disabled={isScanning}
          className={`w-full btn-mobile-large flex items-center justify-center gap-2 transition-all ${
            isScanning 
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 active:scale-[0.98]'
          }`}
        >
          {isScanning ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
          {isScanning ? 'Scanning Process...' : 'Scan Process (API)'}
        </button>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-xs">
            <AlertCircle size={14} />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
