/**
 * String Extractor for OneCore v2.0
 * Scans .rodata and .dynstr sections for game-related strings.
 */

export interface StringMatch {
  name: string;
  offset: number;
  rva: string;
}

const GAME_KEYWORDS = [
  'UObject', 'AActor', 'UGameInstance', 'UWorld', 'GEngine', 
  'ULevel', 'UPlayer', 'ULocalPlayer', 'UCanvas', 'UFont',
  'APlayerController', 'APawn', 'ACharacter', 'UComponent',
  'ProcessEvent', 'StaticClass', 'FindObject', 'LoadObject',
  'GetName', 'GetFullName', 'IsValid', 'IsA', 'Tick',
  'BeginPlay', 'EndPlay', 'DestroyActor', 'SpawnActor',
  'GetActorLocation', 'SetActorLocation', 'GetVelocity',
  'GetHealth', 'GetTeam', 'GWorld', 'GNames', 'GObjects'
];

/**
 * Extracts null-terminated strings from a buffer.
 * Filters for strings that contain game-related keywords.
 */
export const extractGameStrings = (
  buffer: Uint8Array,
  sectionOffset: number,
  sectionSize: number
): StringMatch[] => {
  const matches: StringMatch[] = [];
  const start = sectionOffset;
  const end = sectionOffset + sectionSize;

  let currentString = '';
  let currentStart = -1;

  for (let i = start; i < end; i++) {
    const charCode = buffer[i];

    if (charCode === 0) {
      if (currentString.length > 3) {
        // Check if string contains any game keywords
        const isGameRelated = GAME_KEYWORDS.some(keyword => 
          currentString.toLowerCase().includes(keyword.toLowerCase())
        );

        if (isGameRelated) {
          matches.push({
            name: currentString,
            offset: currentStart,
            rva: `0x${currentStart.toString(16).toUpperCase().padStart(8, '0')}`
          });
        }
      }
      currentString = '';
      currentStart = -1;
    } else if (charCode >= 32 && charCode <= 126) {
      if (currentStart === -1) currentStart = i;
      currentString += String.fromCharCode(charCode);
    } else {
      currentString = '';
      currentStart = -1;
    }
  }

  return matches;
};
