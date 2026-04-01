import React from 'react';
import { 
  Shield, 
  Cpu, 
  Search, 
  Book, 
  Terminal, 
  Settings, 
  Info, 
  Lock,
  Github,
  ChevronRight,
  Code2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { MemoryViewer } from './components/MemoryViewer';
import { CodeBlock } from './components/CodeBlock';
import { UEStructureDocs } from './components/UEStructureDocs';
import { AntiCheatDocs } from './components/AntiCheatDocs';
import { BuildConfigDocs } from './components/BuildConfigDocs';

type Tab = 'overview' | 'reader' | 'scanner' | 'structures' | 'anticheat' | 'viewer' | 'build';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<Tab>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'reader', label: 'Memory Reader', icon: Code2 },
    { id: 'scanner', label: 'Pattern Scanner', icon: Search },
    { id: 'structures', label: 'UE Structures', icon: Book },
    { id: 'anticheat', label: 'Anti-Cheat Research', icon: Shield },
    { id: 'viewer', label: 'Memory Viewer', icon: Cpu },
    { id: 'build', label: 'Build Config', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-zinc-950 border-r border-zinc-900 z-50 hidden lg:flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-zinc-900">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/20">
            <Shield className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-zinc-100 tracking-tight">OneCore Engine</h1>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Educational v1.0</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all group",
                activeTab === tab.id 
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
              )}
            >
              <tab.icon size={18} className={cn(
                "transition-colors",
                activeTab === tab.id ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-400"
              )} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="ml-auto"
                >
                  <ChevronRight size={14} />
                </motion.div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-900 space-y-4">
          <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 mb-1">
              <Lock size={12} />
              <span>Environment</span>
            </div>
            <p className="text-[10px] text-zinc-600 font-mono">Cloud Run Sandbox (Read-Only)</p>
          </div>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-xs font-medium text-zinc-400 transition-colors"
          >
            <Github size={14} />
            View on GitHub
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 min-h-screen">
        <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="lg:hidden p-2 bg-blue-600 rounded-lg">
              <Shield className="text-white" size={20} />
            </div>
            <h2 className="text-sm font-semibold text-zinc-100">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">System Ready</span>
            </div>
          </div>
        </header>

        <div className="p-6 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && <OverviewTab />}
              {activeTab === 'reader' && <ReaderTab />}
              {activeTab === 'scanner' && <ScannerTab />}
              {activeTab === 'structures' && <UEStructureDocs />}
              {activeTab === 'anticheat' && <AntiCheatDocs />}
              {activeTab === 'viewer' && <MemoryViewer />}
              {activeTab === 'build' && <BuildConfigDocs />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-900 p-8 lg:p-12 shadow-2xl shadow-blue-900/20">
        <div className="relative z-10 max-w-2xl space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            OneCore Engine <br />
            <span className="text-blue-200/80">Educational Cybersecurity Research</span>
          </h1>
          <p className="text-lg text-blue-100/70 leading-relaxed">
            A comprehensive learning platform for Android reverse engineering, 
            Unreal Engine memory analysis, and anti-cheat security research.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 text-sm font-medium text-white">
              Memory Analysis
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 text-sm font-medium text-white">
              UE Structures
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 text-sm font-medium text-white">
              Anti-Cheat Research
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 translate-x-1/2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Terminal size={20} className="text-blue-400" />
            Project Goals
          </h3>
          <ul className="space-y-4">
            <li className="flex gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-blue-400">1</div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Understand low-level memory management in Android using NDK and C++.
              </p>
            </li>
            <li className="flex gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-blue-400">2</div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Analyze how Unreal Engine organizes game objects (GNames, GObjects, GWorld).
              </p>
            </li>
            <li className="flex gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-blue-400">3</div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Learn pattern scanning techniques to find dynamic memory structures.
              </p>
            </li>
          </ul>
        </div>

        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 space-y-4">
          <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Shield size={20} className="text-red-400" />
            Educational Scope
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            This tool is strictly for educational purposes. It focuses on <strong>read-only</strong> 
            memory analysis for research in cybersecurity and game security. 
            No modifications to game memory are implemented or encouraged.
          </p>
          <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
            <p className="text-xs text-amber-200/80 italic">
              "Research is the process of going up alleys to see if they are blind." — OneCore Engine Team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReaderTab() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-zinc-100">Memory Reading Implementation</h2>
        <p className="text-zinc-400 text-sm">
          On Android, memory reading can be achieved using various system calls. 
          The most common method for external research is <code>process_vm_readv</code>.
        </p>
      </div>

      <CodeBlock 
        title="Using process_vm_readv (External)"
        code={`#include <sys/uio.h>
#include <unistd.h>

bool ReadMemory(pid_t pid, uintptr_t address, void* buffer, size_t size) {
    struct iovec local[1];
    struct iovec remote[1];

    local[0].iov_base = buffer;
    local[0].iov_content = size;
    remote[0].iov_base = (void*)address;
    remote[0].iov_content = size;

    ssize_t nread = process_vm_readv(pid, local, 1, remote, 1, 0);
    return nread == (ssize_t)size;
}`}
      />

      <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 space-y-4">
        <h3 className="font-semibold text-zinc-100">Security Considerations</h3>
        <ul className="space-y-3 text-sm text-zinc-400">
          <li className="flex gap-3">
            <span className="text-blue-500 font-bold">•</span>
            <span><strong>Root Access:</strong> External memory reading typically requires root privileges or <code>CAP_SYS_PTRACE</code>.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-500 font-bold">•</span>
            <span><strong>Syscall Hooking:</strong> Anti-cheats often hook <code>process_vm_readv</code> in the game process to detect external readers.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-500 font-bold">•</span>
            <span><strong>Alternative:</strong> Reading <code>/proc/[pid]/mem</code> is another method, but requires file descriptor management.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function ScannerTab() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-zinc-100">Pattern Scanning (AOB)</h2>
        <p className="text-zinc-400 text-sm">
          Pattern scanning (Array of Bytes) allows you to find memory structures even when their 
          addresses change due to ASLR or engine updates.
        </p>
      </div>

      <CodeBlock 
        title="Simple Pattern Scanner"
        code={`bool Compare(const char* data, const char* pattern, const char* mask) {
    for (; *mask; ++mask, ++data, ++pattern) {
        if (*mask == 'x' && *data != *pattern)
            return false;
    }
    return (*mask) == 0;
}

uintptr_t FindPattern(uintptr_t start, size_t size, const char* pattern, const char* mask) {
    for (size_t i = 0; i < size; i++) {
        if (Compare((const char*)(start + i), pattern, mask))
            return start + i;
    }
    return 0;
}`}
      />

      <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 space-y-4">
        <h3 className="font-semibold text-zinc-100">Research Signatures (Example)</h3>
        <div className="space-y-4">
          <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800">
            <p className="text-xs font-mono text-blue-400 mb-1">GWorld Signature</p>
            <p className="text-sm font-mono text-zinc-300">48 8B 05 ? ? ? ? 48 8B 0C C8</p>
            <p className="text-[10px] text-zinc-500 mt-2">Mask: xxxx????xxxx</p>
          </div>
          <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800">
            <p className="text-xs font-mono text-green-400 mb-1">GNames Signature</p>
            <p className="text-sm font-mono text-zinc-300">48 8D 05 ? ? ? ? EB 13</p>
            <p className="text-[10px] text-zinc-500 mt-2">Mask: xxxx????xx</p>
          </div>
        </div>
      </div>
    </div>
  );
}
