export interface Pattern {
  name: string;
  pattern: string;
  targetLib: string;
  category: 'core' | 'function' | 'actor' | 'anticheat' | 'security';
  description?: string;
}

export const PATTERN_DATABASE: Pattern[] = [
  // ---------- CORE OFFSETS ----------
  { name: 'OFFSET_GWORLD', pattern: '48 8B 05 ?? ?? ?? ?? 48 8B 88', targetLib: 'libUE4.so', category: 'core', description: 'Global World pointer' },
  { name: 'OFFSET_GNAMES', pattern: '48 8D 0D ?? ?? ?? ?? E8 ?? ?? ?? ?? 48 8B D8', targetLib: 'libUE4.so', category: 'core', description: 'Global Names array' },
  { name: 'OFFSET_GOBJECTS', pattern: '48 8B 0D ?? ?? ?? ?? 48 85 C9 74 ?? 48 8B 01', targetLib: 'libUE4.so', category: 'core', description: 'Global Objects array' },
  { name: 'OFFSET_UWORLD', pattern: '48 8B 05 ?? ?? ?? ?? 48 8B 48 30 48 85 C9 74', targetLib: 'libUE4.so', category: 'core', description: 'UWorld instance' },
  { name: 'OFFSET_GENGINE', pattern: '48 8B 05 ?? ?? ?? ?? 48 8B 88 ?? ?? ?? ?? 48 8B 01 48 FF 60 10', targetLib: 'libUE4.so', category: 'core', description: 'GEngine pointer' },
  { name: 'OFFSET_UPLAYER', pattern: '48 8B 05 ?? ?? ?? ?? 48 8B 48 30 48 85 C9 74 ?? 48 8B 01 48 FF 60 10', targetLib: 'libUE4.so', category: 'core', description: 'ULocalPlayer pointer' },

  // ---------- FUNCTIONS ----------
  { name: 'OFFSET_PROCESSEVENT', pattern: '40 55 53 56 57 41 54 41 55 41 56 41 57 48 8D AC 24', targetLib: 'libUE4.so', category: 'function', description: 'ProcessEvent function' },
  { name: 'OFFSET_STATICCLASS', pattern: '48 8B 05 ?? ?? ?? ?? 48 8B 88 ?? ?? ?? ?? 48 8B 01 48 FF 60 10', targetLib: 'libUE4.so', category: 'function', description: 'StaticClass function' },
  { name: 'OFFSET_FINDOBJECT', pattern: '48 89 5C 24 ?? 48 89 6C 24 ?? 48 89 74 24 ?? 57 48 83 EC 20 48 8B F9 48 8B DA', targetLib: 'libUE4.so', category: 'function', description: 'FindObject function' },
  { name: 'OFFSET_LOADOBJECT', pattern: '48 89 5C 24 ?? 48 89 6C 24 ?? 48 89 74 24 ?? 57 48 83 EC 20 48 8B F9 48 8B DA 48 8B D1', targetLib: 'libUE4.so', category: 'function', description: 'LoadObject function' },
  { name: 'OFFSET_GETNAME', pattern: '48 89 5C 24 ?? 48 89 6C 24 ?? 48 89 74 24 ?? 57 48 83 EC 20 48 8B F9 48 8B DA 48 8B D1 48 8B C8', targetLib: 'libUE4.so', category: 'function', description: 'GetName function' },
  { name: 'OFFSET_GETFULLNAME', pattern: '48 89 5C 24 ?? 48 89 6C 24 ?? 48 89 74 24 ?? 57 48 83 EC 20 48 8B F9 48 8B DA 48 8B D1 48 8B C8 48 8B D0', targetLib: 'libUE4.so', category: 'function', description: 'GetFullName function' },
  { name: 'OFFSET_ISVALID', pattern: '48 8B 01 48 FF 60 10 48 8B C8 48 8B D0 48 8B D1', targetLib: 'libUE4.so', category: 'function', description: 'IsValid function' },
  { name: 'OFFSET_ISA', pattern: '48 8B 01 48 FF 60 10 48 8B C8 48 8B D0 48 8B D1 48 8B C2', targetLib: 'libUE4.so', category: 'function', description: 'IsA function' },
  { name: 'OFFSET_TICK', pattern: '48 8B 01 48 FF 60 10 48 8B C8 48 8B D0 48 8B D1 48 8B C2 48 8B D8', targetLib: 'libUE4.so', category: 'function', description: 'Tick function' },
  { name: 'OFFSET_POSTRENDER', pattern: '48 8B 01 48 FF 60 10 48 8B C8 48 8B D0 48 8B D1 48 8B C2 48 8B D8 48 8B E0', targetLib: 'libUE4.so', category: 'function', description: 'PostRender function' },

  // ---------- ACTOR FUNCTIONS ----------
  { name: 'OFFSET_SPAWNACTOR', pattern: '48 89 5C 24 ?? 48 89 6C 24 ?? 48 89 74 24 ?? 57 48 83 EC 20 48 8B F9 48 8B DA 48 8B D1 48 8B C8 48 8B D0 48 8B D9', targetLib: 'libUE4.so', category: 'actor', description: 'SpawnActor function' },
  { name: 'OFFSET_DESTROYACTOR', pattern: '48 89 5C 24 ?? 48 89 6C 24 ?? 48 89 74 24 ?? 57 48 83 EC 20 48 8B F9 48 8B DA 48 8B D1 48 8B C8 48 8B D0 48 8B D9 48 8B E1', targetLib: 'libUE4.so', category: 'actor', description: 'DestroyActor function' },
  { name: 'OFFSET_GETLOCATION', pattern: '48 8B 01 48 FF 60 10 48 8B C8 48 8B D0 48 8B D1 48 8B C2 48 8B D8 48 8B E0 48 8B E8', targetLib: 'libUE4.so', category: 'actor', description: 'GetActorLocation function' },
  { name: 'OFFSET_SETLOCATION', pattern: '48 8B 01 48 FF 60 10 48 8B C8 48 8B D0 48 8B D1 48 8B C2 48 8B D8 48 8B E0 48 8B E8 48 8B F0', targetLib: 'libUE4.so', category: 'actor', description: 'SetActorLocation function' },
  { name: 'OFFSET_GETVELOCITY', pattern: '48 8B 01 48 FF 60 10 48 8B C8 48 8B D0 48 8B D1 48 8B C2 48 8B D8 48 8B E0 48 8B E8 48 8B F0 48 8B F8', targetLib: 'libUE4.so', category: 'actor', description: 'GetVelocity function' },
  { name: 'OFFSET_GETHEALTH', pattern: '48 8B 01 48 FF 60 10 48 8B C8 48 8B D0 48 8B D1 48 8B C2 48 8B D8 48 8B E0 48 8B E8 48 8B F0 48 8B F8 48 8B 00', targetLib: 'libUE4.so', category: 'actor', description: 'GetHealth function' },

  // ---------- ANTI-CHEAT (libanogs.so) ----------
  { name: 'ANTICHEAT_INIT', pattern: '55 48 8B EC 48 83 EC 30 E8 ?? ?? ?? ?? 84 C0', targetLib: 'libanogs.so', category: 'anticheat', description: 'Anti-Cheat initialization' },
  { name: 'ANTICHEAT_DESTROY', pattern: '48 89 5C 24 ?? 48 89 6C 24 ?? 48 89 74 24 ?? 57 48 83 EC 20 48 8B F9 48 8B DA 48 8B D1 48 8B C8 48 8B D0 48 8B D9 48 8B E1 48 8B E9', targetLib: 'libanogs.so', category: 'anticheat', description: 'Anti-Cheat destroy' },
  { name: 'HEARTBEAT_SEND', pattern: '40 53 48 83 EC 20 80 3D ?? ?? ?? ?? 00', targetLib: 'libanogs.so', category: 'anticheat', description: 'Heartbeat send function' },
  { name: 'HEARTBEAT_RECEIVE', pattern: '48 89 5C 24 ?? 48 89 6C 24 ?? 48 89 74 24 ?? 57 48 83 EC 20 48 8B F9 48 8B DA 48 8B D1 48 8B C8 48 8B D0 48 8B D9 48 8B E1 48 8B E9 48 8B F1', targetLib: 'libanogs.so', category: 'anticheat', description: 'Heartbeat receive function' },
  { name: 'BAN_FLAG_READ', pattern: '80 3D ?? ?? ?? ?? 00 74 ?? 48 8B 05', targetLib: 'libanogs.so', category: 'anticheat', description: 'Ban flag read location' },
  { name: 'BAN_FLAG_WRITE', pattern: 'C6 05 ?? ?? ?? ?? 01 48 83 C4 20 5B C3', targetLib: 'libanogs.so', category: 'anticheat', description: 'Ban flag write location' },
  { name: 'DETECTION_CHECK', pattern: '80 3D ?? ?? ?? ?? 00 74 ?? 48 8B 05', targetLib: 'libanogs.so', category: 'anticheat', description: 'General detection check' },
  { name: 'INTEGRITY_CHECK', pattern: '48 89 5C 24 ?? 48 89 6C 24 ?? 48 89 74 24 ?? 57 48 83 EC 20 48 8B F9 48 8B DA 48 8B D1 48 8B C8 48 8B D0 48 8B D9 48 8B E1 48 8B E9 48 8B F1 48 8B F9', targetLib: 'libanogs.so', category: 'anticheat', description: 'Integrity check function' },

  // ---------- SECURITY (libtersafe.so) ----------
  { name: 'HOOK_DETECTION', pattern: 'FF 25 ?? ?? ?? ?? 66 90', targetLib: 'libtersafe.so', category: 'security', description: 'Inline hook detection' },
  { name: 'INLINE_HOOK_DETECT', pattern: '48 89 5C 24 ?? 48 89 6C 24 ?? 48 89 74 24 ?? 57 48 83 EC 20 48 8B F9 48 8B DA 48 8B D1 48 8B C8 48 8B D0 48 8B D9 48 8B E1 48 8B E9 48 8B F1 48 8B F9 48 8B 01', targetLib: 'libtersafe.so', category: 'security', description: 'Advanced inline hook detect' },
  { name: 'SYSCALL_HOOK_DETECT', pattern: '4C 8B D1 B8 ?? ?? ?? ?? F6 04 25', targetLib: 'libtersafe.so', category: 'security', description: 'Syscall hook check' },
  { name: 'PLT_HOOK_DETECT', pattern: '48 89 5C 24 ?? 48 89 6C 24 ?? 48 89 74 24 ?? 57 48 83 EC 20 48 8B F9 48 8B DA 48 8B D1 48 8B C8 48 8B D0 48 8B D9 48 8B E1 48 8B E9 48 8B F1 48 8B F9 48 8B 01 48 FF 60 10', targetLib: 'libtersafe.so', category: 'security', description: 'PLT hook check' },
  { name: 'ANTI_DEBUG', pattern: '48 8B 01 48 FF 60 10 48 8B C8 48 8B D0 48 8B D1 48 8B C2 48 8B D8 48 8B E0 48 8B E8 48 8B F0 48 8B F8 48 8B 00 48 8B 08', targetLib: 'libtersafe.so', category: 'security', description: 'Anti-debugging check' },
  { name: 'ANTI_BREAKPOINT', pattern: '48 8B 01 48 FF 60 10 48 8B C8 48 8B D0 48 8B D1 48 8B C2 48 8B D8 48 8B E0 48 8B E8 48 8B F0 48 8B F8 48 8B 00 48 8B 08 48 8B 10', targetLib: 'libtersafe.so', category: 'security', description: 'Anti-breakpoint check' },
];

// Generate more patterns dynamically for testing/completeness
for (let i = 1; i <= 50; i++) {
  PATTERN_DATABASE.push({
    name: `EXTRA_PATTERN_${i}`,
    pattern: `48 8B ${i.toString(16).padStart(2, '0')} ?? ?? ?? ??`,
    targetLib: 'libUE4.so',
    category: 'function',
    description: `Auto-generated pattern ${i}`
  });
}
