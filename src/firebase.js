import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getDatabase, ref, set, onValue, push, remove, update, get, serverTimestamp } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAl2NWQg0Z9MYA8f2l5R1ZyEidesULgE5U",
  authDomain: "multiplayer-ee0d2.firebaseapp.com",
  projectId: "multiplayer-ee0d2",
  storageBucket: "multiplayer-ee0d2.firebasestorage.app",
  messagingSenderId: "748321456453",
  appId: "1:748321456453:web:e00599477f1eeb6ebf3e2c",
  measurementId: "G-R13B7Z983N",
  databaseURL: "https://multiplayer-ee0d2-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

export const signInUser = async () => {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const createGame = async (userId, playerName) => {
  const gamesRef = ref(database, 'games');
  const newGameRef = push(gamesRef);
  const gameId = newGameRef.key;

  const gameData = {
    id: gameId,
    host: userId,
    players: {
      [userId]: {
        name: playerName,
        ready: false,
        handCount: 0
      }
    },
    status: 'waiting',
    createdAt: serverTimestamp()
  };

  await set(newGameRef, gameData);
  return gameId;
};

export const joinGame = async (gameId, userId, playerName) => {
  const gameRef = ref(database, `games/${gameId}`);
  const snapshot = await get(gameRef);

  if (!snapshot.exists()) {
    throw new Error('Game not found');
  }

  const game = snapshot.val();
  const playerCount = Object.keys(game.players || {}).length;

  if (playerCount >= 4) {
    throw new Error('Game is full');
  }

  if (game.status !== 'waiting') {
    throw new Error('Game already started');
  }

  await update(ref(database, `games/${gameId}/players/${userId}`), {
    name: playerName,
    ready: false,
    handCount: 0
  });
};

export const findAvailableGame = async (userId, playerName) => {
  const gamesRef = ref(database, 'games');
  const snapshot = await get(gamesRef);

  if (snapshot.exists()) {
    const games = snapshot.val();
    for (const [gameId, game] of Object.entries(games)) {
      const playerCount = Object.keys(game.players || {}).length;
      if (game.status === 'waiting' && playerCount < 4) {
        await joinGame(gameId, userId, playerName);
        return gameId;
      }
    }
  }

  return await createGame(userId, playerName);
};

export const setPlayerReady = async (gameId, userId, ready) => {
  await update(ref(database, `games/${gameId}/players/${userId}`), { ready });
};

export const startGame = async (gameId, gameState) => {
  await update(ref(database, `games/${gameId}`), {
    status: 'playing',
    gameState: gameState,
    startedAt: serverTimestamp()
  });
};

export const updateGameState = async (gameId, gameState) => {
  await set(ref(database, `games/${gameId}/gameState`), gameState);
};

export const leaveGame = async (gameId, userId) => {
  await remove(ref(database, `games/${gameId}/players/${userId}`));
  
  const gameRef = ref(database, `games/${gameId}`);
  const snapshot = await get(gameRef);
  
  if (snapshot.exists()) {
    const game = snapshot.val();
    const remainingPlayers = Object.keys(game.players || {}).length;
    
    if (remainingPlayers === 0) {
      await remove(gameRef);
    }
  }
};

export const subscribeToGame = (gameId, callback) => {
  const gameRef = ref(database, `games/${gameId}`);
  return onValue(gameRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback(null);
    }
  });
};
