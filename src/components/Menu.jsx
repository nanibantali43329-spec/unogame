import React, { useState } from 'react';
import '../styles/Menu.css';

const Menu = ({ onCreateGame, onJoinGame, onFindMatch }) => {
  const [playerName, setPlayerName] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);

  const handleCreateGame = () => {
    if (playerName.trim()) {
      onCreateGame(playerName.trim());
    }
  };

  const handleJoinGame = () => {
    if (playerName.trim() && gameCode.trim()) {
      onJoinGame(gameCode.trim(), playerName.trim());
      setShowJoinModal(false);
    }
  };

  const handleFindMatch = () => {
    if (playerName.trim()) {
      onFindMatch(playerName.trim());
    }
  };

  return (
    <div className="menu-container">
      <div className="menu-card animate-slide-in">
        <div className="menu-header">
          <h1 className="game-title">🎴 UNO</h1>
          <p className="game-subtitle">Multiplayer Card Game</p>
        </div>

        <div className="menu-content">
          <div className="input-group">
            <label>Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
            />
          </div>

          <div className="menu-buttons">
            <button
              className="menu-button primary"
              onClick={handleCreateGame}
              disabled={!playerName.trim()}
            >
              <span className="button-icon">➕</span>
              <span>Create Game</span>
            </button>

            <button
              className="menu-button secondary"
              onClick={() => setShowJoinModal(true)}
              disabled={!playerName.trim()}
            >
              <span className="button-icon">🔗</span>
              <span>Join Game</span>
            </button>

            <button
              className="menu-button success"
              onClick={handleFindMatch}
              disabled={!playerName.trim()}
            >
              <span className="button-icon">🌐</span>
              <span>Find Match</span>
            </button>
          </div>

          <div className="menu-info">
            <div className="info-item">
              <span className="info-icon">🎯</span>
              <span>Classic UNO Rules</span>
            </div>
            <div className="info-item">
              <span className="info-icon">👥</span>
              <span>2-4 Players</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🌍</span>
              <span>Real-time Multiplayer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Join Game Modal */}
      {showJoinModal && (
        <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Join Game</h2>
            <div className="input-group">
              <label>Game Code</label>
              <input
                type="text"
                placeholder="Enter game code"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value)}
                autoFocus
              />
            </div>
            <div className="modal-buttons">
              <button className="modal-button cancel" onClick={() => setShowJoinModal(false)}>
                Cancel
              </button>
              <button
                className="modal-button confirm"
                onClick={handleJoinGame}
                disabled={!gameCode.trim()}
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
