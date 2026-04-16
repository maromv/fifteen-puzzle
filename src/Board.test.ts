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
      const board = new FifteenPuzzle(source);

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
      const board = new FifteenPuzzle([
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
      const board = new FifteenPuzzle([
        0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 1,
      ]);

      expect(board.movableTileIndices().sort((a, b) => a - b)).toEqual([1, 4]);
    });
    test('returns four movable indices when blank is in the center', () => {
      const board = new FifteenPuzzle([
        1, 2, 3, 4, 5, 0, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
      ]);

      expect(board.movableTileIndices().sort((a, b) => a - b)).toEqual([
        1, 4, 6, 9,
      ]);
    });
    test('returns two movable indices when blank is in the top-right corner', () => {
      const board = new FifteenPuzzle([
        1, 2, 3, 0,
        4, 5, 6, 7,
        8, 9, 10, 11,
        12, 13, 14, 15,
      ]);

      expect(board.movableTileIndices().sort((a, b) => a - b)).toEqual([2, 7]);
    });
    test('returns two movable indices when blank is in the bottom-left corner', () => {
      const board = new FifteenPuzzle([
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        0, 13, 14, 15,
      ]);

      expect(board.movableTileIndices().sort((a, b) => a - b)).toEqual([8, 13]);
    });
    test('does not wrap from the end of one row to the start of the next row', () => {
      const board = new FifteenPuzzle([
        1, 2, 3, 0,
        4, 5, 6, 7,
        8, 9, 10, 11,
        12, 13, 14, 15,
      ]);

      expect(board.movableTileIndices()).not.toContain(4);
    });
    test('does not wrap from the start of one row to the end of the previous row', () => {
      const board = new FifteenPuzzle([
        1, 2, 3, 4,
        0, 5, 6, 7,
        8, 9, 10, 11,
        12, 13, 14, 15,
      ]);

      expect(board.movableTileIndices()).not.toContain(3);
    });
  });
});
