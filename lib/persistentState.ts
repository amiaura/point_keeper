const STORAGE_KEY = 'point-keeper-game-state';

export type StoredGameState = Record<string, unknown>;

function isClient() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getStoredGameState(): StoredGameState {
  if (!isClient()) {
    return {};
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as StoredGameState;
  } catch {
    return {};
  }
}

export function setStoredGameState(state: StoredGameState) {
  if (!isClient()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearStoredGameState() {
  if (!isClient()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
