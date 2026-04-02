/**
 * API Service for OneCore Engine
 * Handles requests based on Local/Cloud mode selection.
 */

export type ProcessingMode = 'local' | 'cloud';

export interface AppSettings {
  mode: ProcessingMode;
  cloudUrl: string;
  apiKey: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  mode: 'local',
  cloudUrl: '',
  apiKey: '',
};

export const getSettings = (): AppSettings => {
  const saved = localStorage.getItem('onecore_settings');
  if (!saved) return DEFAULT_SETTINGS;
  try {
    return JSON.parse(saved);
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: AppSettings) => {
  localStorage.setItem('onecore_settings', JSON.stringify(settings));
};

export const getBaseUrl = (): string => {
  const settings = getSettings();
  if (settings.mode === 'local') {
    return 'http://localhost:8080';
  }
  return settings.cloudUrl || 'http://localhost:8080';
};

export const performAnalysis = async (pid: string = '0'): Promise<any> => {
  const baseUrl = getBaseUrl();
  const settings = getSettings();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (settings.mode === 'cloud' && settings.apiKey) {
    headers['X-API-Key'] = settings.apiKey;
  }

  try {
    const response = await fetch(`${baseUrl}/api/analyze?pid=${pid}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Call Failed:', error);
    throw error;
  }
};
