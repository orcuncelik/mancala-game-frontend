import React from 'react';
import './Board.css';

import { GameState } from './dto/GameState'

interface Selected {
  player: string;
  index: number;
}

interface BoardProps {
  gameState: GameState;
  selected: Selected | null;
  onPitClick: (player: string, index: number) => void;
}

const Board: React.FC<BoardProps> = ({ gameState, selected, onPitClick }) => {
  const { player1Pits, player1BigPit, player2Pits, player2BigPit, currentPlayer } = gameState;

  const isSelected = (player: string, index: number) => {
    return selected && selected.player === player && selected.index === index;
  };

  const handleClick = (player: string, index: number) => {
    console.log(currentPlayer);
    
    if (currentPlayer === player) {
      onPitClick(player, index);
    }
  };

  return (
    <div className="board">
      <div className="big-pit left">{player1BigPit}</div>
      <div className="middle-row">
        <div className="player1-pits">
          {player1Pits.map((stones, index) => (
            <div
              key={index}
              className={`pit${isSelected('FIRST_PLAYER', index) ? ' selected' : ''}`}
              onClick={() => handleClick('FIRST_PLAYER', index)}
            >
              <span className="stones">{stones}</span>
            </div>
          ))}
        </div>
        <div className="player2-pits">
          {player2Pits.map((stones, index) => (
            <div
              key={index}
              className={`pit${isSelected('SECOND_PLAYER', index) ? ' selected' : ''}`}
              onClick={() => handleClick('SECOND_PLAYER', index)}
            >
              <span className="stones">{stones}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="big-pit right">{player2BigPit}</div>
    </div>
  );
};

export default Board;
