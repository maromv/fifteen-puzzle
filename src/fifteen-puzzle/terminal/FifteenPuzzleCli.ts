import { SIZE } from '../domain/FifteenPuzzleBoard';
import { FifteenPuzzleGame } from '../application/FifteenPuzzleGame';

type Renderer = {
  render(game: FifteenPuzzleGame): string;
};

type Direction = 'up' | 'down' | 'left' | 'right';

export class FifteenPuzzleCli {
  get isGameOver(): boolean {
    return this.game.isGameOver;
  }

  constructor(
    private readonly game: FifteenPuzzleGame,
    private readonly renderer: Renderer,
  ) {}

  render(): string {
    return this.renderer.render(this.game);
  }

  processArrow(direction: Direction): string {
    const tileValue = this.tileValueForDirection(direction);

    if (tileValue === null) {
      return this.render();
    }

    this.game.moveTile(tileValue);

    return this.render();
  }

  processCommand(input: string): string {
    const command = input.trim();

    if (command === 'q') {
      return 'Goodbye!';
    }

    const tile = Number.parseInt(command, 10);

    if (Number.isNaN(tile)) {
      return "Enter a tile number (1-15) or 'q' to quit.";
    }

    const moved = this.game.moveTile(tile);

    if (!moved) {
      return `Tile ${tile} cannot be moved.`;
    }

    return this.render();
  }

  private tileValueForDirection(direction: Direction): number | null {
    const blankIndex = this.game.board.blankIndex();
    let tileIndex: number | null = null;

    if (direction === 'up' && blankIndex - SIZE >= 0) {
      tileIndex = blankIndex - SIZE;
    }

    if (direction === 'down' && blankIndex + SIZE < this.game.board.grid.length) {
      tileIndex = blankIndex + SIZE;
    }

    if (direction === 'left' && blankIndex % SIZE !== 0) {
      tileIndex = blankIndex - 1;
    }

    if (direction === 'right' && (blankIndex + 1) % SIZE !== 0) {
      tileIndex = blankIndex + 1;
    }

    if (tileIndex === null) {
      return null;
    }

    return this.game.board.tileAt(tileIndex);
  }
}
