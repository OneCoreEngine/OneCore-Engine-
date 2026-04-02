/**
 * Advanced Pattern Scanner for OneCore v2.0
 * Supports wildcard matching and chunked scanning.
 */

export interface PatternMatch {
  name: string;
  offset: number;
  rva: string;
  found: boolean;
  category: string;
}

/**
 * Converts a hex pattern string (e.g., "48 8B 05 ?? ?? ?? ??") 
 * into a byte array and a mask.
 */
export const parsePattern = (pattern: string) => {
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
 * Scans a Uint8Array for a specific pattern.
 * Returns the relative offset of the first match.
 */
export const scanBuffer = (
  buffer: Uint8Array,
  pattern: string,
  startOffset: number = 0,
  endOffset: number = buffer.length
): number => {
  const target = parsePattern(pattern);
  const targetLen = target.length;
  const limit = Math.min(endOffset, buffer.length - targetLen);

  for (let i = startOffset; i < limit; i++) {
    let match = true;
    for (let j = 0; j < targetLen; j++) {
      const targetByte = target[j];
      if (targetByte !== null && buffer[i + j] !== targetByte) {
        match = false;
        break;
      }
    }
    if (match) return i;
  }

  return -1;
};

/**
 * Smart Pattern Generator: If a pattern fails, try to find nearby signatures.
 * (Simplified version: search for a smaller part of the pattern)
 */
export const findClosestMatch = (buffer: Uint8Array, pattern: string): number => {
  const target = parsePattern(pattern);
  if (target.length < 4) return -1;

  // Try matching only the first 4 bytes
  const partialPattern = pattern.split(/\s+/).slice(0, 4).join(' ');
  return scanBuffer(buffer, partialPattern);
};
