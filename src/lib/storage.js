// LocalStorage utilities for persistence

const STORAGE_KEYS = {
  DARK_MODE: 'mediasplit_dark_mode',
  SETTINGS: 'mediasplit_settings',
  HISTORY: 'mediasplit_history'
};

// Dark Mode
export const getDarkMode = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
  if (saved !== null) return JSON.parse(saved);
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const setDarkMode = (value) => {
  localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(value));
};

// Settings
export const getSettings = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (saved) return JSON.parse(saved);
  return {
    chunkSize: 60,
    resolution: 'original',
    format: 'mp4',
    quality: 'high'
  };
};

export const setSettings = (settings) => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

// History
export const getHistory = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
  if (saved) return JSON.parse(saved);
  return [];
};

export const addToHistory = (entry) => {
  const history = getHistory();
  const newEntry = {
    ...entry,
    id: Date.now(),
    timestamp: new Date().toISOString()
  };
  history.unshift(newEntry);
  // Keep only last 20 entries
  const trimmed = history.slice(0, 20);
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmed));
  return trimmed;
};

export const clearHistory = () => {
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([]));
};
