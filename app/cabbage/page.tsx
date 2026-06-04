'use client';

import { useEffect, useState } from 'react';
import { useGameState } from '../../context/GameStateContext';

interface Player {
  id: string;
  name: string;
  totalScore: number;
  rounds: number[];
}

interface Round {
  id: string;
  scores: { [playerId: string]: number };
}

interface CabbageState {
  players?: Player[];
  rounds?: Round[];
  showSetup?: boolean;
}

const roundDefinitions = [
  {
    label: 'Tricks',
    description: 'Enter the number of tricks taken; each trick is worth 10 penalty points.',
    placeholder: 'Tricks taken',
    multiplier: 10,
    binary: false,
  },
  {
    label: 'Hearts',
    description: 'Enter the number of hearts captured; each heart is worth 10 penalty points.',
    placeholder: 'Hearts captured',
    multiplier: 10,
    binary: false,
  },
  {
    label: 'Queens',
    description: 'Enter the number of queens captured; each queen is worth 25 penalty points.',
    placeholder: 'Queens captured',
    multiplier: 25,
    binary: false,
  },
  {
    label: 'King of Spades',
    description: 'Enter 1 if you captured the king of spades; it is worth 100 penalty points.',
    placeholder: '0 or 1',
    multiplier: 100,
    binary: true,
  },
  {
    label: 'Last Trick',
    description: 'Enter 1 if you took the last trick; it is worth 100 penalty points.',
    placeholder: '0 or 1',
    multiplier: 100,
    binary: true,
  },
  {
    label: 'Additional Penalties',
    description: 'Enter any additional penalty points for this round directly.',
    placeholder: 'Penalty points',
    multiplier: 1,
    binary: false,
  },
];

export default function CabbagePage() {
  const { gameState, updateGameState } = useGameState();
  const cabbageKey = 'cabbage';

  const [players, setPlayers] = useState<Player[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [showSetup, setShowSetup] = useState(true);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [currentRoundValues, setCurrentRoundValues] = useState<{ [playerId: string]: string }>({});
  const [editingRoundId, setEditingRoundId] = useState<string | null>(null);
  const [editedRoundScores, setEditedRoundScores] = useState<{ [playerId: string]: string }>({});
  const [winner, setWinner] = useState<Player | null>(null);

  const computePlayersFromRounds = (sourceRounds: Round[], sourcePlayers: Player[]) =>
    sourcePlayers.map((player) => {
      const playerRounds = sourceRounds.map((round) => round.scores[player.id] ?? 0);
      const totalScore = playerRounds.reduce((sum, value) => sum + value, 0);
      return {
        ...player,
        totalScore,
        rounds: playerRounds,
      };
    });

  useEffect(() => {
    const savedData = gameState[cabbageKey] as CabbageState | undefined;
    if (savedData) {
      setPlayers(savedData.players || []);
      setRounds(savedData.rounds || []);
      setShowSetup(savedData.showSetup ?? true);
    }
  }, [gameState[cabbageKey]]);

  useEffect(() => {
    updateGameState(cabbageKey, {
      players,
      rounds,
      showSetup,
    });
  }, [players, rounds, showSetup]);

  useEffect(() => {
    if (rounds.length < 6) {
      setWinner(null);
      return;
    }

    const lowest = players.reduce((best, player) => {
      if (!best || player.totalScore < best.totalScore) return player;
      return best;
    }, players[0]);

    setWinner(lowest || null);
  }, [players, rounds]);

  const currentRoundIndex = rounds.length;
  const currentRoundDefinition = roundDefinitions[currentRoundIndex];

  const addPlayer = () => {
    if (!newPlayerName.trim()) return;

    const newPlayer: Player = {
      id: Date.now().toString() + Math.random().toString(),
      name: newPlayerName.trim(),
      totalScore: 0,
      rounds: [],
    };

    setPlayers([...players, newPlayer]);
    setCurrentRoundValues({ ...currentRoundValues, [newPlayer.id]: '' });
    setNewPlayerName('');
  };

  const removePlayer = (playerId: string) => {
    setPlayers(players.filter((player) => player.id !== playerId));
    setCurrentRoundValues((current) => {
      const next = { ...current };
      delete next[playerId];
      return next;
    });
  };

  const startGame = () => {
    if (players.length > 0) {
      setShowSetup(false);
    }
  };

  const addRound = () => {
    if (rounds.length >= roundDefinitions.length) return;
    if (!currentRoundDefinition) return;

    const roundScores: { [playerId: string]: number } = {};
    let valid = true;

    players.forEach((player) => {
      const rawValue = currentRoundValues[player.id] ?? '0';
      const value = parseInt(rawValue, 10);
      if (Number.isNaN(value) || value < 0) {
        valid = false;
        return;
      }
      if (currentRoundDefinition.binary && value !== 0 && value !== 1) {
        valid = false;
        return;
      }

      roundScores[player.id] = value * currentRoundDefinition.multiplier;
    });

    if (!valid) return;

    const newRound: Round = {
      id: Date.now().toString(),
      scores: roundScores,
    };

    const updatedRounds = [...rounds, newRound];
    setRounds(updatedRounds);
    setPlayers(computePlayersFromRounds(updatedRounds, players));
    setCurrentRoundValues({});
  };

  const startRoundEdit = (round: Round) => {
    setEditingRoundId(round.id);
    const nextScores: { [playerId: string]: string } = {};
    players.forEach((player) => {
      nextScores[player.id] = String(round.scores[player.id] ?? 0);
    });
    setEditedRoundScores(nextScores);
  };

  const cancelRoundEdit = () => {
    setEditingRoundId(null);
    setEditedRoundScores({});
  };

  const saveRoundEdit = (roundId: string) => {
    const updatedRounds = rounds.map((round) => {
      if (round.id !== roundId) return round;

      const scores: { [playerId: string]: number } = {};
      let valid = true;

      players.forEach((player) => {
        const parsed = parseInt(editedRoundScores[player.id] || '0', 10);
        if (Number.isNaN(parsed) || parsed < 0) {
          valid = false;
          return;
        }
        scores[player.id] = parsed;
      });

      if (!valid) return round;
      return { ...round, scores };
    });

    setRounds(updatedRounds);
    setPlayers(computePlayersFromRounds(updatedRounds, players));
    cancelRoundEdit();
  };

  const resetGame = () => {
    setPlayers([]);
    setRounds([]);
    setShowSetup(true);
    setWinner(null);
    setNewPlayerName('');
    setCurrentRoundValues({});
  };

  if (showSetup) {
    return (
      <main className="page-container">
        <section className="section">
          <div className="setup-form">
            <h1>Cabbage Setup</h1>
            <p className="help-text">
              Deal all cards, set the blind aside, and play exactly six rounds. The player with the lowest total score wins.
            </p>

            <div className="form-group">
              <label htmlFor="playerName">Add player:</label>
              <div className="input-group">
                <input
                  id="playerName"
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                  placeholder="Enter player name"
                />
                <button onClick={addPlayer} className="button-secondary">Add</button>
              </div>
            </div>

            {players.length > 0 && (
              <div className="players-list">
                <h3>Players ({players.length})</h3>
                <div className="players-grid">
                  {players.map((player) => (
                    <div key={player.id} className="player-card">
                      <span className="player-name">{player.name}</span>
                      <button
                        onClick={() => removePlayer(player.id)}
                        className="remove-player-btn"
                        aria-label={`Remove ${player.name}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="setup-actions">
              <button
                onClick={startGame}
                disabled={players.length === 0}
                className="button-primary"
              >
                Start Game
              </button>
              <button onClick={resetGame} className="button-secondary">
                Reset
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-container">
      <section className="section">
        <div className="game-header">
          <h1>Cabbage</h1>
          <div className="game-info">
            <span>Round: {Math.min(rounds.length + 1, 6)} / 6</span>
            <span>Lowest score wins</span>
          </div>
        </div>

        <div className="round-entry">
          <h3>Record Round</h3>
          <p className="help-text">
            {currentRoundDefinition?.description ?? 'Enter the round values and the app will calculate each player score.'}
          </p>
          <div className="round-inputs hearts-inputs">
            {players.map((player) => (
              <div key={player.id} className="form-group">
                <label htmlFor={`score-${player.id}`}>{player.name}</label>
                <input
                  id={`score-${player.id}`}
                  type="number"
                  min="0"
                  max={currentRoundDefinition?.binary ? 1 : undefined}
                  value={currentRoundValues[player.id] || ''}
                  onChange={(e) => setCurrentRoundValues({
                    ...currentRoundValues,
                    [player.id]: e.target.value,
                  })}
                  placeholder={currentRoundDefinition?.placeholder ?? 'Value'}
                />
              </div>
            ))}
          </div>
          <button onClick={addRound} className="button-primary" disabled={rounds.length >= roundDefinitions.length}>
            Add Round
          </button>
        </div>

        {rounds.length > 0 && (
          <div className="score-table">
            <h3>Score History</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Round</th>
                    <th>Type</th>
                    {players.map((player) => (
                      <th key={player.id}>{player.name}</th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rounds.map((round, index) => (
                    <tr key={round.id}>
                      <td>{index + 1}</td>
                      <td>{roundDefinitions[index]?.label ?? `Round ${index + 1}`}</td>
                      {players.map((player) => (
                        <td key={player.id} className={round.scores[player.id] >= 0 ? 'positive' : 'negative'}>
                          {editingRoundId === round.id ? (
                            <input
                              type="number"
                              min="0"
                              value={editedRoundScores[player.id] ?? '0'}
                              onChange={(e) => setEditedRoundScores({
                                ...editedRoundScores,
                                [player.id]: e.target.value,
                              })}
                              className="editor-input"
                            />
                          ) : (
                            <strong>{round.scores[player.id]}</strong>
                          )}
                        </td>
                      ))}
                      <td>
                        {editingRoundId === round.id ? (
                          <div className="action-buttons">
                            <button onClick={() => saveRoundEdit(round.id)} className="button-primary button-sm">
                              Save
                            </button>
                            <button onClick={cancelRoundEdit} className="button-secondary button-sm">
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => startRoundEdit(round)} className="button-secondary button-sm">
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr className="totals-row">
                    <td><strong>Total</strong></td>
                    <td />
                    {players.map((player) => (
                      <td key={player.id} className={winner && player.id === winner.id ? 'winner' : ''}>
                        <strong>{player.totalScore}</strong>
                      </td>
                    ))}
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {winner && rounds.length >= 6 && (
          <div className="banner">
            <strong>Game over.</strong> Lowest total wins: {winner.name} with {winner.totalScore} points.
          </div>
        )}
      </section>
    </main>
  );
}
