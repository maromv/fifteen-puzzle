import { FifteenPuzzleGame } from '../application/FifteenPuzzleGame';
import { BLANK, FifteenPuzzleBoard, SIZE } from '../domain/FifteenPuzzleBoard';

type FifteenPuzzleTerminalRendererOptions = {
  emoji?: boolean;
};

export class FifteenPuzzleTerminalRenderer {
  constructor(
    private readonly options: FifteenPuzzleTerminalRendererOptions = {},
  ) {}

  render(game: FifteenPuzzleGame): string {
    const lines = [
      '15-Puzzle',
      `Moves: ${game.moves}`,
      `Time: ${Math.floor(game.elapsedMs / 1000)}s`,
      `Score: ${game.score}`,
      `Status: ${game.isGameOver ? 'SOLVED' : 'PLAYING'}`,
      '',
      this.renderBoard(game.board),
      '',
    ];
    if (!game.isGameOver)
      lines.push(
        `Enter tile number you want to swap with: [${game.movableTiles().join(' ')}]`,
      );

    return lines.join('\n');
  }

  private renderBoard(board: FifteenPuzzleBoard): string {
    const rows: string[] = [];
    const divider = '+' + '----+'.repeat(SIZE);

    for (let row = 0; row < SIZE; row++) {
      const cells: string[] = [];

      for (let column = 0; column < SIZE; column++) {
        const tile = board.tileAt(row * SIZE + column);
        const label =
          tile === BLANK
            ? this.blankLabel()
            : String(tile).padStart(3, ' ') + ' ';

        cells.push(label);
      }

      rows.push(divider);
      rows.push('|' + cells.join('|') + '|');
    }

    rows.push(divider);

    return rows.join('\n');
  }

  private blankLabel(): string {
    return this.options.emoji ? ' 👻 ' : '    ';
  }
}
