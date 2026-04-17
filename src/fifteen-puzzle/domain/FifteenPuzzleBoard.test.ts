import {
  BLANK,
  countInversions,
  FifteenPuzzleBoard,
  isSolvable,
  SIZE,
  ValueOutOfRangeError,
} from './FifteenPuzzleBoard';

const SOLVED_STATE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, BLANK];

describe('Board', () => {
  describe('solved', () => {
    test('creates the default solved grid', () => {
      expect(FifteenPuzzleBoard.solved().grid).toEqual(SOLVED_STATE);
    });

    test('creates a 4x4 board', () => {
      expect(FifteenPuzzleBoard.solved().grid).toHaveLength(SIZE * SIZE);
    });
  });
  
  describe('immutability', () => {
    test('does not change when the source array is mutated after board creation', () => {
      const source = [...SOLVED_STATE];
      const board = FifteenPuzzleBoard.from(source);

      source[0] = 21;

      expect(board.grid[0]).toBe(1);
    });
  });
  describe('blankIndex', () => {
    test('returns the blank tile index for the solved board', () => {
      expect(FifteenPuzzleBoard.solved().blankIndex()).toBe(15);
    });
  });
  describe('tileAt', () => {
    test('returns value of tile by index', () => {
      expect(FifteenPuzzleBoard.solved().tileAt(0)).toBe(1);
    });
    test('throws error when invalid input', () => {
      expect(() => FifteenPuzzleBoard.solved().tileAt(-1)).toThrow(
        new ValueOutOfRangeError(),
      );
    });
    test('throws error when index is greater than the last cell', () => {
      expect(() => FifteenPuzzleBoard.solved().tileAt(16)).toThrow(
        new ValueOutOfRangeError(),
      );
    });
  });
  describe('isSolved', () => {
    test('returns true for the solved board', () => {
      expect(FifteenPuzzleBoard.solved().isSolved()).toBe(true);
    });
    test('returns false when the board is not solved', () => {
      const board = FifteenPuzzleBoard.from([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15,
      ]);

      expect(board.isSolved()).toBe(false);
    });
  });

  describe('movableTileIndices', () => {
    test('returns two movable indices when blank is in the bottom-right corner', () => {
      expect(
        FifteenPuzzleBoard.solved()
          .movableTileIndices()
          .sort((a, b) => a - b),
      ).toEqual([11, 14]);
    });
    test('returns two movable indices when blank is in the top-left corner', () => {
      const board = FifteenPuzzleBoard.from([
        0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 1,
      ]);

      expect(board.movableTileIndices().sort((a, b) => a - b)).toEqual([1, 4]);
    });
    test('returns four movable indices when blank is in the center', () => {
      const board = FifteenPuzzleBoard.from([
        1, 2, 3, 4, 5, 0, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
      ]);

      expect(board.movableTileIndices().sort((a, b) => a - b)).toEqual([
        1, 4, 6, 9,
      ]);
    });
    test('returns two movable indices when blank is in the top-right corner', () => {
      const board = FifteenPuzzleBoard.from([
        1, 2, 3, 0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
      ]);

      expect(board.movableTileIndices().sort((a, b) => a - b)).toEqual([2, 7]);
    });
    test('returns two movable indices when blank is in the bottom-left corner', () => {
      const board = FifteenPuzzleBoard.from([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0, 13, 14, 15,
      ]);

      expect(board.movableTileIndices().sort((a, b) => a - b)).toEqual([8, 13]);
    });
    test('returns three movable indices when blank is on the left edge but not in the corner', () => {
      const board = FifteenPuzzleBoard.from([
        1, 2, 3, 4, 0, 6, 7, 8, 9, 10, 11, 12, 5, 13, 14, 15,
      ]);

      expect(board.movableTileIndices().sort((a, b) => a - b)).toEqual([
        0, 5, 8,
      ]);
    });
    test('does not wrap from the end of one row to the start of the next row', () => {
      const board = FifteenPuzzleBoard.from([
        1, 2, 3, 0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
      ]);

      expect(board.movableTileIndices()).not.toContain(4);
    });
    test('does not wrap from the start of one row to the end of the previous row', () => {
      const board = FifteenPuzzleBoard.from([
        1, 2, 3, 4, 0, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
      ]);

      expect(board.movableTileIndices()).not.toContain(3);
    });
  });

  describe('move', () => {
    test('returns null for an illegal move', () => {
      expect(FifteenPuzzleBoard.solved().move(0)).toBeNull();
    });
    test('returns a new board for a legal move', () => {
      const next = FifteenPuzzleBoard.solved().move(11);

      expect(next).not.toBeNull();
    });
    test('swaps the blank tile with the moved tile', () => {
      const next = FifteenPuzzleBoard.solved().move(11);

      expect(next?.grid).toEqual([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 13, 14, 15, 12,
      ]);
    });
    test('does not mutate the original board when making a move', () => {
      const board = FifteenPuzzleBoard.solved();

      board.move(11);

      expect(board.grid).toEqual(SOLVED_STATE);
    });
    test('returns a different board instance for a legal move', () => {
      const board = FifteenPuzzleBoard.solved();
      const next = board.move(11);

      expect(next).not.toBe(board);
    });
    test('allows moving the other tile adjacent to the blank', () => {
      const next = FifteenPuzzleBoard.solved().move(14);

      expect(next?.grid).toEqual([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15,
      ]);
    });
    test('returns null when trying to move the blank tile itself', () => {
      expect(FifteenPuzzleBoard.solved().move(15)).toBeNull();
    });

    test('returns null when trying to move a non-adjacent tile from the same row', () => {
      expect(FifteenPuzzleBoard.solved().move(12)).toBeNull();
    });
  });

  describe('from', () => {
    test('creates a board from a valid grid', () => {
      const board = FifteenPuzzleBoard.from(SOLVED_STATE);

      expect(board.grid).toEqual(SOLVED_STATE);
    });
    test('accepts a valid unsolved grid', () => {
      const grid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15];
      const board = FifteenPuzzleBoard.from(grid);

      expect(board.grid).toEqual(grid);
    });

    test('throws when grid length is not 16', () => {
      expect(() => FifteenPuzzleBoard.from([1, 2, 3])).toThrow();
    });

    test('throws when grid contains duplicates', () => {
      expect(() =>
        FifteenPuzzleBoard.from([1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0]),
      ).toThrow();
    });
  });

  describe('countInversions', () => {
    test('returns 0 for the solved grid', () => {
      expect(countInversions(SOLVED_STATE)).toBe(0);
    });
    test('returns 1 for a single adjacent swap', () => {
      const grid = [2, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];

      expect(countInversions(grid)).toBe(1);
    });
    test('ignores the blank tile', () => {
      const grid = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

      expect(countInversions(grid)).toBe(0);
    });
    test('counts inversions against the last tile in the grid', () => {
      const grid = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 1, 0];

      expect(countInversions(grid)).toBe(14);
    });
  });

  describe('isSolvable', () => {
    test('returns true for the solved board', () => {
      expect(isSolvable(SOLVED_STATE)).toBe(true);
    });

    test('returns false for a known unsolvable board', () => {
      const grid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 14, 0];

      expect(isSolvable(grid)).toBe(false);
    });

    test('returns true for a known solvable non-trivial board', () => {
      const grid = [13, 2, 10, 3, 1, 12, 8, 4, 5, 0, 9, 6, 15, 14, 11, 7];

      expect(isSolvable(grid)).toBe(true);
    });
  });

  describe('random', () => {
    test('returns a solvable board', () => {
      const board = FifteenPuzzleBoard.random();

      expect(isSolvable(board.grid)).toBe(true);
    });

    test('returns a valid 4x4 board', () => {
      const board = FifteenPuzzleBoard.random();

      expect(board.grid).toHaveLength(SIZE * SIZE);
      expect([...board.grid].sort((a, b) => a - b)).toEqual([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
      ]);
    });

    test('does not always return the same board', () => {
      const boards = new Set(
        Array.from({ length: 20 }, () => FifteenPuzzleBoard.random().grid.join(',')),
      );

      expect(boards.size).toBeGreaterThan(1);
    });

    test('returns valid solvable boards across multiple runs', () => {
      for (let index = 0; index < 100; index++) {
        const board = FifteenPuzzleBoard.random();

        expect(board.grid).toHaveLength(SIZE * SIZE);
        expect([...board.grid].sort((a, b) => a - b)).toEqual([
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
        ]);
        expect(isSolvable(board.grid)).toBe(true);
      }
    });
  });
});
