import { FifteenPuzzleBoard } from '../domain/FifteenPuzzleBoard';
import { FifteenPuzzleGame } from '../application/FifteenPuzzleGame';
import { FifteenPuzzleTerminalRenderer } from './FifteenPuzzleTerminalRenderer';

describe('FifteenPuzzleTerminalRenderer', () => {
  test('renders the board title and move count', () => {
    const renderer = new FifteenPuzzleTerminalRenderer();
    const game = FifteenPuzzleGame.from(FifteenPuzzleBoard.solved());

    expect(renderer.render(game)).toContain('15-Puzzle');
    expect(renderer.render(game)).toContain('Moves: 0');
    expect(renderer.render(game)).toContain('Score: 100000');
  });

  test('renders the solved board tiles', () => {
    const renderer = new FifteenPuzzleTerminalRenderer();
    const game = FifteenPuzzleGame.from(FifteenPuzzleBoard.solved());

    expect(renderer.render(game)).toContain(' 1 ');
    expect(renderer.render(game)).toContain('15 ');
  });

  test('renders solved status when the game is won', () => {
    const renderer = new FifteenPuzzleTerminalRenderer();
    const game = FifteenPuzzleGame.from(FifteenPuzzleBoard.solved());

    expect(renderer.render(game)).toContain('Status: SOLVED');
  });

  test('renders playing status when the game is not won', () => {
    const renderer = new FifteenPuzzleTerminalRenderer();
    const game = FifteenPuzzleGame.from(
      FifteenPuzzleBoard.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15]),
    );

    expect(renderer.render(game)).toContain('Status: PLAYING');
  });

  test('renders elapsed time in seconds', () => {
    const renderer = new FifteenPuzzleTerminalRenderer();
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(3000);
    const game = FifteenPuzzleGame.from(
      FifteenPuzzleBoard.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15]),
    );

    expect(renderer.render(game)).toContain('Time: 0s');

    nowSpy.mockRestore();
  });
});
