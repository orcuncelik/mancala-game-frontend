import { GameStatus } from './GameStatus';
import { PlayerType } from "./PlayerType";

export interface GameState {
    gameId: string;
    player1Pits: number[];
    player1BigPit: number;
    player2Pits: number[];
    player2BigPit: number;
    gameStatus: GameStatus;
    currentPlayer: PlayerType;
}