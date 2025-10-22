import React, { useState } from 'react';
import '../styles/Lobby.css';

const Lobby = ({ game, userId, onReady, onStart, onLeave }) => {
  const [isReady, setIsReady] = useState(false);
  const isHost = game.host === userId;
  const players = Object.entries(game.players || {});
  const allReady = players.length >= 2 && players.every(([_, player]) => player.ready);

  const handleReadyToggle = () => {
    const newReady = !isReady;
    setIsReady(newReady);
    onReady(newReady);
  };

  const handleStart = () => {
    if (allReady) {
      onStart();
    }
  };

  return (
    <div className="lobby-container">
      <div className="lobby-card">
        <div className="lobby-header">
          <h1>🎴 UNO Game Lobby</h1>
          <div className="game-code">
            <span>Game Code:</span>
            <code>{game.id.substring(0, 8)}</code>
          </div>
        </div>

        <div className="players-section">
          <h2>Players ({players.length}/4)</h2>
          <div className="players-list">
            {players.map(([playerId, player]) => (
              <div key={playerId} className={`player-item ${player.ready ? 'ready' : ''}`}>
                <div className="player-avatar">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div className="player-details">
                  <div className="player-name">
                    {player.name}
                    {playerId === game.host && <span className="host-badge">👑 Host</span>}
                  </div>
                  <div className="player-status">
                    {player.ready ? '✅ Ready' : '⏳ Not Ready'}
                  </div>
                </div>
              </div>
            ))}
            
            {Array.from({ length: 4 - players.length }).map((_, i) => (
              <div key={`empty-${i}`} className="player-item empty">
                <div className="player-avatar empty">?</div>
                <div className="player-details">
                  <div className="player-name">Waiting for player...</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lobby-actions">
          <button
            className={`ready-button ${isReady ? 'ready' : ''}`}
            onClick={handleReadyToggle}
          >
            {isReady ? '✅ Ready!' : '⏳ Ready Up'}
          </button>

          {isHost && (
            <button
              className="start-button"
              onClick={handleStart}
              disabled={!allReady}
            >
              🎮 Start Game
            </button>
          )}

          <button className="leave-button" onClick={onLeave}>
            🚪 Leave Game
          </button>
        </div>

        <div className="lobby-info">
          <p>📌 Share the game code with friends to join!</p>
          <p>🎯 Need at least 2 players to start</p>
          <p>👥 Maximum 4 players</p>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
