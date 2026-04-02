import React, { useMemo } from 'react';
import { Type, Hash, Copy, CheckCircle2, Circle } from 'lucide-react';
import { FixedSizeList } from 'react-window';
import { getBanFixInfo } from '../lib/banFixDetector';

interface OffsetMatch {
  name: string;
  rva: string;
  found: boolean;
  category: string;
  isString?: boolean;
  isClosestMatch?: boolean;
  type?: 'PATCH' | 'HOOK' | 'NORMAL' | 'RAW';
}

interface OffsetListProps {
  matches: OffsetMatch[];
  selectedOffsets: Set<string>;
  onToggleSelect: (name: string) => void;
  onCopy: (text: string) => void;
  searchQuery: string;
  highlightText: (text: string, query: string) => React.ReactNode;
}

export default function OffsetList({ 
  matches, 
  selectedOffsets, 
  onToggleSelect, 
  onCopy, 
  searchQuery,
  highlightText 
}: OffsetListProps) {
  
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const match = matches[index];
    const banInfo = getBanFixInfo(match.name);
    const isSelected = selectedOffsets.has(match.name);
    
    return (
      <div style={style} className="px-2 py-1">
        <div 
          className={`h-full bg-zinc-950 p-3 rounded-xl border transition-all group flex items-center justify-between gap-3 ${
            isSelected ? 'border-[#00ff88] bg-[#00ff88]/5' : 'border-zinc-800 hover:border-[#00ff88]/30'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button 
              onClick={() => onToggleSelect(match.name)}
              className={`flex-shrink-0 transition-colors p-2 -m-2 ${isSelected ? 'text-[#00ff88]' : 'text-zinc-600 hover:text-zinc-400'}`}
              style={{ minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {isSelected ? <CheckCircle2 size={20} /> : <Circle size={20} />}
            </button>
            <div className={`p-2 rounded-lg flex-shrink-0 ${match.isString ? 'bg-purple-500/10 text-purple-400' : 'bg-[#00ff88]/10 text-[#00ff88]'}`}>
              {match.isString ? <Type size={14} /> : <Hash size={14} />}
            </div>
            <div className="flex flex-col min-w-0 overflow-hidden flex-1">
              <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${banInfo.isBanFix ? 'text-green-400' : 'text-zinc-500'}`}>
                {banInfo.isBanFix && <span className="flex-shrink-0">🟢 [{banInfo.label}]</span>}
                <span className="break-all line-clamp-1">{highlightText(match.name, searchQuery)}</span>
                {match.isClosestMatch && <span className="text-[8px] bg-yellow-500/20 text-yellow-500 px-1 rounded flex-shrink-0">CLOSEST</span>}
                {match.type === 'RAW' && <span className="text-[8px] bg-zinc-800 text-zinc-500 px-1 rounded flex-shrink-0">RAW</span>}
              </span>
              <span className={`text-sm font-mono break-all ${match.found ? 'text-[#00ff88]' : 'text-red-500'}`}>
                {highlightText(match.rva, searchQuery)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <button 
              onClick={() => onCopy(`${match.name} = ${match.rva}`)}
              className="p-3 -m-2 text-zinc-500 hover:text-[#00ff88] transition-colors md:opacity-0 group-hover:opacity-100"
              title="Copy Offset"
              style={{ minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Copy size={16} />
            </button>
            <div className={`hidden sm:block px-2 py-1 rounded text-[8px] font-bold uppercase ${
              match.category === 'anticheat' || match.category === 'security' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
            }`}>
              {match.category}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[500px] w-full bg-zinc-950/50 rounded-2xl border border-zinc-800 overflow-hidden">
      <FixedSizeList
        height={500}
        itemCount={matches.length}
        itemSize={80}
        width="100%"
        className="scrollbar-thin scrollbar-thumb-zinc-800"
      >
        {Row}
      </FixedSizeList>
    </div>
  );
}
