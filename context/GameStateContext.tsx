'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getStoredGameState, setStoredGameState, type StoredGameState } from '../lib/persistentState';

interface GameStateContextValue {
  gameState: StoredGameState;
  updateGameState: (slug: string, value: unknown) => void;
  clearGameState: () => void;
}

const GameStateContext = createContext<GameStateContextValue | undefined>(undefined);

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<StoredGameState>({});

  useEffect(() => {
    setGameState(getStoredGameState());
  }, []);

  useEffect(() => {
    setStoredGameState(gameState);
  }, [gameState]);

  const updateGameState = (slug: string, value: unknown) => {
    setGameState((current) => ({
      ...current,
      [slug]: value,
    }));
  };

  const clearGameState = () => {
    setGameState({});
  };

  return (
    <GameStateContext.Provider value={{ gameState, updateGameState, clearGameState }}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within GameStateProvider');
  }
  return context;
}
