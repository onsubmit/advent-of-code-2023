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

const getEmptyRows = (universe: string[][]): number[] => {
  const emptyRows: number[] = [];
  for (let r = 0; r < universe.length; r++) {
    if (universe[r].every((x) => x === '.')) {
      emptyRows.push(r);
    }
  }
  return emptyRows;
};

const getEmptyColumns = (universe: string[][]): number[] => {
  const emptyColumns: number[] = [];
  for (let c = 0; c < universe[0].length; c++) {
    let isColumnEmpty = true;
    for (let r = 0; isColumnEmpty && r < universe.length; r++) {
      if (universe[r][c] !== '.') {
        isColumnEmpty = false;
      }
    }

    if (isColumnEmpty) {
      emptyColumns.push(c);
    }
  }

  return emptyColumns;
};

const getPathLengthsBetweenStars = (
  universe: string[][],
  starCoordinates: Coordinate[],
  multiplier: number
): number[] => {
  const emptyRows = getEmptyRows(universe);
  const emptyColumns = getEmptyColumns(universe);

  const pathLengths: number[] = [];
  const knownPathLengths = new Map<number, Map<number, boolean>>();
  for (let i = 0; i < starCoordinates.length; i++) {
    for (let j = 0; j < starCoordinates.length; j++) {
      if (i === j) {
        continue;
      }

      if (knownPathLengths.get(i)?.get(j) || knownPathLengths.get(j)?.get(i)) {
        continue;
      }

      if (!knownPathLengths.get(i)) {
        knownPathLengths.set(i, new Map());
      }

      const minRow = Math.min(starCoordinates[i].row, starCoordinates[j].row);
      const minCol = Math.min(starCoordinates[i].column, starCoordinates[j].column);
      const maxRow = Math.max(starCoordinates[i].row, starCoordinates[j].row);
      const maxCol = Math.max(starCoordinates[i].column, starCoordinates[j].column);
      const numEmptyRowsBetweenStars = emptyRows.filter((n) => n > minRow && n < maxRow).length;
      const numEmptyColsBetweenStars = emptyColumns.filter((n) => n > minCol && n < maxCol).length;

      const length =
        (multiplier - 1) * (numEmptyRowsBetweenStars + numEmptyColsBetweenStars) +
        Math.abs(starCoordinates[i].row - starCoordinates[j].row) +
        Math.abs(starCoordinates[i].column - starCoordinates[j].column);

      knownPathLengths.get(i)?.set(j, true);
      pathLengths.push(length);
    }
  }

  return pathLengths;
};

const getSolution = (input: string, multiplier: number) => {
  const lines = input.split('\n').filter(Boolean);

  const universe = lines.map((line) => [...line]);
  const starCoordinates = getStarCoordinates(universe);
  const pathLengthsBetweenStars = getPathLengthsBetweenStars(universe, starCoordinates, multiplier);

  return sumArray(pathLengthsBetweenStars).toString();
};

export const getPartOneSolution = (input: string): string => {
  return getSolution(input, 2);
};

export const getPartTwoSolution = (input: string): string => {
  return getSolution(input, 1_000_000);
};
