/**
 * Offline Pattern Scanner for OneCore Engine v2.0
 * Performs byte-by-byte pattern matching on ArrayBuffers.
 */

export interface PatternMatch {
  name: string;
  address: string;
  pattern: string;
  type: 'offset' | 'bypass';
}

export interface ScanResult {
  fileName: string;
  matches: PatternMatch[];
  timestamp: string;
}

/**
 * Converts a hex pattern string (e.g., "48 8B 05 ?? ?? ?? ??") 
 * into a byte array and a mask.
 */
const parsePattern = (pattern: string) => {
  const parts = pattern.split(/\s+/);
  const bytes: (number | null)[] = [];

  for (const part of parts) {
    if (part === '??' || part === '?') {
      bytes.push(null);
    } else {
      bytes.push(parseInt(part, 16));
    }
  }

  return bytes;
};

/**
 * Scans an ArrayBuffer for a specific pattern.
 * Returns the relative offset (RVA) of the first match.
 */
export const findPattern = (buffer: ArrayBuffer, pattern: string): number => {
  const view = new Uint8Array(buffer);
  const target = parsePattern(pattern);
  const targetLen = target.length;
  const limit = view.length - targetLen;

  for (let i = 0; i < limit; i++) {
    let match = true;
    for (let j = 0; j < targetLen; j++) {
      const targetByte = target[j];
      if (targetByte !== null && view[i + j] !== targetByte) {
        match = false;
        break;
      }
    }
    if (match) return i;
  }

  return -1;
};

/**
 * Predefined patterns for BGMI / Unreal Engine Analysis
 */
export const PREDEFINED_PATTERNS = [
  { name: 'OFFSET_GWORLD', pattern: '48 8B 05 ?? ?? ?? ?? 48 8B 88', type: 'offset' },
  { name: 'OFFSET_GNAMES', pattern: '48 8D 0D ?? ?? ?? ?? E8 ?? ?? ?? ?? 48 8B D8', type: 'offset' },
  { name: 'OFFSET_GOBJECTS', pattern: '48 8B 05 ?? ?? ?? ?? 48 8B 0C C8', type: 'offset' },
  { name: 'BYPASS_ANTICHEAT_INIT', pattern: '4D 49 4C 4C', type: 'bypass' },
  { name: 'BYPASS_HEARTBEAT', pattern: 'FF 25 ?? ?? ?? ?? 66 90', type: 'bypass' },
  { name: 'BYPASS_BAN_FLAG', pattern: '48 89 5C 24 ?? 48 89 74 24 ?? 57 48 83 EC 20 48 8B F9', type: 'bypass' },
];

/**
 * Analyzes a file buffer against all predefined patterns.
 */
export const analyzeLibrary = async (fileName: string, buffer: ArrayBuffer): Promise<ScanResult> => {
  const matches: PatternMatch[] = [];

  // Simulate some processing time for UX
  await new Promise(resolve => setTimeout(resolve, 800));

  for (const item of PREDEFINED_PATTERNS) {
    const offset = findPattern(buffer, item.pattern);
    if (offset !== -1) {
      matches.push({
        name: item.name,
        address: `0x${offset.toString(16).toUpperCase()}`,
        pattern: item.pattern,
        type: item.type as 'offset' | 'bypass'
      });
    }
  }

  return {
    fileName,
    matches,
    timestamp: new Date().toLocaleString()
  };
};
