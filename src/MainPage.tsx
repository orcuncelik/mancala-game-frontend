import React, { useState } from 'react';

interface MainPageProps {
  onStartNewGame: () => void;
  onEnterGame: (gameId: string) => void;
}

const MainPage: React.FC<MainPageProps> = ({ onStartNewGame, onEnterGame }) => {
  const [gameId, setGameId] = useState('');

  const handleEnterGame = () => {
    if (gameId) {
      onEnterGame(gameId);
    }
  };

  return (
    <div className="MainPage">
      <h1>Main Page</h1>
      <button onClick={onStartNewGame}>New Game</button>
      <div>
        <input
          type="text"
          placeholder="Enter Game ID"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
        />
        <button onClick={handleEnterGame}>Enter Game</button>
      </div>
    </div>
  );
};

export default MainPage;
