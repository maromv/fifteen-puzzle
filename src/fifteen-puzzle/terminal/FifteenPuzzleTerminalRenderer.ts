import {
  BLANK,
  FifteenPuzzleBoard,
  SIZE,
} from '../domain/FifteenPuzzleBoard';
import { FifteenPuzzleGame } from '../application/FifteenPuzzleGame';

export class FifteenPuzzleTerminalRenderer {
  render(game: FifteenPuzzleGame): string {
    const lines = [
      '15-Puzzle',
      `Moves: ${game.moves}`,
      `Time: ${Math.floor(game.elapsedMs / 1000)}s`,
      `Score: ${game.score}`,
      `Status: ${game.isGameOver ? 'SOLVED' : 'PLAYING'}`,
      '',
      this.renderBoard(game.board),
    ];

    return lines.join('\n');
  }

  private renderBoard(board: FifteenPuzzleBoard): string {
    const rows: string[] = [];

    for (let row = 0; row < SIZE; row++) {
      const cells: string[] = [];

      for (let column = 0; column < SIZE; column++) {
        const tile = board.tileAt(row * SIZE + column);
        const label = tile === BLANK ? '   ' : String(tile).padStart(2, ' ') + ' ';

        cells.push(label);
      }

      rows.push(cells.join('|'));
    }

    return rows.join('\n');
  }
}
