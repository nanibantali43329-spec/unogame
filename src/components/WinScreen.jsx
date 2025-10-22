import React, { useEffect, useState } from 'react';
import '../styles/WinScreen.css';

const WinScreen = ({ winnerName, onBackToLobby }) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="win-screen-overlay">
      {/* Confetti animation */}
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
                backgroundColor: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12'][Math.floor(Math.random() * 4)]
              }}
            />
          ))}
        </div>
      )}

      {/* Win content */}
      <div className="win-content">
        {/* Trophy animation */}
        <div className="trophy-container">
          <div className="trophy">🏆</div>
          <div className="trophy-shine"></div>
        </div>

        {/* Winner announcement */}
        <div className="winner-announcement">
          <h1 className="winner-title">Victory!</h1>
          <div className="winner-name-container">
            <span className="winner-name">{winnerName}</span>
            <span className="winner-label">Wins!</span>
          </div>
        </div>

        {/* Floating cards */}
        <div className="floating-win-cards">
          <span className="win-card" style={{ animationDelay: '0s' }}>🎴</span>
          <span className="win-card" style={{ animationDelay: '0.2s' }}>🎴</span>
          <span className="win-card" style={{ animationDelay: '0.4s' }}>🎴</span>
        </div>

        {/* Back button */}
        <button className="back-to-lobby-button" onClick={onBackToLobby}>
          <span className="button-icon">🏠</span>
          <span>Back to Lobby</span>
        </button>
      </div>
    </div>
  );
};

export default WinScreen;
