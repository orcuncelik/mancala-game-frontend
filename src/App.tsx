  import React, { useState, useEffect } from 'react';
  import './App.css';
  import { GameState } from './dto/GameState';
  import { PlayerType } from "./dto/PlayerType";
  import { SelectedPit } from './dto/SelectedPit';
  import Board from './Board';
  import axios, { AxiosError, CancelTokenSource } from 'axios';
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
        const axiosError = error as AxiosError;
        alert(JSON.stringify(axiosError.response?.data));
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
        const axiosError = error as AxiosError;
        alert(JSON.stringify(axiosError.response?.data));
      }

      return () => {
        source.cancel('Cancelling in cleanup');
      };
    };

    const makeMove = async (gameId: string, pitIndex: number) => {
      if (isGameEnded()) {
        return;
      }
      const source: CancelTokenSource = axios.CancelToken.source();
      try {
        const response = await axios.put(`http://localhost:8080/api/mancala/${gameId}`, { pitIndex }, { cancelToken: source.token });

        setGameState(response.data);
      } catch (error) {
        const axiosError = error as AxiosError;
          alert(JSON.stringify(axiosError.response?.data));
      }

      return () => {
        source.cancel('Cancelling in cleanup');
      };
    };

    const handlePitClick = async (player: PlayerType, index: number) => {
      if (gameState && player === gameState.currentPlayer) {
        setSelected({ player, index });
        if (gameState.gameId) {
          await makeMove(gameState.gameId, index);
        }
      }
    };

    const getCurrentPlayer = () => {
      if (isGameEnded()) {
        return "";
      }
      switch (gameState?.currentPlayer) {
        case PlayerType.FirstPlayer:
          return "First Player's Turn";
        case PlayerType.SecondPlayer:
          return "Second Player's Turn";
        default:
          return "";
      }
    };

    const getGameStatus = () => {
      switch (gameState?.gameStatus) {
        case GameStatus.Continuing:
          return "Game is continuing";
        case GameStatus.FirstPlayerWon:
          return "First player has won";
        case GameStatus.SecondPlayerWon:
          return "Second player has won";
        case GameStatus.Draw:
          return "The game is a draw";
        default:
          return "Unknown game status";
      }
    };

    const isGameEnded = () => {
      return !!(gameState && (gameState.gameStatus === GameStatus.FirstPlayerWon
        || gameState.gameStatus === GameStatus.SecondPlayerWon
        || gameState.gameStatus === GameStatus.Draw));
    };

    if (!gameState) {
      return <div>...</div>;
    }

    return (
      <div className="App">
        <div className="game-container">
          <Board gameState={gameState} selected={selected} onPitClick={handlePitClick} isGameEnded={isGameEnded()} />
          <h4>{getCurrentPlayer()}</h4>
          <h4>{getGameStatus()}</h4>
        </div>
      </div>
    );
  };

  export default App;
