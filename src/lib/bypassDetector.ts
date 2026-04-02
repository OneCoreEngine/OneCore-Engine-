/**
 * Bypass Detector for OneCore v2.0
 * Identifies bypass candidates from scan results.
 */

export interface BypassCandidate {
  name: string;
  offset: string;
  type: 'PATCH' | 'HOOK' | 'NORMAL';
  description: string;
}

export const identifyBypassCandidates = (matches: any[]): BypassCandidate[] => {
  return matches.map(m => {
    let type: 'PATCH' | 'HOOK' | 'NORMAL' = 'NORMAL';
    let description = '';

    const name = m.name.toUpperCase();

    // Bypass Logic: PATCH candidates
    if (
      name.includes('ANTICHEAT_INIT') || 
      name.includes('HEARTBEAT') || 
      name.includes('BAN_FLAG') || 
      name.includes('DETECTION_CHECK') || 
      name.includes('INTEGRITY_CHECK') ||
      name.includes('SECURITY_CHECK')
    ) {
      type = 'PATCH';
      description = 'NOP this address to bypass check';
    }

    // Bypass Logic: HOOK candidates
    if (
      name.includes('PROCESSEVENT') || 
      name.includes('TICK') || 
      name.includes('POSTRENDER') || 
      name.includes('SPAWNACTOR') ||
      name.includes('NETWORK_VALIDATION')
    ) {
      type = 'HOOK';
      description = 'Hook this function for logic control';
    }

    return {
      name: m.name,
      offset: m.rva,
      type,
      description: description || (m.found ? 'Found in library' : 'Not found')
    };
  });
};
