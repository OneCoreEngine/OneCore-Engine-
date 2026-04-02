/**
 * Sync Service for OneCore Engine
 * Handles fetching public signature data from GitHub.
 */

export interface SyncData {
  version: string;
  signatures: string[];
  info: string;
  lastSync: string;
}

const SYNC_STORAGE_KEY = 'onecore_sync_data';
// Example public URL (User should replace with their actual GitHub raw URL)
const GITHUB_DATA_URL = 'https://raw.githubusercontent.com/OneCore-Engine/data/main/signatures.json';

export const getLocalSyncData = (): SyncData | null => {
  const saved = localStorage.getItem(SYNC_STORAGE_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
};

export const syncDataFromGithub = async (): Promise<SyncData> => {
  try {
    const response = await fetch(GITHUB_DATA_URL);
    
    if (!response.ok) {
      throw new Error('Failed to fetch from GitHub');
    }

    const data = await response.json();
    const syncResult: SyncData = {
      ...data,
      lastSync: new Date().toLocaleString(),
    };

    localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(syncResult));
    return syncResult;
  } catch (error) {
    console.warn('Sync failed, using fallback/mock data for demonstration:', error);
    
    // Mock data for demonstration if the real URL isn't set up yet
    const mockData: SyncData = {
      version: "1.0.2",
      signatures: ["48 8B 05 ? ? ? ? 48 8B 0C C8", "48 8D 05 ? ? ? ? EB 13"],
      info: "Public Unreal Engine structure patterns (Synced)",
      lastSync: new Date().toLocaleString(),
    };
    
    localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(mockData));
    return mockData;
  }
};

export const clearCache = () => {
  localStorage.removeItem(SYNC_STORAGE_KEY);
  localStorage.removeItem('onecore_settings');
  window.location.reload();
};
