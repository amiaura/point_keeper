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
  hearts: { [playerId: string]: number };
  queenCaptured: { [playerId: string]: boolean };
  scores: { [playerId: string]: number };
  shotMoonPlayerId: string | null;
}

interface HeartsState {
  players?: Player[];
  rounds?: Round[];
  winningPoints?: number;
  showSetup?: boolean;
}

export default function HeartsPage() {
  const { gameState, updateGameState } = useGameState();
  const heartsKey = 'hearts';

  const [players, setPlayers] = useState<Player[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [winningPoints, setWinningPoints] = useState(100);
  const [showSetup, setShowSetup] = useState(true);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [currentRoundHearts, setCurrentRoundHearts] = useState<{ [playerId: string]: string }>({});
  const [currentRoundQueen, setCurrentRoundQueen] = useState<{ [playerId: string]: boolean }>({});
  const [currentRoundShootMoon, setCurrentRoundShootMoon] = useState<{ [playerId: string]: boolean }>({});
  const [editingRoundId, setEditingRoundId] = useState<string | null>(null);
  const [editedRoundHearts, setEditedRoundHearts] = useState<{ [playerId: string]: string }>({});
  const [editedRoundQueen, setEditedRoundQueen] = useState<{ [playerId: string]: boolean }>({});
  const [editedRoundShootMoon, setEditedRoundShootMoon] = useState<{ [playerId: string]: boolean }>({});
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
    const savedData = gameState[heartsKey] as HeartsState | undefined;
    if (savedData) {
      setPlayers(savedData.players || []);
      setRounds(savedData.rounds || []);
      setWinningPoints(savedData.winningPoints || 100);
      setShowSetup(savedData.showSetup ?? true);
    }
  }, [gameState[heartsKey]]);

  useEffect(() => {
    updateGameState(heartsKey, {
      players,
      rounds,
      winningPoints,
      showSetup,
    });
  }, [players, rounds, winningPoints, showSetup]);

  useEffect(() => {
    const checkWinner = players.find((player) => player.totalScore >= winningPoints);
    if (checkWinner && (!winner || checkWinner.id !== winner.id)) {
      setWinner(checkWinner);
    } else if (!checkWinner && winner) {
      setWinner(null);
    }
  }, [players, winningPoints, winner]);

  const addPlayer = () => {
    if (!newPlayerName.trim()) return;

    const newPlayer: Player = {
      id: Date.now().toString() + Math.random().toString(),
      name: newPlayerName.trim(),
      totalScore: 0,
      rounds: [],
    };

    setPlayers([...players, newPlayer]);
    setCurrentRoundHearts({ ...currentRoundHearts, [newPlayer.id]: '' });
    setCurrentRoundQueen({ ...currentRoundQueen, [newPlayer.id]: false });
    setCurrentRoundShootMoon({ ...currentRoundShootMoon, [newPlayer.id]: false });
    setNewPlayerName('');
  };

  const removePlayer = (playerId: string) => {
    setPlayers(players.filter((player) => player.id !== playerId));
    setCurrentRoundHearts((current) => {
      const next = { ...current };
      delete next[playerId];
      return next;
    });
    setCurrentRoundQueen((current) => {
      const next = { ...current };
      delete next[playerId];
      return next;
    });
    setCurrentRoundShootMoon((current) => {
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

  const currentRoundShooterId = players.find((player) => currentRoundShootMoon[player.id])?.id;

  const calculateRoundScores = () => {
    const heartsCount: { [playerId: string]: number } = {};
    const queenCapture: { [playerId: string]: boolean } = {};
    const roundScores: { [playerId: string]: number } = {};

    players.forEach((player) => {
      if (currentRoundShootMoon[player.id]) {
        heartsCount[player.id] = 13;
        queenCapture[player.id] = true;
      } else {
        const heartValue = parseInt(currentRoundHearts[player.id] || '0', 10);
        heartsCount[player.id] = Number.isNaN(heartValue) ? 0 : heartValue;
        queenCapture[player.id] = Boolean(currentRoundQueen[player.id]);
      }
    });

    const shooterId = players.find((player) => currentRoundShootMoon[player.id])?.id
      ?? players.find((player) => heartsCount[player.id] === 13 && queenCapture[player.id])?.id
      ?? null;

    players.forEach((player) => {
      if (shooterId) {
        roundScores[player.id] = player.id === shooterId ? 0 : 26;
      } else {
        roundScores[player.id] = heartsCount[player.id] + (queenCapture[player.id] ? 13 : 0);
      }
    });

    return { heartsCount, queenCapture, roundScores, shooterId };
  };

  const addRound = () => {
    const { heartsCount, queenCapture, roundScores, shooterId } = calculateRoundScores();

    const valid = players.every((player) => {
      const score = heartsCount[player.id];
      return !Number.isNaN(score) && score >= 0 && score <= 13;
    });

    if (!valid) return;

    const newRound: Round = {
      id: Date.now().toString(),
      hearts: heartsCount,
      queenCaptured: queenCapture,
      scores: roundScores,
      shotMoonPlayerId: shooterId,
    };

    const updatedRounds = [...rounds, newRound];
    setRounds(updatedRounds);
    setPlayers(computePlayersFromRounds(updatedRounds, players));
    setCurrentRoundHearts({});
    setCurrentRoundQueen({});
    setCurrentRoundShootMoon({});
  };

  const startRoundEdit = (round: Round) => {
    setEditingRoundId(round.id);
    const heartsValues: { [playerId: string]: string } = {};
    const queenValues: { [playerId: string]: boolean } = {};
    const shootMoonValues: { [playerId: string]: boolean } = {};

    players.forEach((player) => {
      heartsValues[player.id] = String(round.hearts[player.id] ?? 0);
      queenValues[player.id] = round.queenCaptured[player.id] ?? false;
      shootMoonValues[player.id] = round.shotMoonPlayerId === player.id;
    });

    setEditedRoundHearts(heartsValues);
    setEditedRoundQueen(queenValues);
    setEditedRoundShootMoon(shootMoonValues);
  };

  const cancelRoundEdit = () => {
    setEditingRoundId(null);
    setEditedRoundHearts({});
    setEditedRoundQueen({});
    setEditedRoundShootMoon({});
  };

  const saveRoundEdit = (roundId: string) => {
    const heartsCount: { [playerId: string]: number } = {};
    const queenCapture: { [playerId: string]: boolean } = {};

    let valid = true;

    players.forEach((player) => {
      if (editedRoundShootMoon[player.id]) {
        heartsCount[player.id] = 13;
        queenCapture[player.id] = true;
        return;
      }

      const value = parseInt(editedRoundHearts[player.id] || '0', 10);
      if (Number.isNaN(value) || value < 0 || value > 13) {
        valid = false;
        return;
      }
      heartsCount[player.id] = value;
      queenCapture[player.id] = Boolean(editedRoundQueen[player.id]);
    });

    if (!valid) return;

    const shooterId = players.find((player) => editedRoundShootMoon[player.id])?.id
      ?? players.find((player) => heartsCount[player.id] === 13 && queenCapture[player.id])?.id
      ?? null;

    const roundScores: { [playerId: string]: number } = {};
    players.forEach((player) => {
      if (shooterId) {
        roundScores[player.id] = player.id === shooterId ? 0 : 26;
      } else {
        roundScores[player.id] = heartsCount[player.id] + (queenCapture[player.id] ? 13 : 0);
      }
    });

    const updatedRounds = rounds.map((round) =>
      round.id !== roundId
        ? round
        : {
            ...round,
            hearts: heartsCount,
            queenCaptured: queenCapture,
            scores: roundScores,
            shotMoonPlayerId: shooterId,
          }
    );

    setRounds(updatedRounds);
    setPlayers(computePlayersFromRounds(updatedRounds, players));
    cancelRoundEdit();
  };

  const resetGame = () => {
    setPlayers([]);
    setRounds([]);
    setShowSetup(true);
    setWinner(null);
    setCurrentRoundHearts({});
    setCurrentRoundQueen({});
  };

  const closeWinnerPopup = () => {
    setWinner(null);
  };

  if (showSetup) {
    return (
      <main className="page-container">
        <section className="section">
          <div className="setup-form">
            <h1>Hearts Setup</h1>
            <p>Enter players and set the point threshold for a losing score.</p>

            <div className="form-group">
              <label htmlFor="winningPoints">Points to end game:</label>
              <input
                id="winningPoints"
                type="number"
                value={winningPoints}
                onChange={(e) => setWinningPoints(parseInt(e.target.value, 10) || 100)}
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="playerName">Add player:</label>
              <div className="input-group">
                <input
                  id="playerName"
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                  placeholder="Enter player name"
                />
                <button onClick={addPlayer} className="button-secondary">Add</button>
              </div>
            </div>

            {players.length > 0 && (
              <div className="players-list">
                <h3>Current Players ({players.length})</h3>
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
          <h1>Hearts</h1>
          <div className="game-info">
            <span>End at: {winningPoints} points</span>
            <span>Round: {rounds.length + 1}</span>
          </div>
        </div>

        <div className="round-entry">
          <h3>Record Round</h3>
          <p className="help-text">
            Hearts are worth 1 point each. The Queen of Spades is worth 13 points. If a player shoots the moon (all 13 hearts + the Queen of Spades), that player scores 0 and every opponent receives 26 points.
          </p>
          <div className="round-inputs hearts-inputs">
            {players.map((player) => (
              <div key={player.id} className="form-group">
                <label htmlFor={`heart-${player.id}`}>{player.name}</label>
                <input
                  id={`heart-${player.id}`}
                  type="number"
                  min="0"
                  max="13"
                  value={currentRoundShootMoon[player.id] ? '' : currentRoundHearts[player.id] || ''}
                  onChange={(e) => setCurrentRoundHearts({
                    ...currentRoundHearts,
                    [player.id]: e.target.value,
                  })}
                  placeholder={currentRoundShootMoon[player.id] ? 'Moon' : 'Hearts'}
                  disabled={currentRoundShootMoon[player.id]}
                />
                <div className="checkbox-row">
                  <label className="checkbox-label small">
                    <input
                      type="checkbox"
                      checked={currentRoundQueen[player.id] || false}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setCurrentRoundQueen(() => {
                          return players.reduce((acc, item) => {
                            acc[item.id] = checked && item.id === player.id;
                            return acc;
                          }, {} as { [playerId: string]: boolean });
                        });
                      }}
                      disabled={Boolean(currentRoundShooterId)}
                    />
                    <span className="checkbox-chip">Queen</span>
                  </label>
                  <label className="checkbox-label shoot-label">
                    <input
                      type="checkbox"
                      checked={currentRoundShootMoon[player.id] || false}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setCurrentRoundShootMoon((current) => {
                          return players.reduce((acc, item) => {
                            acc[item.id] = item.id === player.id ? checked : false;
                            return acc;
                          }, {} as { [playerId: string]: boolean });
                        });
                        if (checked) {
                          setCurrentRoundQueen({});
                        }
                      }}
                    />
                    <span className="shoot-chip">Shoot the moon</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
          <button onClick={addRound} className="button-primary">Add Round</button>
        </div>

        {rounds.length > 0 && (
          <div className="score-table">
            <h3>Score History</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Round</th>
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
                      {players.map((player) => (
                        <td key={player.id} className={round.scores[player.id] >= 0 ? 'positive' : 'negative'}>
                          {editingRoundId === round.id ? (
                            <div className="edit-score-grid">
                              <input
                                type="number"
                                min="0"
                                max="13"
                                value={editedRoundHearts[player.id] ?? '0'}
                                onChange={(e) => setEditedRoundHearts({
                                  ...editedRoundHearts,
                                  [player.id]: e.target.value,
                                })}
                                className="editor-input"
                              />
                              <label className="checkbox-label small">
                                <input
                                  type="checkbox"
                                  checked={editedRoundQueen[player.id] || false}
                                  onChange={(e) => setEditedRoundQueen({
                                    ...editedRoundQueen,
                                    [player.id]: e.target.checked,
                                  })}
                                />
                                Q
                              </label>
                            </div>
                          ) : (
                            <>
                              {round.shotMoonPlayerId === player.id ? (
                                'Moon'
                              ) : (
                                <>
                                  {round.hearts[player.id]} ♥
                                  {round.queenCaptured[player.id] ? ' +Q' : ''}
                                </>
                              )}
                              <div>
                                <strong>{round.scores[player.id] > 0 ? '+' : ''}{round.scores[player.id]}</strong>
                              </div>
                            </>
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
                    {players.map((player) => (
                      <td key={player.id} className={player.totalScore >= winningPoints ? 'winner' : ''}>
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

        <div className="game-actions">
          <button onClick={() => setShowSetup(true)} className="button-secondary">
            Edit Setup
          </button>
          <button onClick={resetGame} className="button-secondary">
            New Game
          </button>
        </div>

      </section>

      {winner && (
        <div className="modal-overlay" onClick={closeWinnerPopup}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Game Over</h2>
            <p>{winner.name} has reached {winner.totalScore} points.</p>
            <button onClick={resetGame} className="button-primary">
              Start Over
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
