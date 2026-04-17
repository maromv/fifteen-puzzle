import { FifteenPuzzleBoard } from '../domain/FifteenPuzzleBoard';
import { FifteenPuzzleGame } from '../application/FifteenPuzzleGame';
import { FifteenPuzzleTerminalRenderer } from './FifteenPuzzleTerminalRenderer';
import { FifteenPuzzleCli } from './FifteenPuzzleCli';

class FakeFifteenPuzzleTerminalRenderer extends FifteenPuzzleTerminalRenderer {
  override render(game: FifteenPuzzleGame): string {
    return `moves=${game.moves};gameOver=${game.isGameOver}`;
  }
}

describe('FifteenPuzzleCli', () => {
  test('renders the current game state', () => {
    const cli = new FifteenPuzzleCli(
      FifteenPuzzleGame.from(FifteenPuzzleBoard.solved()),
      new FakeFifteenPuzzleTerminalRenderer(),
    );

    expect(cli.render()).toBe('moves=0;gameOver=true');
  });

  test('moves a tile when a valid tile number is entered', () => {
    const cli = new FifteenPuzzleCli(
      FifteenPuzzleGame.from(FifteenPuzzleBoard.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15])),
      new FakeFifteenPuzzleTerminalRenderer(),
    );

    expect(cli.processCommand('15')).toBe('moves=1;gameOver=true');
  });

  test('returns a validation message for an invalid tile number', () => {
    const cli = new FifteenPuzzleCli(
      FifteenPuzzleGame.from(FifteenPuzzleBoard.solved()),
      new FakeFifteenPuzzleTerminalRenderer(),
    );

    expect(cli.processCommand('99')).toBe('Tile 99 cannot be moved.');
  });

  test('returns a validation message for unsupported input', () => {
    const cli = new FifteenPuzzleCli(
      FifteenPuzzleGame.from(FifteenPuzzleBoard.solved()),
      new FakeFifteenPuzzleTerminalRenderer(),
    );

    expect(cli.processCommand('hello')).toBe("Enter a tile number (1-15) or 'q' to quit.");
  });

  test('returns quit message for q command', () => {
    const cli = new FifteenPuzzleCli(
      FifteenPuzzleGame.from(FifteenPuzzleBoard.solved()),
      new FakeFifteenPuzzleTerminalRenderer(),
    );

    expect(cli.processCommand('q')).toBe('Goodbye!');
  });

  test('moves the tile on the left when left arrow is pressed', () => {
    const cli = new FifteenPuzzleCli(
      FifteenPuzzleGame.from(
        FifteenPuzzleBoard.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15]),
      ),
      new FakeFifteenPuzzleTerminalRenderer(),
    );

    expect(cli.processArrow('left')).toBe('moves=1;gameOver=false');
  });

  test('moves the tile on the right when right arrow is pressed', () => {
    const cli = new FifteenPuzzleCli(
      FifteenPuzzleGame.from(
        FifteenPuzzleBoard.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15]),
      ),
      new FakeFifteenPuzzleTerminalRenderer(),
    );

    expect(cli.processArrow('right')).toBe('moves=1;gameOver=true');
  });

  test('moves the tile above when up arrow is pressed', () => {
    const cli = new FifteenPuzzleCli(
      FifteenPuzzleGame.from(
        FifteenPuzzleBoard.from([1, 2, 3, 4, 5, 0, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
      ),
      new FakeFifteenPuzzleTerminalRenderer(),
    );

    expect(cli.processArrow('up')).toBe('moves=1;gameOver=false');
  });

  test('does nothing when arrow movement is impossible', () => {
    const cli = new FifteenPuzzleCli(
      FifteenPuzzleGame.from(
        FifteenPuzzleBoard.from([0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 1]),
      ),
      new FakeFifteenPuzzleTerminalRenderer(),
    );

    expect(cli.processArrow('up')).toBe('moves=0;gameOver=false');
  });
});
