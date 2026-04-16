export const SIZE = 4;
export const BLANK = 0;
const CELL_COUNT = SIZE * SIZE;

export class ValueOutOfRangeError extends Error {
  constructor(tag = '', options = {}) {
    super(`${tag}Value out of range 0 - ${CELL_COUNT - 1}`, options);
  }
}

export class FifteenPuzzle {
  constructor(public readonly grid: number[]) {
    this.grid = [...grid];
  }

  static solved(): FifteenPuzzle {
    return new FifteenPuzzle(
      [...Array(CELL_COUNT - 1).keys()].map((index) => index + 1).concat(BLANK),
    );
  }

  blankIndex() {
    return this.grid.indexOf(BLANK);
  }
  tileAt(index: number) {
    if (index < 0 || index > CELL_COUNT - 1) {
      throw new ValueOutOfRangeError();
    }
    return this.grid[index];
  }
  isSolved() {
    return this.grid.toString() === FifteenPuzzle.solved().grid.toString();
  }
  movableTileIndices() {
    const moves: number[] = [];
    const position = this.blankIndex();
    if (position - 4 >= 0) {
      moves.push(position - 4);
    }
    if (position + 4 <= 15) {
      moves.push(position + 4);
    }
    if (position % 4 !== 0) {
      moves.push(position - 1);
    }
    if ((position + 1) % 4 !== 0) {
      moves.push(position + 1);
    }

    return moves;
  }
}
