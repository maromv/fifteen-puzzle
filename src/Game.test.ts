import { FifteenPuzzleBoard } from './FifteenPuzzleBoard';
import { Game } from './Game';

const NEAR_SOLVED_GRID = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15];

describe('Game', () => {
  let now = 0;
  let dateNowSpy: jest.SpiedFunction<typeof Date.now>;

  beforeEach(() => {
    now = 0;
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => now);
  });

  afterEach(() => {
    dateNowSpy.mockRestore();
  });

  describe('new', () => {
    test('starts with zero moves', () => {
      const game = Game.new();

      expect(game.moves).toBe(0);
    });

    test('starts with a solvable board', () => {
      const game = Game.new();

      expect(game.board).toBeDefined();
    });
  });

  describe('moveTile', () => {
    test('returns false for a tile that is not adjacent to the blank', () => {
      const game = Game.from(FifteenPuzzleBoard.solved());

      expect(game.moveTile(1)).toBe(false);
    });

    test('returns true for a valid move and increments move count', () => {
      const game = Game.from(FifteenPuzzleBoard.from(NEAR_SOLVED_GRID));

      expect(game.moveTile(15)).toBe(true);
      expect(game.moves).toBe(1);
    });

    test('returns false for a non-existent tile value', () => {
      const game = Game.from(FifteenPuzzleBoard.solved());

      expect(game.moveTile(99)).toBe(false);
    });
  });

  describe('isGameOver', () => {
    test('is false at the start of a non-solved board', () => {
      const game = Game.from(FifteenPuzzleBoard.from(NEAR_SOLVED_GRID));

      expect(game.isGameOver).toBe(false);
    });

    test('is true after completing the puzzle', () => {
      const game = Game.from(FifteenPuzzleBoard.from(NEAR_SOLVED_GRID));

      game.moveTile(15);

      expect(game.isGameOver).toBe(true);
    });
  });

  describe('movableTiles', () => {
    test('returns tile values instead of indices', () => {
      const game = Game.from(FifteenPuzzleBoard.solved());

      expect(game.movableTiles().sort((a, b) => a - b)).toEqual([12, 15]);
    });

    test('does not include the blank tile', () => {
      const game = Game.from(FifteenPuzzleBoard.solved());

      expect(game.movableTiles()).not.toContain(0);
    });
  });

  describe('timer', () => {
    test('starts at zero elapsed time', () => {
      const game = Game.from(FifteenPuzzleBoard.solved());

      expect(game.elapsedMs).toBe(0);
    });

    test('tracks elapsed time while the game is running', () => {
      const game = Game.from(FifteenPuzzleBoard.from(NEAR_SOLVED_GRID));

      now = 1500;

      expect(game.elapsedMs).toBe(1500);
    });

    test('freezes elapsed time when the game is over', () => {
      const game = Game.from(FifteenPuzzleBoard.from(NEAR_SOLVED_GRID));

      now = 1000;
      game.moveTile(15);
      now = 3000;

      expect(game.elapsedMs).toBe(1000);
    });
  });

  describe('score', () => {
    test('starts with the maximum score', () => {
      const game = Game.from(FifteenPuzzleBoard.solved());

      expect(game.score).toBe(100000);
    });

    test('decreases as time passes', () => {
      const game = Game.from(FifteenPuzzleBoard.from(NEAR_SOLVED_GRID));

      now = 5000;

      expect(game.score).toBe(99950);
    });

    test('decreases after a successful move', () => {
      const game = Game.from(FifteenPuzzleBoard.from(NEAR_SOLVED_GRID));

      game.moveTile(15);

      expect(game.score).toBe(99000);
    });

    test('freezes when the game is over', () => {
      const game = Game.from(FifteenPuzzleBoard.from(NEAR_SOLVED_GRID));

      now = 1000;
      game.moveTile(15);
      const scoreAtFinish = game.score;

      now = 5000;

      expect(game.score).toBe(scoreAtFinish);
    });
  });
});
