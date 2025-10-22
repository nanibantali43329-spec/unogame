import React, { useState, useEffect } from 'react';
import Card from './Card';
import WinScreen from './WinScreen';
import { playCard, drawCard, canPlayCard, COLORS } from '../gameLogic';
import '../styles/GameBoard.css';

const GameBoard = ({ game, userId, onUpdateGame, onBackToLobby }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [message, setMessage] = useState('');

  const playerIds = Object.keys(game.gameState.hands);
  const currentPlayerIndex = game.gameState.currentPlayer;
  const currentPlayerId = playerIds[currentPlayerIndex];
  const isMyTurn = currentPlayerId === userId;
  const myHand = game.gameState.hands[userId] || [];
  const topCard = game.gameState.discardPile[game.gameState.discardPile.length - 1];

  useEffect(() => {
    if (game.gameState.winner) {
      const winnerName = game.players[game.gameState.winner]?.name || 'Unknown';
      setMessage(`🎉 ${winnerName} wins! 🎉`);
    } else if (isMyTurn) {
      setMessage("Your turn! Play a card or draw.");
    } else {
      const currentPlayerName = game.players[currentPlayerId]?.name || 'Unknown';
      setMessage(`Waiting for ${currentPlayerName}...`);
    }
  }, [isMyTurn, currentPlayerId, game.players, game.gameState.winner]);

  const handleCardClick = (cardIndex) => {
    if (!isMyTurn || game.gameState.winner) return;

    const card = myHand[cardIndex];
    if (!canPlayCard(card, topCard, game.gameState.currentColor)) {
      setMessage("❌ Can't play this card!");
      setTimeout(() => setMessage("Your turn! Play a card or draw."), 2000);
      return;
    }

    if (card.type === 'wild') {
      setSelectedCard(cardIndex);
      setShowColorPicker(true);
    } else {
      handlePlayCard(cardIndex);
    }
  };

  const handlePlayCard = async (cardIndex, chosenColor = null) => {
    try {
      const newState = playCard(game.gameState, userId, cardIndex, chosenColor);
      await onUpdateGame(newState);
      setSelectedCard(null);
      setShowColorPicker(false);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
      setTimeout(() => setMessage("Your turn! Play a card or draw."), 2000);
    }
  };

  const handleDrawCard = async () => {
    if (!isMyTurn || game.gameState.winner) return;

    try {
      const newState = drawCard(game.gameState, userId);
      await onUpdateGame(newState);
      setMessage("Card drawn!");
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  const handleColorChoice = (color) => {
    if (selectedCard !== null) {
      handlePlayCard(selectedCard, color);
    }
  };

  const getPlayerPosition = (index) => {
    const positions = ['bottom', 'left', 'top', 'right'];
    const myIndex = playerIds.indexOf(userId);
    const relativeIndex = (index - myIndex + playerIds.length) % playerIds.length;
    return positions[relativeIndex] || 'bottom';
  };

  // Show win screen if there's a winner
  if (game.gameState.winner) {
    const winnerName = game.players[game.gameState.winner]?.name || 'Unknown';
    return <WinScreen winnerName={winnerName} onBackToLobby={onBackToLobby} />;
  }

  return (
    <div className="game-board">
      <div className="game-info">
        <div className="game-message">{message}</div>
        <div className="game-stats">
          <div className="stat">
            <span>🎴 Deck:</span> {game.gameState.deck.length}
          </div>
          <div className="stat">
            <span>🎯 Current:</span> 
            <span style={{
              color: game.gameState.currentColor === 'red' ? '#e74c3c' :
                     game.gameState.currentColor === 'blue' ? '#3498db' :
                     game.gameState.currentColor === 'green' ? '#2ecc71' :
                     game.gameState.currentColor === 'yellow' ? '#f39c12' : '#fff',
              fontWeight: 'bold',
              marginLeft: '5px'
            }}>
              {game.gameState.currentColor.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Other Players */}
      {playerIds.map((playerId, index) => {
        if (playerId === userId) return null;
        const player = game.players[playerId];
        const position = getPlayerPosition(index);
        const hand = game.gameState.hands[playerId] || [];
        const isCurrent = currentPlayerId === playerId;

        return (
          <div key={playerId} className={`player-area ${position} ${isCurrent ? 'current-player' : ''}`}>
            <div className="player-info">
              <div className="player-name">{player.name}</div>
              <div className="player-cards">🎴 {hand.length}</div>
            </div>
            <div className="player-hand-preview">
              {hand.map((_, i) => (
                <div key={i} className="card-back"></div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Center - Discard Pile */}
      <div className="center-area">
        <div className="discard-pile">
          {topCard && <Card card={topCard} disabled />}
        </div>
        <button 
          className="draw-button"
          onClick={handleDrawCard}
          disabled={!isMyTurn || game.gameState.winner}
        >
          <div className="card-back deck-icon"></div>
          <span>DRAW</span>
        </button>
      </div>

      {/* My Hand */}
      <div className={`my-hand ${isMyTurn ? 'my-turn' : ''}`}>
        <div className="hand-cards">
          {myHand.map((card, index) => (
            <Card
              key={index}
              card={card}
              onClick={() => handleCardClick(index)}
              disabled={!isMyTurn || game.gameState.winner}
              playable={isMyTurn && canPlayCard(card, topCard, game.gameState.currentColor)}
            />
          ))}
        </div>
      </div>

      {/* Color Picker Modal */}
      {showColorPicker && (
        <div className="color-picker-overlay" onClick={() => setShowColorPicker(false)}>
          <div className="color-picker" onClick={(e) => e.stopPropagation()}>
            <h3>Choose a color</h3>
            <div className="color-options">
              {COLORS.map(color => (
                <button
                  key={color}
                  className="color-button"
                  style={{
                    backgroundColor: color === 'red' ? '#e74c3c' :
                                   color === 'blue' ? '#3498db' :
                                   color === 'green' ? '#2ecc71' :
                                   '#f39c12'
                  }}
                  onClick={() => handleColorChoice(color)}
                >
                  {color.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
