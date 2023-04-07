import React from 'react';
import './Board.css';

import { GameState } from './dto/GameState'
import { SelectedPit } from './dto/SelectedPit'
import { PlayerType } from './dto/PlayerType';

interface BoardProps {
  gameState: GameState;
  selected: SelectedPit | null;
  onPitClick: (player: PlayerType, index: number) => void;
  isGameEnded: boolean;
}

const Board: React.FC<BoardProps> = ({ gameState, selected, onPitClick, isGameEnded }) => {
  const { player1Pits, player1BigPit, player2Pits, player2BigPit, currentPlayer } = gameState;

  const isSelected = (player: PlayerType, index: number) => {
    return selected && selected.player === player && selected.index === index;
  };

  const handleClick = (player: PlayerType, index: number) => {
    
    if (!isGameEnded && currentPlayer === player) {
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
              className={`pit${isSelected(PlayerType.FirstPlayer, index) ? ' selected' : ''}`}
              onClick={() => handleClick(PlayerType.FirstPlayer, index)}
            >
              <span className="stones">{stones}</span>
            </div>
          ))}
        </div>
        <div className="player2-pits">
          {player2Pits.map((stones, index) => (
            <div
              key={index}
              className={`pit${isSelected(PlayerType.SecondPlayer, index) ? ' selected' : ''}`}
              onClick={() => handleClick(PlayerType.SecondPlayer, index)}
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
