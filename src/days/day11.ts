import { sumArray } from '../arrayMethods';
import { Coordinate } from '../coordinate';

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

const getShortestPathLengthsOfStarPairs = (
  universe: string[][],
  starCoordinates: Coordinate[],
  multiplier: number
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

      if (known.get(i)?.get(j) !== undefined || known.get(j)?.get(i) !== undefined) {
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

const getSolution = (input: string, multiplier: number) => {
  const lines = input.split('\n').filter(Boolean);

  const universe: string[][] = lines.map((line) => [...line]);
  const starCoordinates: Coordinate[] = getStarCoordinates(universe);
  const shortestPathLengthsOfStarPairs = getShortestPathLengthsOfStarPairs(
    universe,
    starCoordinates,
    multiplier
  );

  return sumArray(shortestPathLengthsOfStarPairs).toString();
};

export const getPartOneSolution = (input: string): string => {
  return getSolution(input, 2);
};

export const getPartTwoSolution = (input: string): string => {
  return getSolution(input, 1_000_000);
};
