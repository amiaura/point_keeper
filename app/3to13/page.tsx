'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useGameState } from '../../context/GameStateContext';
import WinnerModal from '../../components/WinnerModal';

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

interface ThreeToThirteenState {
  players?: Player[];
  rounds?: Round[];
  showSetup?: boolean;
}

const roundDefinitions = [
  { label: '3 Cards', wild: '3s and Jokers', description: 'Deal 3 cards. 3s and jokers are wild. Count points for remaining cards not included in any set.' },
  { label: '4 Cards', wild: '4s and Jokers', description: 'Deal 4 cards. 4s and jokers are wild. Count points for remaining cards not included in any set.' },
  { label: '5 Cards', wild: '5s and Jokers', description: 'Deal 5 cards. 5s and jokers are wild. Count points for remaining cards not included in any set.' },
  { label: '6 Cards', wild: '6s and Jokers', description: 'Deal 6 cards. 6s and jokers are wild. Count points for remaining cards not included in any set.' },
  { label: '7 Cards', wild: '7s and Jokers', description: 'Deal 7 cards. 7s and jokers are wild. Count points for remaining cards not included in any set.' },
  { label: '8 Cards', wild: '8s and Jokers', description: 'Deal 8 cards. 8s and jokers are wild. Count points for remaining cards not included in any set.' },
  { label: '9 Cards', wild: '9s and Jokers', description: 'Deal 9 cards. 9s and jokers are wild. Count points for remaining cards not included in any set.' },
  { label: '10 Cards', wild: '10s and Jokers', description: 'Deal 10 cards. 10s and jokers are wild. Count points for remaining cards not included in any set.' },
  { label: '11 Cards', wild: 'Jacks and Jokers', description: 'Deal 11 cards. Jacks and jokers are wild. Count points for remaining cards not included in any set.' },
  { label: '12 Cards', wild: 'Queens and Jokers', description: 'Deal 12 cards. Queens and jokers are wild. Count points for remaining cards not included in any set.' },
  { label: '13 Cards', wild: 'Kings and Jokers', description: 'Deal 13 cards. Kings and jokers are wild. Count points for remaining cards not included in any set.' },
];

export default function ThreeToThirteenPage() {
  const { gameState, updateGameState } = useGameState();
  const pageKey = 'threeToThirteen';

  const [players, setPlayers] = useState<Player[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [showSetup, setShowSetup] = useState(true);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [currentRoundScores, setCurrentRoundScores] = useState<{ [playerId: string]: string }>({});
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
    const savedData = gameState[pageKey] as ThreeToThirteenState | undefined;
    if (savedData) {
      setPlayers(savedData.players || []);
      setRounds(savedData.rounds || []);
      setShowSetup(savedData.showSetup ?? true);
    }
  }, [gameState[pageKey]]);

  useEffect(() => {
    updateGameState(pageKey, {
      players,
      rounds,
      showSetup,
    });
  }, [players, rounds, showSetup]);

  useEffect(() => {
    if (rounds.length < roundDefinitions.length) {
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
  const currentRound = roundDefinitions[currentRoundIndex];

  const addPlayer = () => {
    if (!newPlayerName.trim()) return;

    const newPlayer: Player = {
      id: Date.now().toString() + Math.random().toString(),
      name: newPlayerName.trim(),
      totalScore: 0,
      rounds: [],
    };

    setPlayers([...players, newPlayer]);
    setCurrentRoundScores({ ...currentRoundScores, [newPlayer.id]: '' });
    setNewPlayerName('');
  };

  const removePlayer = (playerId: string) => {
    setPlayers(players.filter((player) => player.id !== playerId));
    setCurrentRoundScores((current) => {
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
    if (!currentRound) return;
    if (rounds.length >= roundDefinitions.length) return;

    const roundScores: { [playerId: string]: number } = {};
    let valid = true;

    players.forEach((player) => {
      const value = parseInt(currentRoundScores[player.id] || '0', 10);
      if (Number.isNaN(value) || value < 0) {
        valid = false;
        return;
      }
      roundScores[player.id] = value;
    });

    if (!valid) return;

    const newRound: Round = {
      id: Date.now().toString(),
      scores: roundScores,
    };

    const updatedRounds = [...rounds, newRound];
    setRounds(updatedRounds);
    setPlayers(computePlayersFromRounds(updatedRounds, players));
    setCurrentRoundScores({});
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
    setCurrentRoundScores({});
  };

  if (showSetup) {
    return (
      <main className="page-container">
        <section className="section">
          <div className="setup-form">
            <h1>3 to 13 Setup</h1>
            <p className="help-text">
              Add 2–8 players, then record each round&apos;s deadwood penalty totals. The game uses 13 rounds, with wild cards changing each round.
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
          <h1>3 to 13</h1>
          <div className="game-info">
            <span>Round: {Math.min(rounds.length + 1, roundDefinitions.length)} / {roundDefinitions.length}</span>
            <span>Lowest score wins</span>
          </div>
        </div>

        {currentRound ? (
          <div className="round-entry">
            <h3>{currentRound.label}</h3>
            <p className="help-text">{currentRound.description}</p>
            <p className="help-text"><strong>Wild card:</strong> {currentRound.wild}</p>
            <div className="round-inputs hearts-inputs">
              {players.map((player) => (
                <div key={player.id} className="form-group">
                  <label htmlFor={`score-${player.id}`}>{player.name}</label>
                  <input
                    id={`score-${player.id}`}
                    type="number"
                    min="0"
                    value={currentRoundScores[player.id] || ''}
                    onChange={(e) => setCurrentRoundScores({
                      ...currentRoundScores,
                      [player.id]: e.target.value,
                    })}
                    placeholder="Penalty points"
                  />
                </div>
              ))}
            </div>
            <button onClick={addRound} className="button-primary" disabled={rounds.length >= roundDefinitions.length}>
              Add Round
            </button>
          </div>
        ) : (
          <div className="banner">
            <strong>All 13 rounds recorded.</strong> Final totals are shown below.
          </div>
        )}

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

        {winner && rounds.length >= roundDefinitions.length && (
          <WinnerModal
            title="Game Over"
            message={`Lowest total wins: ${winner.name} with ${winner.totalScore} points.`}
            actionLabel="New Game"
            onClose={() => setWinner(null)}
            onAction={resetGame}
          />
        )}

        <div className="section">
          <p>
            <Link href="/">Back to home</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
