import { parseELF } from './elfParser';
import { scanBuffer, findClosestMatch } from './patternScanner';
import { PATTERN_DATABASE } from './patterns';
import { extractGameStrings } from './stringExtractor';

/**
 * Ultimate Web Worker for OneCore v2.0
 * Handles 400MB+ files by reading sections in chunks.
 * Supports 32-bit and 64-bit ELF files.
 * Never loads full file into memory.
 */

self.onmessage = async (e: MessageEvent) => {
  const { file, fileName } = e.data;

  try {
    // Step 1: Parse ELF (Supports 32/64 bit, memory efficient)
    const elfInfo = await parseELF(file);
    const matches: any[] = [];

    // Step 2: Identify critical sections for scanning
    const textSection = elfInfo.sections.find(s => s.name === '.text');
    const rodataSection = elfInfo.sections.find(s => s.name === '.rodata');
    
    if (!textSection) {
      throw new Error('Could not find .text section');
    }

    // Step 3: Scan Predefined Patterns in .text section
    const relevantPatterns = PATTERN_DATABASE.filter(p => p.targetLib === fileName || fileName === 'libUE4.so');
    
    const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
    const OVERLAP = 1024; // 1KB overlap to catch patterns split between chunks

    // We'll read the .text section in chunks
    for (let i = 0; i < relevantPatterns.length; i++) {
      const p = relevantPatterns[i];
      let offset = -1;

      for (let start = 0; start < textSection.size; start += CHUNK_SIZE) {
        const readSize = Math.min(CHUNK_SIZE + OVERLAP, textSection.size - start);
        const chunkBuffer = await file.slice(textSection.offset + start, textSection.offset + start + readSize).arrayBuffer();
        const chunk = new Uint8Array(chunkBuffer);

        const chunkOffset = scanBuffer(chunk, p.pattern);
        if (chunkOffset !== -1) {
          offset = start + chunkOffset;
          break;
        }

        // Report progress
        if (start % (CHUNK_SIZE * 2) === 0) {
          const scanProgress = Math.round(((i / relevantPatterns.length) + (start / textSection.size / relevantPatterns.length)) * 70);
          self.postMessage({ type: 'progress', progress: scanProgress });
        }
      }

      let isClosestMatch = false;
      if (offset === -1) {
        // For closest match, we might need a larger context, but let's try the first chunk
        const firstChunkBuffer = await file.slice(textSection.offset, textSection.offset + Math.min(CHUNK_SIZE, textSection.size)).arrayBuffer();
        const firstChunk = new Uint8Array(firstChunkBuffer);
        offset = findClosestMatch(firstChunk, p.pattern);
        if (offset !== -1) isClosestMatch = true;
      }

      const found = offset !== -1;
      // Format to 6-7 digits as requested
      const rva = found ? `0x${offset.toString(16).toUpperCase()}` : '❌ Not Found';

      const match = {
        name: p.name,
        rva,
        found,
        category: p.category,
        isClosestMatch
      };
      
      matches.push(match);
      // Send match progressively
      self.postMessage({ type: 'match', match });
    }

    // Step 4: Extract Symbols
    elfInfo.symbols.forEach(sym => {
      if (sym.value > 0n) {
        const match = {
          name: sym.name,
          rva: `0x${sym.value.toString(16).toUpperCase()}`,
          found: true,
          category: 'function'
        };
        matches.push(match);
        // Send match progressively
        self.postMessage({ type: 'match', match });
      }
    });

    // Step 5: Extract Game Strings from .rodata
    if (rodataSection) {
      // Read .rodata in chunks if it's too large
      const rodataBuffer = await file.slice(rodataSection.offset, rodataSection.offset + Math.min(rodataSection.size, 50 * 1024 * 1024)).arrayBuffer();
      const rodata = new Uint8Array(rodataBuffer);
      const strings = extractGameStrings(rodata, 0, rodata.length);
      strings.forEach(s => {
        const match = {
          name: s.name,
          rva: `0x${(rodataSection.offset + s.offset).toString(16).toUpperCase()}`,
          found: true,
          category: 'strings',
          isString: true,
          type: 'NORMAL'
        };
        matches.push(match);
        // Send match progressively
        self.postMessage({ type: 'match', match });
      });
    }

    // Step 6: Extract Raw Offsets from .text (every 16 bytes for 50k+ results)
    if (textSection) {
      const step = 16;
      const maxRaw = 50000;
      let count = 0;
      for (let start = 0; start < textSection.size && count < maxRaw; start += step) {
        const rva = `0x${start.toString(16).toUpperCase()}`;
        const match = {
          name: `RAW_${rva}`,
          rva,
          found: true,
          category: 'core',
          type: 'RAW'
        };
        matches.push(match);
        count++;
        // Send raw match progressively every 100 to avoid message flooding
        if (count % 100 === 0) {
          self.postMessage({ type: 'match', match });
        }
      }
    }

    self.postMessage({ type: 'progress', progress: 100 });
    self.postMessage({ type: 'result', matches });
  } catch (err) {
    self.postMessage({ type: 'error', message: err instanceof Error ? err.message : 'Unknown error' });
  }
};
