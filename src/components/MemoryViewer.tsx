import React from 'react';
import { Search, Cpu, Database, Shield, AlertTriangle, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface MemoryCell {
  address: string;
  value: string;
  type: 'pointer' | 'data' | 'header' | 'empty';
  label?: string;
}

export function MemoryViewer() {
  const [isScanning, setIsScanning] = React.useState(false);
  const [scanProgress, setScanProgress] = React.useState(0);
  const [foundAddresses, setFoundAddresses] = React.useState<MemoryCell[]>([]);
  const [logs, setLogs] = React.useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-5), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setFoundAddresses([]);
    setLogs([]);
    addLog("Initializing OneCore Engine...");
    addLog("Attaching to target process (PID: 1234)...");
    addLog("Scanning for Unreal Engine signatures...");

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          addLog("Scan complete. GWorld found at 0x7A4B2C1000");
          setFoundAddresses([
            { address: '0x7A4B2C1000', value: '0x7A4B2C1000', type: 'header', label: 'GWorld' },
            { address: '0x7A4B2C1008', value: '0x7A4B2C1040', type: 'pointer', label: 'PersistentLevel' },
            { address: '0x7A4B2C1010', value: '0x7A4B2C1080', type: 'pointer', label: 'GameState' },
            { address: '0x7A4B2C1018', value: '0x0000000001', type: 'data', label: 'bIsLevelLoaded' },
            { address: '0x7A4B2C1020', value: '0x7A4B2C1100', type: 'pointer', label: 'OwningGameInstance' },
          ]);
          return 100;
        }
        if (prev === 20) addLog("Searching for GNames signature: 48 8B 05 ? ? ? ? 48 8B 0C C8...");
        if (prev === 50) addLog("Searching for GObjects signature: 48 8B 05 ? ? ? ? 48 8B 0C C8...");
        if (prev === 80) addLog("Resolving relative offsets...");
        return prev + 2;
      });
    }, 50);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-xl border border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Cpu className="text-blue-400" size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-100">Memory Analyzer</h3>
            <p className="text-xs text-zinc-400">Simulated Android Process Environment</p>
          </div>
        </div>
        <button
          onClick={startScan}
          disabled={isScanning}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
            isScanning 
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
          )}
        >
          <Search size={18} />
          {isScanning ? "Scanning..." : "Start Pattern Scan"}
        </button>
      </div>

      {isScanning && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-zinc-400">
            <span>Progress</span>
            <span>{scanProgress}%</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${scanProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
            <div className="px-4 py-3 bg-zinc-900/50 border-b border-zinc-800 flex items-center gap-2">
              <Database size={16} className="text-zinc-400" />
              <span className="text-sm font-medium text-zinc-200">Memory Map (Simulated)</span>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-mono text-zinc-500 border-b border-zinc-800/50">
                    <th className="px-4 py-2 font-normal">Address</th>
                    <th className="px-4 py-2 font-normal">Hex Value</th>
                    <th className="px-4 py-2 font-normal">Label / Structure</th>
                    <th className="px-4 py-2 font-normal">Type</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-mono">
                  {foundAddresses.length > 0 ? (
                    foundAddresses.map((cell, i) => (
                      <motion.tr 
                        key={cell.address}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="border-b border-zinc-900/50 hover:bg-zinc-900/30 group"
                      >
                        <td className="px-4 py-3 text-blue-400/80">{cell.address}</td>
                        <td className="px-4 py-3 text-zinc-300">{cell.value}</td>
                        <td className="px-4 py-3 text-zinc-400 group-hover:text-zinc-200 transition-colors">
                          {cell.label}
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider",
                            cell.type === 'header' ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                            cell.type === 'pointer' ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                            "bg-zinc-800 text-zinc-400"
                          )}>
                            {cell.type}
                          </span>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center text-zinc-500 italic">
                        No active scan results. Start a scan to find UE structures.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
            <div className="px-4 py-3 bg-zinc-900/50 border-b border-zinc-800 flex items-center gap-2">
              <Terminal size={16} className="text-zinc-400" />
              <span className="text-sm font-medium text-zinc-200">Engine Logs</span>
            </div>
            <div className="p-4 space-y-2 min-h-[200px]">
              <AnimatePresence mode="popLayout">
                {logs.map((log, i) => (
                  <motion.div 
                    key={log}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-mono text-zinc-400 leading-relaxed"
                  >
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
              {!isScanning && logs.length === 0 && (
                <div className="text-xs font-mono text-zinc-600 italic">
                  Waiting for engine initialization...
                </div>
              )}
            </div>
          </div>

          <div className="bg-amber-500/5 rounded-xl border border-amber-500/20 p-4 space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle size={18} />
              <h4 className="text-sm font-semibold">Security Note</h4>
            </div>
            <p className="text-xs text-amber-200/70 leading-relaxed">
              Pattern scanning is a common technique used by anti-cheats to detect unauthorized memory readers. 
              Modern ACs use <strong>Heartbeat Scans</strong> and <strong>Syscall Hooking</strong> to monitor 
              memory access patterns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
