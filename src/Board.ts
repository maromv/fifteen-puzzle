export const SIZE = 4;
export const BLANK = 0;
const CELL_COUNT = SIZE * SIZE;

export class ValueOutOfRangeError extends Error {
  constructor(tag = '', options = {}) {
    super(`${tag}Value out of range 0 - ${CELL_COUNT - 1}`, options);
  }
}

export class InvalidGridError extends Error {
  constructor(tag = '', options = {}) {
    super(`${tag}Invalid grid`, options);
  }
}

function assertValidGrid(grid: number[]) {
  if (grid.length !== CELL_COUNT) {
    throw new InvalidGridError();
  }

  const sorted = [...grid].sort((a, b) => a - b);

  for (let index = 0; index < CELL_COUNT; index++) {
    if (sorted[index] !== index) {
      throw new InvalidGridError();
    }
  }
}

export class FifteenPuzzle {
  private constructor(public readonly grid: number[]) {
    this.grid = [...grid];
  }

  static from(grid: number[]) {
    assertValidGrid(grid);
    return new FifteenPuzzle(grid);
  }

  static solved(): FifteenPuzzle {
    return new FifteenPuzzle(
      [...new Array(CELL_COUNT - 1).keys()].map((index) => index + 1).concat(BLANK),
    );
  }

  blankIndex() {
    return this.grid.indexOf(BLANK);
  }

  tileAt(index: number): number {
    const tile = this.grid[index];

    if (index < 0 || index > CELL_COUNT - 1 || tile === undefined)
      throw new ValueOutOfRangeError();

    return tile;
  }

  isSolved() {
    return this.grid.toString() === FifteenPuzzle.solved().grid.toString();
  }

  movableTileIndices() {
    const moves: number[] = [];
    const position = this.blankIndex();
    const hasRowAbove = position - SIZE >= 0;
    const hasRowBelow = position + SIZE <= CELL_COUNT - 1;
    const hasTilesToTheLeft = position % SIZE !== 0;
    const hasTilesToTheRight = (position + 1) % SIZE !== 0;

    if (hasRowAbove) {
      moves.push(position - SIZE);
    }
    if (hasRowBelow) {
      moves.push(position + SIZE);
    }
    if (hasTilesToTheLeft) {
      moves.push(position - 1);
    }
    if (hasTilesToTheRight) {
      moves.push(position + 1);
    }

    return moves;
  }
  move(index: number) {
    if (!this.movableTileIndices().includes(index)) {
      return null;
    }

    const nextGrid = [...this.grid];
    const blankIndex = this.blankIndex();
    const tile = this.tileAt(index);

    nextGrid[blankIndex] = tile;
    nextGrid[index] = BLANK;

    return new FifteenPuzzle(nextGrid);
  }
}
