import { BLANK, FifteenPuzzle, SIZE, ValueOutOfRangeError } from './Board';

const SOLVED_STATE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, BLANK];

describe('Board', () => {
  describe('solved', () => {
    test('creates the default solved grid', () => {
      expect(FifteenPuzzle.solved().grid).toEqual(SOLVED_STATE);
    });

    test('creates a 4x4 board', () => {
      expect(FifteenPuzzle.solved().grid).toHaveLength(SIZE * SIZE);
    });
  });
  
  describe('immutability', () => {
    test('does not change when the source array is mutated after board creation', () => {
      const source = [...SOLVED_STATE];
      const board = FifteenPuzzle.from(source);

      source[0] = 21;

      expect(board.grid[0]).toBe(1);
    });
  });
  describe('blankIndex', () => {
    test('returns the blank tile index for the solved board', () => {
      expect(FifteenPuzzle.solved().blankIndex()).toBe(15);
    });
  });
  describe('tileAt', () => {
    test('returns value of tile by index', () => {
      expect(FifteenPuzzle.solved().tileAt(0)).toBe(1);
    });
    test('throws error when invalid input', () => {
      expect(() => FifteenPuzzle.solved().tileAt(-1)).toThrow(
        new ValueOutOfRangeError(),
      );
    });
    test('throws error when index is greater than the last cell', () => {
      expect(() => FifteenPuzzle.solved().tileAt(16)).toThrow(
        new ValueOutOfRangeError(),
      );
    });
  });
  describe('isSolved', () => {
    test('returns true for the solved board', () => {
      expect(FifteenPuzzle.solved().isSolved()).toBe(true);
    });
    test('returns false when the board is not solved', () => {
      const board = FifteenPuzzle.from([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15,
      ]);

      expect(board.isSolved()).toBe(false);
    });
  });

  describe('movableTileIndices', () => {
    test('returns two movable indices when blank is in the bottom-right corner', () => {
      expect(
        FifteenPuzzle.solved()
          .movableTileIndices()
          .sort((a, b) => a - b),
      ).toEqual([11, 14]);
    });
    test('returns two movable indices when blank is in the top-left corner', () => {
      const board = FifteenPuzzle.from([
        0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 1,
      ]);

      expect(board.movableTileIndices().sort((a, b) => a - b)).toEqual([1, 4]);
    });
    test('returns four movable indices when blank is in the center', () => {
      const board = FifteenPuzzle.from([
        1, 2, 3, 4, 5, 0, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
      ]);

      expect(board.movableTileIndices().sort((a, b) => a - b)).toEqual([
        1, 4, 6, 9,
      ]);
    });
    test('returns two movable indices when blank is in the top-right corner', () => {
      const board = FifteenPuzzle.from([
        1, 2, 3, 0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
      ]);

      expect(board.movableTileIndices().sort((a, b) => a - b)).toEqual([2, 7]);
    });
    test('returns two movable indices when blank is in the bottom-left corner', () => {
      const board = FifteenPuzzle.from([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0, 13, 14, 15,
      ]);

      expect(board.movableTileIndices().sort((a, b) => a - b)).toEqual([8, 13]);
    });
    test('returns three movable indices when blank is on the left edge but not in the corner', () => {
      const board = FifteenPuzzle.from([
        1, 2, 3, 4, 0, 6, 7, 8, 9, 10, 11, 12, 5, 13, 14, 15,
      ]);

      expect(board.movableTileIndices().sort((a, b) => a - b)).toEqual([
        0, 5, 8,
      ]);
    });
    test('does not wrap from the end of one row to the start of the next row', () => {
      const board = FifteenPuzzle.from([
        1, 2, 3, 0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
      ]);

      expect(board.movableTileIndices()).not.toContain(4);
    });
    test('does not wrap from the start of one row to the end of the previous row', () => {
      const board = FifteenPuzzle.from([
        1, 2, 3, 4, 0, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
      ]);

      expect(board.movableTileIndices()).not.toContain(3);
    });
  });

  describe('move', () => {
    test('returns null for an illegal move', () => {
      expect(FifteenPuzzle.solved().move(0)).toBeNull();
    });
    test('returns a new board for a legal move', () => {
      const next = FifteenPuzzle.solved().move(11);

      expect(next).not.toBeNull();
    });
    test('swaps the blank tile with the moved tile', () => {
      const next = FifteenPuzzle.solved().move(11);

      expect(next?.grid).toEqual([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 13, 14, 15, 12,
      ]);
    });
    test('does not mutate the original board when making a move', () => {
      const board = FifteenPuzzle.solved();

      board.move(11);

      expect(board.grid).toEqual(SOLVED_STATE);
    });
    test('returns a different board instance for a legal move', () => {
      const board = FifteenPuzzle.solved();
      const next = board.move(11);

      expect(next).not.toBe(board);
    });
    test('allows moving the other tile adjacent to the blank', () => {
      const next = FifteenPuzzle.solved().move(14);

      expect(next?.grid).toEqual([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15,
      ]);
    });
    test('returns null when trying to move the blank tile itself', () => {
      expect(FifteenPuzzle.solved().move(15)).toBeNull();
    });

    test('returns null when trying to move a non-adjacent tile from the same row', () => {
      expect(FifteenPuzzle.solved().move(12)).toBeNull();
    });
  });

  describe('from', () => {
    test('creates a board from a valid grid', () => {
      const board = FifteenPuzzle.from(SOLVED_STATE);

      expect(board.grid).toEqual(SOLVED_STATE);
    });
    test('accepts a valid unsolved grid', () => {
      const grid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15];
      const board = FifteenPuzzle.from(grid);

      expect(board.grid).toEqual(grid);
    });

    test('throws when grid length is not 16', () => {
      expect(() => FifteenPuzzle.from([1, 2, 3])).toThrow();
    });

    test('throws when grid contains duplicates', () => {
      expect(() =>
        FifteenPuzzle.from([1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0]),
      ).toThrow();
    });
  });
});
