import React from 'react';
import '../styles/Card.css';

const Card = ({ card, onClick, disabled, playable, isSmall }) => {
  const getCardContent = () => {
    if (card.value === 'wild') return '🃏';
    if (card.value === 'wild4') return '+4';
    if (card.value === 'draw2') return '+2';
    if (card.value === 'skip') return '⊘';
    if (card.value === 'reverse') return '⇄';
    return card.value;
  };

  const getCardColor = () => {
    const colorMap = {
      red: '#e74c3c',
      blue: '#3498db',
      green: '#2ecc71',
      yellow: '#f39c12',
      black: '#2c3e50'
    };
    return colorMap[card.color] || '#95a5a6';
  };

  return (
    <div
      className={`uno-card ${isSmall ? 'small' : ''} ${playable ? 'playable' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={!disabled && onClick ? onClick : undefined}
      style={{
        backgroundColor: getCardColor(),
        borderColor: card.color === 'black' ? '#fff' : getCardColor()
      }}
    >
      <div className="card-corner top-left">{getCardContent()}</div>
      <div className="card-center">{getCardContent()}</div>
      <div className="card-corner bottom-right">{getCardContent()}</div>
      
      {card.type === 'wild' && (
        <div className="wild-indicator">
          <div className="wild-quarter" style={{backgroundColor: '#e74c3c'}}></div>
          <div className="wild-quarter" style={{backgroundColor: '#3498db'}}></div>
          <div className="wild-quarter" style={{backgroundColor: '#2ecc71'}}></div>
          <div className="wild-quarter" style={{backgroundColor: '#f39c12'}}></div>
        </div>
      )}
    </div>
  );
};

export default Card;
