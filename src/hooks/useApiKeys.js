import { useState, useCallback } from 'react';

const STORAGE_KEY = 'prompt-studio-api-keys';

const DEFAULT_KEYS = {
  anthropic: '',
  gemini: '',
  openrouter: '',
};

function loadKeys() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_KEYS, ...parsed };
    }
  } catch {
    // corrupted data — ignore
  }
  return DEFAULT_KEYS;
}

export function useApiKeys() {
  const [apiKeys, setApiKeysState] = useState(loadKeys);

  const setApiKeys = useCallback((keysOrUpdater) => {
    setApiKeysState((prev) => {
      const next = typeof keysOrUpdater === 'function' ? keysOrUpdater(prev) : keysOrUpdater;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage full or blocked — fail silently
      }
      return next;
    });
  }, []);

  const clearKey = useCallback((provider) => {
    setApiKeys((prev) => ({ ...prev, [provider]: '' }));
  }, [setApiKeys]);

  const clearAllKeys = useCallback(() => {
    setApiKeys(DEFAULT_KEYS);
  }, [setApiKeys]);

  return { apiKeys, setApiKeys, clearKey, clearAllKeys };
}
