/**
 * Ban Fix Detector for OneCore v2.0
 * Identifies specific offsets as ban fix candidates.
 */

export interface BanFixInfo {
  isBanFix: boolean;
  label: string;
  color: string;
}

export const getBanFixInfo = (name: string): BanFixInfo => {
  const upperName = name.toUpperCase();
  
  if (upperName.includes('ANTICHEAT_INIT') || upperName.includes('INIT_ANTICHEAT')) {
    return { isBanFix: true, label: '10Y BAN FIX', color: 'text-green-400' };
  }
  
  if (upperName.includes('BAN_FLAG_WRITE') || upperName.includes('WRITE_BAN_FLAG')) {
    return { isBanFix: true, label: 'TERMINATION', color: 'text-green-400' };
  }
  
  if (upperName.includes('HEARTBEAT_CHECK') || upperName.includes('CHECK_HEARTBEAT')) {
    return { isBanFix: true, label: '1 DAY BAN', color: 'text-green-400' };
  }
  
  if (upperName.includes('HEARTBEAT_SEND')) {
    return { isBanFix: true, label: '3 DAY BAN', color: 'text-green-400' };
  }

  if (upperName.includes('FLAG_BAN') || upperName.includes('BAN_FLAG')) {
    return { isBanFix: true, label: 'FLAG BAN FIX', color: 'text-green-400' };
  }

  if (upperName.includes('INTEGRITY_CHECK')) {
    return { isBanFix: true, label: 'OFFLINE 10Y FIX', color: 'text-green-400' };
  }

  if (upperName.includes('DETECTION_CHECK')) {
    return { isBanFix: true, label: 'ONLINE 10Y FIX', color: 'text-green-400' };
  }

  return { isBanFix: false, label: '', color: '' };
};
