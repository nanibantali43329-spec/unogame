// UNO Game Logic

export const COLORS = ['red', 'blue', 'green', 'yellow'];
export const SPECIAL_CARDS = ['skip', 'reverse', 'draw2'];
export const WILD_CARDS = ['wild', 'wild4'];

export const createDeck = () => {
  const deck = [];

  // Number cards (0-9 for each color)
  COLORS.forEach(color => {
    deck.push({ color, value: 0, type: 'number' });
    for (let i = 1; i <= 9; i++) {
      deck.push({ color, value: i, type: 'number' });
      deck.push({ color, value: i, type: 'number' });
    }
  });

  // Special cards (Skip, Reverse, Draw 2) - 2 of each per color
  COLORS.forEach(color => {
    SPECIAL_CARDS.forEach(special => {
      deck.push({ color, value: special, type: 'special' });
      deck.push({ color, value: special, type: 'special' });
    });
  });

  // Wild cards - 4 of each
  for (let i = 0; i < 4; i++) {
    deck.push({ color: 'black', value: 'wild', type: 'wild' });
    deck.push({ color: 'black', value: 'wild4', type: 'wild' });
  }

  return deck;
};

export const shuffleDeck = (deck) => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const dealCards = (players, deck) => {
  const hands = {};
  const remainingDeck = [...deck];

  players.forEach(playerId => {
    hands[playerId] = [];
    for (let i = 0; i < 7; i++) {
      hands[playerId].push(remainingDeck.pop());
    }
  });

  return { hands, remainingDeck };
};

export const initializeGame = (playerIds) => {
  let deck = createDeck();
  deck = shuffleDeck(deck);

  const { hands, remainingDeck } = dealCards(playerIds, deck);

  // Find a valid starting card (not a wild or action card)
  let topCard = null;
  let topCardIndex = -1;
  for (let i = remainingDeck.length - 1; i >= 0; i--) {
    const card = remainingDeck[i];
    if (card.type === 'number') {
      topCard = card;
      topCardIndex = i;
      break;
    }
  }

  if (!topCard) {
    topCard = remainingDeck.pop();
  } else {
    remainingDeck.splice(topCardIndex, 1);
  }

  return {
    deck: remainingDeck,
    discardPile: [topCard],
    hands,
    currentPlayer: 0,
    direction: 1, // 1 for clockwise, -1 for counter-clockwise
    currentColor: topCard.color,
    drawCount: 0,
    lastAction: null,
    winner: null
  };
};

export const canPlayCard = (card, topCard, currentColor) => {
  if (card.type === 'wild') return true;
  if (card.color === currentColor) return true;
  if (card.value === topCard.value) return true;
  return false;
};

export const getNextPlayer = (currentPlayer, direction, playerCount) => {
  let next = currentPlayer + direction;
  if (next >= playerCount) next = 0;
  if (next < 0) next = playerCount - 1;
  return next;
};

export const playCard = (gameState, playerId, cardIndex, chosenColor = null) => {
  const playerIds = Object.keys(gameState.hands);
  const currentPlayerIndex = gameState.currentPlayer;
  const currentPlayerId = playerIds[currentPlayerIndex];

  if (currentPlayerId !== playerId) {
    throw new Error('Not your turn');
  }

  const hand = gameState.hands[playerId];
  const card = hand[cardIndex];

  if (!card) {
    throw new Error('Invalid card');
  }

  const topCard = gameState.discardPile[gameState.discardPile.length - 1];
  
  if (!canPlayCard(card, topCard, gameState.currentColor)) {
    throw new Error('Cannot play this card');
  }

  // Remove card from hand
  const newHand = hand.filter((_, i) => i !== cardIndex);
  const newState = {
    ...gameState,
    hands: {
      ...gameState.hands,
      [playerId]: newHand
    },
    discardPile: [...gameState.discardPile, card],
    drawCount: 0
  };

  // Check for win
  if (newHand.length === 0) {
    newState.winner = playerId;
    return newState;
  }

  // Handle special cards
  let skipNext = false;
  
  if (card.type === 'wild') {
    newState.currentColor = chosenColor || COLORS[0];
    
    if (card.value === 'wild4') {
      newState.drawCount = 4;
      newState.lastAction = { type: 'wild4', player: playerId };
    } else {
      newState.lastAction = { type: 'wild', player: playerId };
    }
  } else {
    newState.currentColor = card.color;
    
    if (card.value === 'skip') {
      skipNext = true;
      newState.lastAction = { type: 'skip', player: playerId };
    } else if (card.value === 'reverse') {
      newState.direction *= -1;
      newState.lastAction = { type: 'reverse', player: playerId };
      
      // In 2-player game, reverse acts like skip
      if (playerIds.length === 2) {
        skipNext = true;
      }
    } else if (card.value === 'draw2') {
      newState.drawCount = 2;
      newState.lastAction = { type: 'draw2', player: playerId };
    }
  }

  // Move to next player
  let nextPlayer = getNextPlayer(currentPlayerIndex, newState.direction, playerIds.length);
  if (skipNext) {
    nextPlayer = getNextPlayer(nextPlayer, newState.direction, playerIds.length);
  }
  
  newState.currentPlayer = nextPlayer;

  return newState;
};

export const drawCard = (gameState, playerId) => {
  const playerIds = Object.keys(gameState.hands);
  const currentPlayerIndex = gameState.currentPlayer;
  const currentPlayerId = playerIds[currentPlayerIndex];

  if (currentPlayerId !== playerId) {
    throw new Error('Not your turn');
  }

  let newDeck = [...gameState.deck];
  
  // If deck is empty, shuffle discard pile (keep top card)
  if (newDeck.length === 0) {
    const topCard = gameState.discardPile[gameState.discardPile.length - 1];
    newDeck = shuffleDeck(gameState.discardPile.slice(0, -1));
    gameState.discardPile = [topCard];
  }

  const drawnCards = [];
  const cardsToDraw = gameState.drawCount > 0 ? gameState.drawCount : 1;

  for (let i = 0; i < cardsToDraw; i++) {
    if (newDeck.length > 0) {
      drawnCards.push(newDeck.pop());
    }
  }

  const newState = {
    ...gameState,
    deck: newDeck,
    hands: {
      ...gameState.hands,
      [playerId]: [...gameState.hands[playerId], ...drawnCards]
    },
    drawCount: 0,
    currentPlayer: getNextPlayer(currentPlayerIndex, gameState.direction, playerIds.length)
  };

  return newState;
};

export const getCardImage = (card) => {
  if (!card) return '';
  
  // Using direct URLs for card images (placeholder images)
  const colorMap = {
    red: 'e74c3c',
    blue: '3498db',
    green: '2ecc71',
    yellow: 'f39c12',
    black: '34495e'
  };

  const bgColor = colorMap[card.color] || '95a5a6';
  let displayValue = card.value;
  
  if (card.value === 'wild') displayValue = 'W';
  else if (card.value === 'wild4') displayValue = '+4';
  else if (card.value === 'draw2') displayValue = '+2';
  else if (card.value === 'skip') displayValue = '⊘';
  else if (card.value === 'reverse') displayValue = '⇄';

  // Using a simple placeholder image generator
  return `https://via.placeholder.com/120x180/${bgColor}/ffffff?text=${displayValue}`;
};
