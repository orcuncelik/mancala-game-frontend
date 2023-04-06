import React, { useState, useEffect } from 'react';
import './App.css';
import { GameState } from './dto/GameState';
import { SelectedPit } from './dto/SelectedPit';
import Board from './Board';
import axios, { CancelTokenSource } from 'axios';
import { GameStatus } from './dto/GameStatus';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selected, setSelected] = useState<SelectedPit | null>(null);

  useEffect(() => {
    const gameIdFromUrl = window.location.pathname.substr(1);
    if (gameIdFromUrl) {
      getGameState(gameIdFromUrl);
    } else {
        createGame();
    }
  }, []);

  const getGameState = async (gameId: string) => {
    const source: CancelTokenSource = axios.CancelToken.source();

    try {
      const response = await axios.get<GameState>(`http://localhost:8080/api/mancala/${gameId}`, { cancelToken: source.token });
      setGameState(response.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        console.error('Error fetching game state:', error);
      }
    }

    return () => {
      source.cancel('Cancelling in cleanup');
    };
  };

  const createGame = async () => {
    const source: CancelTokenSource = axios.CancelToken.source();

    try {
        const response = await axios.post<GameState>(`http://localhost:8080/api/mancala`, {}, { cancelToken: source.token });
      setGameState(response.data);

      if (!window.location.pathname || window.location.pathname === "/") {
        window.history.pushState({}, "", `/${response.data.gameId}`);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        console.error('Error fetching game state:', error);
      }
    }

    return () => {
      source.cancel('Cancelling in cleanup');
    };
  };

  const makeMove = async (gameId: string, pitIndex: number) => {
    if (gameState && (gameState.gameStatus === GameStatus.FirstPlayerWon)) {
      return;
    }
    const source: CancelTokenSource = axios.CancelToken.source();
    try {
        const response = await axios.put(`http://localhost:8080/api/mancala/${gameId}`, { pitIndex }, { cancelToken: source.token });
        
        setGameState(response.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        console.error('Error making move:', error);
      }
    }

    return () => {
      source.cancel('Cancelling in cleanup');
    };
  };

  const handlePitClick = async (player: string, index: number) => {
    if (gameState && player === gameState.currentPlayer) {
      setSelected({ player, index });
      if (gameState.gameId) {
        await makeMove(gameState.gameId, index);
      }
    }
  };

  const getCurrentPlayer = () => {
    if (gameState && gameState.currentPlayer === 'FIRST_PLAYER') {
      return 'Player 1';
    } else if (gameState && gameState.currentPlayer === 'SECOND_PLAYER') {
      return 'Player 2';
    } else {
      return '';
    }
  };

  const getGameStatus = () => {
    if (gameState) {
        return gameState.gameStatus;
    }
    return '';
  };

  if (!gameState) {
    return <div>Loading game state...</div>;
  }

  return (
    <div className="App">
      <div className="game-container">
        <Board gameState={gameState} selected={selected} onPitClick={handlePitClick} />
        <h3>Current Turn: {getCurrentPlayer()}</h3>
        <h3>Game Status: {getGameStatus()}</h3>
      </div>
    </div>
  );
};

export default App;
