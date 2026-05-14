'use client';

import { useEffect, useState } from 'react';
import { getStoredGameState, setStoredGameState, StoredGameState } from '../lib/persistentState';

export default function usePersistentState<T>(storageKey: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    const stored = getStoredGameState();
    if (stored[storageKey] !== undefined) {
      setValue(stored[storageKey] as T);
    }
  }, [storageKey]);

  useEffect(() => {
    const stored = getStoredGameState();
    stored[storageKey] = value as unknown;
    setStoredGameState(stored);
  }, [storageKey, value]);

  return [value, setValue] as const;
}
