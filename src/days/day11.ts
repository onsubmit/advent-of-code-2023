import { sumArray } from '../arrayMethods';

type Coordinate = { row: number; column: number };

const expandUniverse = (universe: string[][]): string[][] => {
  const emptyRows: number[] = [];
  const emptyCols: number[] = [];

  for (let r = 0; r < universe.length; r++) {
    if (universe[r].every((x) => x === '.')) {
      emptyRows.push(r);
    }
  }

  for (let c = 0; c < universe[0].length; c++) {
    let isColumnEmpty = true;
    for (let r = 0; isColumnEmpty && r < universe.length; r++) {
      if (universe[r][c] !== '.') {
        isColumnEmpty = false;
      }
    }

    if (isColumnEmpty) {
      emptyCols.push(c);
    }
  }

  const newNumRows = universe.length + emptyRows.length;
  const newNumCols = universe[0].length + emptyCols.length;
  const expandedUniverse: string[][] = [];
  for (let r = 0; r < universe.length; r++) {
    if (emptyRows.includes(r)) {
      expandedUniverse.push(Array.from({ length: newNumCols }, () => '.'));
      expandedUniverse.push(Array.from({ length: newNumCols }, () => '.'));
    } else {
      const newRow = [...universe[r]];
      for (let i = emptyCols.length - 1; i >= 0; i--) {
        const emptyCol = emptyCols[i];
        newRow.splice(emptyCol, 0, '.');
      }
      expandedUniverse.push(newRow);
    }
  }

  return expandedUniverse;
};

const getStarCoordinates = (universe: string[][]): Coordinate[] => {
  const coordinates: Coordinate[] = [];
  for (let row = 0; row < universe.length; row++) {
    for (let column = 0; column < universe[row].length; column++) {
      if (universe[row][column] === '#') {
        coordinates.push({ row, column });
      }
    }
  }

  return coordinates;
};

const getShortestPathLengthsOfStarPairs = (starCoordinates: Coordinate[]): number[] => {
  const pathLengths: number[] = [];
  const known = new Map<number, Map<number, number>>();
  for (let i = 0; i < starCoordinates.length; i++) {
    for (let j = 0; j < starCoordinates.length; j++) {
      if (i === j) {
        continue;
      }

      if (known.get(i)?.get(j) !== undefined) {
        continue;
      }

      if (!known.get(i)) {
        known.set(i, new Map());
      }

      const distance =
        Math.abs(starCoordinates[i].row - starCoordinates[j].row) +
        Math.abs(starCoordinates[i].column - starCoordinates[j].column);

      known.get(i)?.set(j, distance);
      pathLengths.push(distance);
    }
  }

  return pathLengths;
};

const getShortestPathLengthsOfStarPairsPart2 = (
  universe: string[][],
  starCoordinates: Coordinate[]
): number[] => {
  const emptyRows: number[] = [];
  const emptyCols: number[] = [];

  for (let r = 0; r < universe.length; r++) {
    if (universe[r].every((x) => x === '.')) {
      emptyRows.push(r);
    }
  }

  for (let c = 0; c < universe[0].length; c++) {
    let isColumnEmpty = true;
    for (let r = 0; isColumnEmpty && r < universe.length; r++) {
      if (universe[r][c] !== '.') {
        isColumnEmpty = false;
      }
    }

    if (isColumnEmpty) {
      emptyCols.push(c);
    }
  }

  const pathLengths: number[] = [];
  const known = new Map<number, Map<number, number>>();
  for (let i = 0; i < starCoordinates.length; i++) {
    for (let j = 0; j < starCoordinates.length; j++) {
      if (i === j) {
        continue;
      }

      if (known.get(i)?.get(j) !== undefined) {
        continue;
      }

      if (!known.get(i)) {
        known.set(i, new Map());
      }

      const minRow = Math.min(starCoordinates[i].row, starCoordinates[j].row);
      const minCol = Math.min(starCoordinates[i].column, starCoordinates[j].column);
      const maxRow = Math.max(starCoordinates[i].row, starCoordinates[j].row);
      const maxCol = Math.max(starCoordinates[i].column, starCoordinates[j].column);
      const numEmptyRowsBetweenStars = emptyRows.filter((n) => n > minRow && n < maxRow).length;
      const numEmptyColsBetweenStars = emptyCols.filter((n) => n > minCol && n < maxCol).length;

      const multiplier = 1000000;
      const distance =
        (multiplier - 1) * (numEmptyRowsBetweenStars + numEmptyColsBetweenStars) +
        Math.abs(starCoordinates[i].row - starCoordinates[j].row) +
        Math.abs(starCoordinates[i].column - starCoordinates[j].column);

      known.get(i)?.set(j, distance);
      pathLengths.push(distance);
    }
  }

  return pathLengths;
};

export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  const universe: string[][] = lines.map((line) => [...line]);
  const expandedUniverse: string[][] = expandUniverse(universe);
  const starCoordinates: Coordinate[] = getStarCoordinates(expandedUniverse);
  const shortestPathLengthsOfStarPairs = getShortestPathLengthsOfStarPairs(starCoordinates);

  return (sumArray(shortestPathLengthsOfStarPairs) / 2).toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  const universe: string[][] = lines.map((line) => [...line]);
  const starCoordinates: Coordinate[] = getStarCoordinates(universe);
  const shortestPathLengthsOfStarPairs = getShortestPathLengthsOfStarPairsPart2(
    universe,
    starCoordinates
  );

  return (sumArray(shortestPathLengthsOfStarPairs) / 2).toString();
};
