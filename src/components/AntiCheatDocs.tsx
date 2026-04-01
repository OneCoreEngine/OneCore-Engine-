import React from 'react';
import { Shield, AlertTriangle, Eye, Lock, Activity, Search } from 'lucide-react';
import { motion } from 'motion/react';

export function AntiCheatDocs() {
  const detectionMethods = [
    {
      title: "Syscall Hooking",
      icon: <Lock className="text-red-400" />,
      description: "Anti-cheats hook system calls like `process_vm_readv` or `ptrace` to detect unauthorized memory access from external processes.",
      severity: "High",
      counter: "Use direct syscalls (SVC) to bypass libc hooks."
    },
    {
      title: "Heartbeat Scans",
      icon: <Activity className="text-blue-400" />,
      description: "Periodic checks of game memory integrity. If a memory reader modifies a byte (e.g., for a hook), the AC detects the checksum mismatch.",
      severity: "Medium",
      counter: "Read-only access is safer, but still detectable via access patterns."
    },
    {
      title: "Thread Monitoring",
      icon: <Eye className="text-green-400" />,
      description: "Scanning `/proc/[pid]/task` to find hidden or suspicious threads that shouldn't be part of the game process.",
      severity: "High",
      counter: "Avoid creating threads within the game process; use external reading."
    },
    {
      title: "Pattern Signature Detection",
      icon: <Search className="text-purple-400" />,
      description: "Searching for known cheat tool signatures in memory or on disk. OneCore Engine's own code could be flagged if not obfuscated.",
      severity: "Critical",
      counter: "Polymorphic code and dynamic signature generation."
    }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3 text-red-400">
          <Shield size={24} />
          <h2 className="text-xl font-bold">Anti-Cheat Detection Research</h2>
        </div>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Modern Android anti-cheats (like BattlEye, Easy Anti-Cheat, or proprietary solutions) 
          operate at multiple levels of the system. Understanding their detection vectors is 
          essential for security research.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {detectionMethods.map((method, i) => (
          <motion.div 
            key={method.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 space-y-4 hover:border-zinc-700 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 bg-zinc-800 rounded-lg">
                {method.icon}
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                method.severity === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                method.severity === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}>
                {method.severity} Risk
              </span>
            </div>
            <h3 className="font-semibold text-zinc-100">{method.title}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {method.description}
            </p>
            <div className="pt-4 border-t border-zinc-800">
              <div className="flex items-start gap-2">
                <AlertTriangle size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-amber-200/60 italic">
                  <strong>Research Note:</strong> {method.counter}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-6 space-y-4">
        <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
          <Lock size={18} className="text-blue-400" />
          Memory Protection Mechanisms
        </h3>
        <ul className="space-y-3 text-sm text-zinc-400">
          <li className="flex gap-3">
            <span className="text-blue-500 font-bold">•</span>
            <span><strong>ASLR (Address Space Layout Randomization):</strong> Randomizes memory addresses on every launch. Requires pattern scanning to find structures.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-500 font-bold">•</span>
            <span><strong>XOM (Execute-Only Memory):</strong> Prevents reading of executable code sections, making it harder to dump game libraries.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-500 font-bold">•</span>
            <span><strong>PTRACE_TRACEME:</strong> A common trick where the game process ptraces itself to prevent external debuggers from attaching.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
