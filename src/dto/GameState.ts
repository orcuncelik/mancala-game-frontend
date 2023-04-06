import { GameStatus } from './GameStatus';

export enum PlayerType {
  FIRST_PLAYER = 'FIRST_PLAYER',
  SECOND_PLAYER = 'SECOND_PLAYER',
}

export interface GameState {
    gameId: string;
    player1Pits: number[];
    player1BigPit: number;
    player2Pits: number[];
    player2BigPit: number;
    gameStatus: GameStatus;
    currentPlayer: PlayerType;
}