'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
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
  callerTeam: 'team1' | 'team2';
  wentAlone: boolean;
  tricksCaller: number;
  pointsTeam1: number;
  pointsTeam2: number;
  trumpSuit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
}

interface EuchreState {
  players?: Player[];
  rounds?: Round[];
  showSetup?: boolean;
}

export default function EuchrePage() {
  const { gameState, updateGameState } = useGameState();
  const euchreKey = 'euchre';

  const [players, setPlayers] = useState<Player[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [showSetup, setShowSetup] = useState(true);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [callerTeam, setCallerTeam] = useState<'team1' | 'team2'>('team1');
  const [wentAlone, setWentAlone] = useState(false);
  const [tricksCaller, setTricksCaller] = useState('3');
  const [trumpSuit, setTrumpSuit] = useState<'hearts' | 'diamonds' | 'clubs' | 'spades'>('hearts');
  const [editingRoundId, setEditingRoundId] = useState<string | null>(null);
  const [editedRound, setEditedRound] = useState<{
    callerTeam: 'team1' | 'team2';
    wentAlone: boolean;
    tricksCaller: string;
    trumpSuit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  }>({ callerTeam: 'team1', wentAlone: false, tricksCaller: '3', trumpSuit: 'hearts' });
  const [winner, setWinner] = useState<'team1' | 'team2' | null>(null);

  const computePlayersFromRounds = (sourceRounds: Round[], sourcePlayers: Player[]) =>
    sourcePlayers.map((player, index) => {
      const teamKey = index % 2 === 0 ? 'team1' : 'team2';
      const playerRounds = sourceRounds.map((round) => round[teamKey === 'team1' ? 'pointsTeam1' : 'pointsTeam2']);
      const totalScore = playerRounds.reduce((sum, value) => sum + value, 0);
      return {
        ...player,
        totalScore,
        rounds: playerRounds,
      };
    });

  useEffect(() => {
    const savedData = gameState[euchreKey] as EuchreState | undefined;
    if (savedData) {
      setPlayers(savedData.players || []);
      setRounds(savedData.rounds || []);
      setShowSetup(savedData.showSetup ?? true);
    }
  }, [gameState[euchreKey]]);

  useEffect(() => {
    updateGameState(euchreKey, {
      players,
      rounds,
      showSetup,
    });
  }, [players, rounds, showSetup]);

  useEffect(() => {
    const team1Score = rounds.reduce((sum, round) => sum + round.pointsTeam1, 0);
    const team2Score = rounds.reduce((sum, round) => sum + round.pointsTeam2, 0);

    if (team1Score >= 10 || team2Score >= 10) {
      if (team1Score > team2Score) setWinner('team1');
      else if (team2Score > team1Score) setWinner('team2');
      else setWinner(null);
    } else {
      setWinner(null);
    }
  }, [rounds]);

  const team1Players = players.filter((_, index) => index % 2 === 0);
  const team2Players = players.filter((_, index) => index % 2 === 1);

  const addPlayer = () => {
    if (!newPlayerName.trim()) return;

    const newPlayer: Player = {
      id: Date.now().toString() + Math.random().toString(),
      name: newPlayerName.trim(),
      totalScore: 0,
      rounds: [],
    };

    setPlayers([...players, newPlayer]);
    setNewPlayerName('');
  };

  const removePlayer = (playerId: string) => {
    setPlayers(players.filter((player) => player.id !== playerId));
  };

  const startGame = () => {
    if (players.length === 4) {
      setShowSetup(false);
    }
  };

  const computeScore = (caller: 'team1' | 'team2', tricks: number, alone: boolean) => {
    const majority = tricks >= 3;
    const all = tricks === 5;
    const teamPoints = { team1: 0, team2: 0 };

    if (majority) {
      const points = all ? (alone ? 4 : 2) : 1;
      teamPoints[caller] = points;
    } else {
      teamPoints[caller === 'team1' ? 'team2' : 'team1'] = 2;
    }

    return teamPoints;
  };

  const addRound = () => {
    const tricks = parseInt(tricksCaller, 10);
    if (Number.isNaN(tricks) || tricks < 0 || tricks > 5) return;

    const { team1, team2 } = computeScore(callerTeam, tricks, wentAlone);

    const newRound: Round = {
      id: Date.now().toString(),
      callerTeam,
      wentAlone,
      tricksCaller: tricks,
      pointsTeam1: team1,
      pointsTeam2: team2,
      trumpSuit,
    };

    const updatedRounds = [...rounds, newRound];
    setRounds(updatedRounds);
    setPlayers(computePlayersFromRounds(updatedRounds, players));
    setCallerTeam('team1');
    setWentAlone(false);
    setTricksCaller('3');
  };

  const startRoundEdit = (round: Round) => {
    setEditingRoundId(round.id);
    setEditedRound({
      callerTeam: round.callerTeam,
      wentAlone: round.wentAlone,
      tricksCaller: String(round.tricksCaller),
      trumpSuit: round.trumpSuit,
    });
  };

  const cancelRoundEdit = () => {
    setEditingRoundId(null);
    setEditedRound({ callerTeam: 'team1', wentAlone: false, tricksCaller: '3', trumpSuit: 'hearts' });
  };

  const saveRoundEdit = (roundId: string) => {
    const tricks = parseInt(editedRound.tricksCaller, 10);
    if (Number.isNaN(tricks) || tricks < 0 || tricks > 5) return;

    const { team1, team2 } = computeScore(editedRound.callerTeam, tricks, editedRound.wentAlone);

    const updatedRounds = rounds.map((round) => {
      if (round.id !== roundId) return round;
      return {
        ...round,
        callerTeam: editedRound.callerTeam,
        wentAlone: editedRound.wentAlone,
        tricksCaller: tricks,
        pointsTeam1: team1,
        pointsTeam2: team2,
        trumpSuit: editedRound.trumpSuit,
      };
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
    setCallerTeam('team1');
    setWentAlone(false);
    setTricksCaller('3');
    setTrumpSuit('hearts');
  };

  if (showSetup) {
    return (
      <main className="page-container">
        <section className="section">
          <div className="setup-form">
            <h1>Euchre Setup</h1>
            <p className="help-text">
              Add exactly 4 players for standard Euchre. Players are paired across the table: 1 & 3 vs 2 & 4.
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
                disabled={players.length !== 4}
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

  const team1Score = rounds.reduce((sum, round) => sum + round.pointsTeam1, 0);
  const team2Score = rounds.reduce((sum, round) => sum + round.pointsTeam2, 0);
  const dealerName = players[rounds.length % players.length]?.name ?? 'Dealer';

  return (
    <main className="page-container">
      <section className="section">
        <div className="game-header">
          <h1>Euchre</h1>
          <div className="game-info">
            <span>Dealer: {dealerName}</span>
            <span>First to 10 points wins</span>
          </div>
        </div>

        <div className="round-entry">
          <h3>Record Hand</h3>
          <p className="help-text">
            Select which team called trump, how many tricks the calling team took, and whether they went alone.
          </p>
          <div className="form-group">
            <label>Calling team</label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <label className="shoot-label">
                <input
                  type="radio"
                  name="callerTeam"
                  checked={callerTeam === 'team1'}
                  onChange={() => setCallerTeam('team1')}
                />
                <span className="shoot-chip">Team 1 ({team1Players.map((p) => p.name).join(' & ')})</span>
              </label>
              <label className="shoot-label">
                <input
                  type="radio"
                  name="callerTeam"
                  checked={callerTeam === 'team2'}
                  onChange={() => setCallerTeam('team2')}
                />
                <span className="shoot-chip">Team 2 ({team2Players.map((p) => p.name).join(' & ')})</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tricksCaller">Tricks taken by calling team</label>
            <input
              id="tricksCaller"
              type="number"
              min="0"
              max="5"
              value={tricksCaller}
              onChange={(e) => setTricksCaller(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Trump suit</label>
            <select value={trumpSuit} onChange={(e) => setTrumpSuit(e.target.value as 'hearts' | 'diamonds' | 'clubs' | 'spades')} style={{ padding: '0.75rem 2.25rem 0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #d1d5db', fontSize: '1rem', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', backgroundImage: 'linear-gradient(45deg, transparent 50%, #334155 50%), linear-gradient(135deg, #334155 50%, transparent 50%)', backgroundPosition: 'calc(100% - 1rem) center, calc(100% - 0.7rem) center', backgroundSize: '0.45rem 0.45rem, 0.45rem 0.45rem', backgroundRepeat: 'no-repeat', backgroundColor: '#ffffff' }}>
              <option value="hearts">♥ Hearts</option>
              <option value="diamonds">♦ Diamonds</option>
              <option value="clubs">♣ Clubs</option>
              <option value="spades">♠ Spades</option>
            </select>
          </div>

          <div className="form-group">
            <label className="shoot-label">
              <input
                type="checkbox"
                checked={wentAlone}
                onChange={(e) => setWentAlone(e.target.checked)}
              />
              <span className="shoot-chip">Went alone</span>
            </label>
          </div>

          <div className="help-text">
            If the calling team takes 3 or 4 tricks, they earn 1 point. If they take all 5 tricks, they earn 2 points (4 points if alone). If they take fewer than 3 tricks, the defenders score 2 points.
            Stick the dealer and Farmer&apos;s Hand are optional rules you can apply manually.
          </div>

          <button onClick={addRound} className="button-primary" style={{ marginTop: '1.25rem' }}>Add Hand</button>
        </div>

        <div className="score-summary">
          <div className="score-card">
            <h3>Team 1</h3>
            <p>{team1Players.map((p) => p.name).join(' & ')}</p>
            <p className="score-value">{team1Score}</p>
          </div>
          <div className="score-card">
            <h3>Team 2</h3>
            <p>{team2Players.map((p) => p.name).join(' & ')}</p>
            <p className="score-value">{team2Score}</p>
          </div>
        </div>

        {rounds.length > 0 && (
          <div className="score-table">
            <h3>Hand History</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Hand</th>
                    <th>Caller</th>
                    <th>Trump</th>
                    <th>Tricks</th>
                    <th>Alone</th>
                    <th>Team 1</th>
                    <th>Team 2</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rounds.map((round, index) => (
                    <tr key={round.id}>
                      <td>{index + 1}</td>
                      <td>{round.callerTeam === 'team1' ? 'Team 1' : 'Team 2'}</td>
                      <td>{round.trumpSuit === 'hearts' ? '♥' : round.trumpSuit === 'diamonds' ? '♦' : round.trumpSuit === 'clubs' ? '♣' : '♠'}</td>
                      <td>{round.tricksCaller}</td>
                      <td>{round.wentAlone ? 'Yes' : 'No'}</td>
                      <td>{round.pointsTeam1}</td>
                      <td>{round.pointsTeam2}</td>
                      <td>
                        {editingRoundId === round.id ? (
                          <div className="edit-row">
                            <div className="form-group">
                              <label>Caller</label>
                              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <label className="shoot-label">
                                  <input
                                    type="radio"
                                    name="editCallerTeam"
                                    checked={editedRound.callerTeam === 'team1'}
                                    onChange={() => setEditedRound({ ...editedRound, callerTeam: 'team1' })}
                                  />
                                  <span className="shoot-chip">Team 1</span>
                                </label>
                                <label className="shoot-label">
                                  <input
                                    type="radio"
                                    name="editCallerTeam"
                                    checked={editedRound.callerTeam === 'team2'}
                                    onChange={() => setEditedRound({ ...editedRound, callerTeam: 'team2' })}
                                  />
                                  <span className="shoot-chip">Team 2</span>
                                </label>
                              </div>
                            </div>
                            <div className="form-group">
                              <label>Tricks</label>
                              <input
                                type="number"
                                min="0"
                                max="5"
                                value={editedRound.tricksCaller}
                                onChange={(e) => setEditedRound({ ...editedRound, tricksCaller: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>Trump</label>
                              <select value={editedRound.trumpSuit} onChange={(e) => setEditedRound({ ...editedRound, trumpSuit: e.target.value as 'hearts' | 'diamonds' | 'clubs' | 'spades' })} style={{ padding: '0.5rem 1.8rem 0.5rem 0.9rem', fontSize: '0.9rem', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', backgroundImage: 'linear-gradient(45deg, transparent 50%, #334155 50%), linear-gradient(135deg, #334155 50%, transparent 50%)', backgroundPosition: 'calc(100% - 0.9rem) center, calc(100% - 0.5rem) center', backgroundSize: '0.4rem 0.4rem, 0.4rem 0.4rem', backgroundRepeat: 'no-repeat', backgroundColor: '#ffffff' }}>
                                <option value="hearts">♥ Hearts</option>
                                <option value="diamonds">♦ Diamonds</option>
                                <option value="clubs">♣ Clubs</option>
                                <option value="spades">♠ Spades</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label className="shoot-label">
                                <input
                                  type="checkbox"
                                  checked={editedRound.wentAlone}
                                  onChange={(e) => setEditedRound({ ...editedRound, wentAlone: e.target.checked })}
                                />
                                <span className="shoot-chip">Alone</span>
                              </label>
                            </div>
                            <div className="action-buttons">
                              <button onClick={() => saveRoundEdit(round.id)} className="button-primary button-sm">Save</button>
                              <button onClick={cancelRoundEdit} className="button-secondary button-sm">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => startRoundEdit(round)} className="button-secondary button-sm">Edit</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {winner && (
          <WinnerModal
            title="Game Over"
            message={`${winner === 'team1' ? 'Team 1' : 'Team 2'} wins with ${winner === 'team1' ? team1Score : team2Score} points.`}
            actionLabel="New Game"
            onClose={() => setWinner(null)}
            onAction={resetGame}
          />
        )}

        <div className="setup-actions">
          <button onClick={resetGame} className="button-secondary">Reset Game</button>
          <button onClick={() => setShowSetup(true)} className="button-secondary">Back to Setup</button>
        </div>

        <div className="section">
          <p>
            <Link href="/">Back to home</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
