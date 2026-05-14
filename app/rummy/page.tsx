'use client';

import { useState, useEffect } from 'react';
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

interface RummyState {
  players?: Player[];
  rounds?: Round[];
  winningPoints?: number;
  showSetup?: boolean;
}

export default function RummyPage() {
  const { gameState, updateGameState } = useGameState();
  const rummyKey = 'rummy';

  const [players, setPlayers] = useState<Player[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [winningPoints, setWinningPoints] = useState<number>(500);
  const [showSetup, setShowSetup] = useState<boolean>(true);
  const [newPlayerName, setNewPlayerName] = useState<string>('');
  const [currentRoundScores, setCurrentRoundScores] = useState<{ [playerId: string]: string }>({});
  const [editingRoundId, setEditingRoundId] = useState<string | null>(null);
  const [editedRoundScores, setEditedRoundScores] = useState<{ [playerId: string]: string }>({});
  const [winner, setWinner] = useState<Player | null>(null);

  const computePlayersFromRounds = (sourceRounds: Round[], sourcePlayers: Player[]) =>
    sourcePlayers.map(player => {
      const playerRounds = sourceRounds.map(round => round.scores[player.id] ?? 0);
      const totalScore = playerRounds.reduce((sum, value) => sum + value, 0);
      return {
        ...player,
        totalScore,
        rounds: playerRounds,
      };
    });

  // Load saved state
  useEffect(() => {
    const savedData = gameState[rummyKey] as RummyState | undefined;
    if (savedData) {
      setPlayers(savedData.players || []);
      setRounds(savedData.rounds || []);
      setWinningPoints(savedData.winningPoints || 500);
      setShowSetup(savedData.showSetup ?? true);
    }
  }, [gameState[rummyKey]]);

  // Save state
  useEffect(() => {
    updateGameState(rummyKey, {
      players,
      rounds,
      winningPoints,
      showSetup,
    });
  }, [players, rounds, winningPoints, showSetup]);

  // Check for winner
  useEffect(() => {
    const checkWinner = players.find(player => player.totalScore >= winningPoints);
    if (checkWinner && (!winner || checkWinner.id !== winner.id)) {
      setWinner(checkWinner);
    } else if (!checkWinner && winner) {
      setWinner(null);
    }
  }, [players, winningPoints, winner]);

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer: Player = {
        id: Date.now().toString() + Math.random().toString(),
        name: newPlayerName.trim(),
        totalScore: 0,
        rounds: [],
      };
      setPlayers([...players, newPlayer]);
      setCurrentRoundScores({ ...currentRoundScores, [newPlayer.id]: '' });
      setNewPlayerName('');
    }
  };

  const removePlayer = (playerId: string) => {
    setPlayers(players.filter(p => p.id !== playerId));
    const newScores = { ...currentRoundScores };
    delete newScores[playerId];
    setCurrentRoundScores(newScores);
  };

  const startGame = () => {
    if (players.length > 0) {
      setShowSetup(false);
    }
  };

  const addRound = () => {
    const roundScores: { [playerId: string]: number } = {};
    let validRound = true;

    players.forEach(player => {
      const score = parseInt(currentRoundScores[player.id] || '0');
      if (isNaN(score)) {
        validRound = false;
        return;
      }
      roundScores[player.id] = score;
    });

    if (!validRound) return;

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
    players.forEach(player => {
      nextScores[player.id] = String(round.scores[player.id] ?? 0);
    });
    setEditedRoundScores(nextScores);
  };

  const cancelRoundEdit = () => {
    setEditingRoundId(null);
    setEditedRoundScores({});
  };

  const saveRoundEdit = (roundId: string) => {
    const updatedRounds = rounds.map(round => {
      if (round.id !== roundId) return round;
      const scores: { [playerId: string]: number } = {};
      let valid = true;

      players.forEach(player => {
        const parsed = parseInt(editedRoundScores[player.id] || '0');
        if (isNaN(parsed)) {
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
    setCurrentRoundScores({});
  };

  const closeWinnerPopup = () => {
    setWinner(null);
  };

  if (showSetup) {
    return (
      <main className="page-container">
        <section className="section">
          <div className="setup-form">
            <h1>Rummy Setup</h1>

            <div className="form-group">
              <label htmlFor="winningPoints">Points to win:</label>
              <input
                id="winningPoints"
                type="number"
                value={winningPoints}
                onChange={(e) => setWinningPoints(parseInt(e.target.value) || 500)}
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
                  onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                  placeholder="Enter player name"
                />
                <button onClick={addPlayer} className="button-secondary">Add</button>
              </div>
            </div>

            {players.length > 0 && (
              <div className="players-list">
                <h3>Current Players ({players.length})</h3>
                <div className="players-grid">
                  {players.map(player => (
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
          <h1>Rummy</h1>
          <div className="game-info">
            <span>Target: {winningPoints} points</span>
            <span>Round: {rounds.length + 1}</span>
          </div>
        </div>

        <div className="round-entry">
          <h3>Add Round Scores</h3>
          <div className="round-inputs">
            {players.map(player => (
              <div key={player.id} className="form-group">
                <label htmlFor={`score-${player.id}`}>{player.name}:</label>
                <input
                  id={`score-${player.id}`}
                  type="number"
                  value={currentRoundScores[player.id] || ''}
                  onChange={(e) => setCurrentRoundScores({
                    ...currentRoundScores,
                    [player.id]: e.target.value
                  })}
                  placeholder="Points"
                />
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
                    {players.map(player => (
                      <th key={player.id}>{player.name}</th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rounds.map((round, index) => (
                    <tr key={round.id}>
                      <td>{index + 1}</td>
                      {players.map(player => (
                        <td key={player.id} className={round.scores[player.id] >= 0 ? 'positive' : 'negative'}>
                          {editingRoundId === round.id ? (
                            <input
                              type="number"
                              value={editedRoundScores[player.id] ?? '0'}
                              onChange={(e) => setEditedRoundScores({
                                ...editedRoundScores,
                                [player.id]: e.target.value,
                              })}
                              className="editor-input"
                            />
                          ) : (
                            <>{round.scores[player.id] > 0 ? '+' : ''}{round.scores[player.id]}</>
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
                    {players.map(player => (
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
            <h2>🎉 New Game</h2>
            <p>{winner.name} has reached {winner.totalScore} points!</p>
            <button onClick={resetGame} className="button-primary">
              New Game
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
