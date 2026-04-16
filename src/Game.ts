import { FifteenPuzzleBoard } from './FifteenPuzzleBoard';

const BASE_SCORE = 100000;
const MOVE_PENALTY = 1000;
const SECOND_PENALTY = 10;

export class Game {
  private _board: FifteenPuzzleBoard;
  private _moves = 0;
  private readonly _startedAt: number;
  private _finishedAt: number | null = null;

  private constructor(board: FifteenPuzzleBoard) {
    this._board = board;
    this._startedAt = Date.now();
  }

  static new(): Game {
    return new Game(FifteenPuzzleBoard.random());
  }

  static from(board: FifteenPuzzleBoard): Game {
    return new Game(board);
  }

  get board(): FifteenPuzzleBoard {
    return this._board;
  }

  get moves(): number {
    return this._moves;
  }

  get elapsedMs(): number {
    const endTime = this._finishedAt ?? Date.now();

    return endTime - this._startedAt;
  }

  get score(): number {
    const elapsedSeconds = Math.floor(this.elapsedMs / 1000);
    const totalPenalty = this.moves * MOVE_PENALTY + elapsedSeconds * SECOND_PENALTY;

    return Math.max(0, BASE_SCORE - totalPenalty);
  }

  get isGameOver(): boolean {
    return this._board.isSolved();
  }

  movableTiles(): number[] {
    return this._board
      .movableTileIndices()
      .map((index) => this._board.tileAt(index))
      .filter((tile) => tile !== 0);
  }

  moveTile(tileValue: number): boolean {
    const tileIndex = this._board.grid.indexOf(tileValue);

    if (tileIndex === -1) {
      return false;
    }

    const nextBoard = this._board.move(tileIndex);

    if (!nextBoard) {
      return false;
    }

    this._board = nextBoard;
    this._moves++;

    if (this.isGameOver) {
      this._finishedAt = Date.now();
    }

    return true;
  }
}
