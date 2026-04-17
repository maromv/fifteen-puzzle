import { FifteenPuzzleBoard } from '../domain/FifteenPuzzleBoard';
import { FifteenPuzzleGame } from '../application/FifteenPuzzleGame';
import { FifteenPuzzleTerminalRenderer } from './FifteenPuzzleTerminalRenderer';

const stripAnsi = (value: string): string =>
  value.replace(/\u001b\[[0-9;]*m/g, '');

describe('FifteenPuzzleTerminalRenderer', () => {
  test('renders the board title and move count', () => {
    const renderer = new FifteenPuzzleTerminalRenderer();
    const game = FifteenPuzzleGame.from(FifteenPuzzleBoard.solved());
    const output = stripAnsi(renderer.render(game));

    expect(output).toContain('15-Puzzle');
    expect(output).toContain('Moves: 0');
    expect(output).toContain('Score: 100000');
  });

  test('renders the solved board tiles', () => {
    const renderer = new FifteenPuzzleTerminalRenderer();
    const game = FifteenPuzzleGame.from(FifteenPuzzleBoard.solved());
    const output = stripAnsi(renderer.render(game));

    expect(output).toContain(' 1 ');
    expect(output).toContain('15 ');
  });

  test('renders a frame around the grid', () => {
    const renderer = new FifteenPuzzleTerminalRenderer();
    const game = FifteenPuzzleGame.from(FifteenPuzzleBoard.solved());
    const output = stripAnsi(renderer.render(game));

    expect(output).toContain('+----+----+----+----+');
    expect(output).toContain('|  1 |  2 |  3 |  4 |');
  });

  test('renders solved status when the game is won', () => {
    const renderer = new FifteenPuzzleTerminalRenderer();
    const game = FifteenPuzzleGame.from(FifteenPuzzleBoard.solved());

    expect(stripAnsi(renderer.render(game))).toContain('Status: SOLVED');
  });

  test('renders playing status when the game is not won', () => {
    const renderer = new FifteenPuzzleTerminalRenderer();
    const game = FifteenPuzzleGame.from(
      FifteenPuzzleBoard.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15]),
    );

    expect(stripAnsi(renderer.render(game))).toContain('Status: PLAYING');
  });

  test('renders elapsed time in seconds', () => {
    const renderer = new FifteenPuzzleTerminalRenderer();
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(3000);
    const game = FifteenPuzzleGame.from(
      FifteenPuzzleBoard.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15]),
    );

    expect(stripAnsi(renderer.render(game))).toContain('Time: 0s');

    nowSpy.mockRestore();
  });

  test('does not render emoji for the blank tile by default', () => {
    const renderer = new FifteenPuzzleTerminalRenderer();
    const game = FifteenPuzzleGame.from(FifteenPuzzleBoard.solved());

    expect(renderer.render(game)).not.toContain('👻');
  });

  test('renders emoji for the blank tile when emoji mode is enabled', () => {
    const renderer = new FifteenPuzzleTerminalRenderer({ emoji: true });
    const game = FifteenPuzzleGame.from(FifteenPuzzleBoard.solved());

    expect(renderer.render(game)).toContain('👻');
  });

  test('adds ANSI colors to the scoreboard and board', () => {
    const renderer = new FifteenPuzzleTerminalRenderer();
    const game = FifteenPuzzleGame.from(FifteenPuzzleBoard.solved());
    const output = renderer.render(game);

    expect(output).toMatch(/\u001b\[[0-9;]*m15-Puzzle\u001b\[0m/);
    expect(output).toMatch(/\u001b\[[0-9;]*mMoves:\u001b\[0m/);
    expect(output).toMatch(/\u001b\[[0-9;]*m\|\u001b\[0m/);
    expect(output).toContain('\u001b[38;5;210m');
  });
});
