import React, { useState, useEffect } from 'react';
import '../styles/Intro.css';

const Intro = ({ onComplete }) => {
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationStage(1), 100);
    const timer2 = setTimeout(() => setAnimationStage(2), 800);
    const timer3 = setTimeout(() => setAnimationStage(3), 1600);
    const timer4 = setTimeout(() => onComplete(), 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className={`intro-overlay ${animationStage === 3 ? 'fade-out' : ''}`}>
      <div className="intro-content">
        {/* Floating cards background */}
        <div className="floating-cards">
          <div className="card-float red" style={{ animationDelay: '0s' }}>🎴</div>
          <div className="card-float blue" style={{ animationDelay: '0.2s' }}>🎴</div>
          <div className="card-float green" style={{ animationDelay: '0.4s' }}>🎴</div>
          <div className="card-float yellow" style={{ animationDelay: '0.6s' }}>🎴</div>
          <div className="card-float red" style={{ animationDelay: '0.8s' }}>🎴</div>
          <div className="card-float blue" style={{ animationDelay: '1s' }}>🎴</div>
        </div>

        {/* Main title */}
        <div className={`intro-title ${animationStage >= 1 ? 'show' : ''}`}>
          <div className="title-cards">
            <span className="card-icon bounce" style={{ animationDelay: '0s' }}>🎴</span>
            <span className="card-icon bounce" style={{ animationDelay: '0.1s' }}>🎴</span>
            <span className="card-icon bounce" style={{ animationDelay: '0.2s' }}>🎴</span>
          </div>
          <h1 className="main-title">
            <span className="letter" style={{ animationDelay: '0.1s' }}>U</span>
            <span className="letter" style={{ animationDelay: '0.2s' }}>N</span>
            <span className="letter" style={{ animationDelay: '0.3s' }}>O</span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className={`intro-subtitle ${animationStage >= 2 ? 'show' : ''}`}>
          <p className="subtitle-text">Multiplayer Card Game</p>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
