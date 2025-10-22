import React, { useState, useEffect } from 'react';
import Intro from './components/Intro';
import Menu from './components/Menu';
import Lobby from './components/Lobby';
import GameBoard from './components/GameBoard';
import {
  signInUser,
  createGame,
  joinGame,
  findAvailableGame,
  setPlayerReady,
  startGame,
  updateGameState,
  leaveGame,
  subscribeToGame,
  database
} from './firebase';
import { ref, update } from 'firebase/database';
import { initializeGame } from './gameLogic';
import './App.css';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [user, setUser] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await signInUser();
        setUser(currentUser);
      } catch (err) {
        setError('Failed to authenticate. Please refresh the page.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (!gameId) return;

    const unsubscribe = subscribeToGame(gameId, (gameData) => {
      if (gameData) {
        setGame(gameData);
      } else {
        // Game was deleted
        setGameId(null);
        setGame(null);
        setError('Game has ended or was deleted.');
      }
    });

    return () => unsubscribe();
  }, [gameId]);

  const handleCreateGame = async (playerName) => {
    try {
      setLoading(true);
      setError('');
      const newGameId = await createGame(user.uid, playerName);
      setGameId(newGameId);
    } catch (err) {
      setError('Failed to create game. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGame = async (code, playerName) => {
    try {
      setLoading(true);
      setError('');
      await joinGame(code, user.uid, playerName);
      setGameId(code);
    } catch (err) {
      setError(err.message || 'Failed to join game.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFindMatch = async (playerName) => {
    try {
      setLoading(true);
      setError('');
      const foundGameId = await findAvailableGame(user.uid, playerName);
      setGameId(foundGameId);
    } catch (err) {
      setError('Failed to find match. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReady = async (ready) => {
    try {
      await setPlayerReady(gameId, user.uid, ready);
    } catch (err) {
      setError('Failed to update ready status.');
      console.error(err);
    }
  };

  const handleStartGame = async () => {
    try {
      const playerIds = Object.keys(game.players);
      const initialGameState = initializeGame(playerIds);
      await startGame(gameId, initialGameState);
    } catch (err) {
      setError('Failed to start game.');
      console.error(err);
    }
  };

  const handleLeaveGame = async () => {
    try {
      await leaveGame(gameId, user.uid);
      setGameId(null);
      setGame(null);
    } catch (err) {
      setError('Failed to leave game.');
      console.error(err);
    }
  };

  const handleUpdateGame = async (newGameState) => {
    try {
      await updateGameState(gameId, newGameState);
    } catch (err) {
      setError('Failed to update game state.');
      console.error(err);
    }
  };

  const handleBackToLobby = async () => {
    try {
      // Reset game to lobby state
      const gameRef = ref(database, `games/${gameId}`);
      await update(gameRef, {
        status: 'waiting',
        gameState: null
      });
      
      // Reset all players to not ready
      const playerIds = Object.keys(game.players);
      for (const playerId of playerIds) {
        await update(ref(database, `games/${gameId}/players/${playerId}`), {
          ready: false,
          handCount: 0
        });
      }
    } catch (err) {
      setError('Failed to return to lobby.');
      console.error(err);
    }
  };

  if (showIntro) {
    return <Intro onComplete={() => setShowIntro(false)} />;
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="error-screen">
        <h2>Authentication Error</h2>
        <p>{error || 'Failed to authenticate'}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="app">
      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {!game && (
        <Menu
          onCreateGame={handleCreateGame}
          onJoinGame={handleJoinGame}
          onFindMatch={handleFindMatch}
        />
      )}

      {game && game.status === 'waiting' && (
        <Lobby
          game={game}
          userId={user.uid}
          onReady={handleReady}
          onStart={handleStartGame}
          onLeave={handleLeaveGame}
        />
      )}

      {game && game.status === 'playing' && (
        <GameBoard
          game={game}
          userId={user.uid}
          onUpdateGame={handleUpdateGame}
          onBackToLobby={handleBackToLobby}
        />
      )}
    </div>
  );
}

export default App;
