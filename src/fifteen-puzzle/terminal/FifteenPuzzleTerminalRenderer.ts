import { FifteenPuzzleGame } from '../application/FifteenPuzzleGame';
import { BLANK, FifteenPuzzleBoard, SIZE } from '../domain/FifteenPuzzleBoard';

type FifteenPuzzleTerminalRendererOptions = {
  emoji?: boolean;
};

const ANSI = {
  reset: '\u001b[0m',
  bold: '\u001b[1m',
  cyan: '\u001b[36m',
  blue: '\u001b[34m',
  green: '\u001b[32m',
  yellow: '\u001b[33m',
  magenta: '\u001b[35m',
  pastelRed: '\u001b[38;5;210m',
  white: '\u001b[37m',
  gray: '\u001b[90m',
} as const;
const ANIMATION_FRAMES = [' ', '  '];

export class FifteenPuzzleTerminalRenderer {
  constructor(
    private readonly options: FifteenPuzzleTerminalRendererOptions = {},
  ) {}

  render(game: FifteenPuzzleGame): string {
    const lines = [
      this.colorize('15-Puzzle', ANSI.bold, ANSI.cyan),
      this.renderStat('Moves', String(game.moves), ANSI.yellow),
      this.renderStat(
        'Time',
        `${Math.floor(game.elapsedMs / 1000)}s`,
        ANSI.blue,
      ),
      this.renderStat('Score', String(game.score), ANSI.pastelRed),
      this.renderStat(
        'Status',
        game.isGameOver ? 'SOLVED' : 'PLAYING',
        game.isGameOver ? ANSI.green : ANSI.yellow,
      ),
      '',
      this.renderBoard(game.board),
      '',
    ];
    if (!game.isGameOver) {
      lines.push(
        `${this.colorize('Enter tile number you want to swap with:', ANSI.bold, ANSI.white)} ${this.colorize(`[${game.movableTiles().join(' ')}]`, ANSI.green)}`,
      );
    } else {
      lines.push(this.colorize('  You win!', ANSI.green));
      lines.push(
        this.colorize(
          ANIMATION_FRAMES.reverse()[0]! + 'GAME OVER',
          ANSI.pastelRed,
        ),
        '',
      );
    }

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

        cells.push(this.renderTile(label, tile));
      }

      rows.push(this.colorize(divider, ANSI.gray));
      rows.push(
        this.colorize('|', ANSI.gray) +
          cells.join(this.colorize('|', ANSI.gray)) +
          this.colorize('|', ANSI.gray),
      );
    }

    rows.push(this.colorize(divider, ANSI.gray));

    return rows.join('\n');
  }

  private blankLabel(): string {
    return this.options.emoji ? ' 👻 ' : '    ';
  }

  private renderStat(label: string, value: string, valueColor: string): string {
    return `${this.colorize(`${label}:`, ANSI.bold, ANSI.white)} ${this.colorize(value, valueColor)}`;
  }

  private renderTile(label: string, tile: number): string {
    if (tile === BLANK) {
      return this.colorize(label, ANSI.gray);
    }

    if (tile <= 4) {
      return this.colorize(label, ANSI.cyan);
    }

    if (tile <= 8) {
      return this.colorize(label, ANSI.green);
    }

    if (tile <= 12) {
      return this.colorize(label, ANSI.yellow);
    }

    return this.colorize(label, ANSI.pastelRed);
  }

  private colorize(text: string, ...codes: string[]): string {
    return `${codes.join('')}${text}${ANSI.reset}`;
  }
}
