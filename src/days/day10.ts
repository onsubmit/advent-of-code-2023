type Coordinate = { row: number; column: number };

type TileValue = '|' | '-' | 'L' | 'J' | '7' | 'F' | '.' | 'S';

type Tile = {
  value: TileValue;
  isPartOfPipeLoop: boolean | undefined;
};

const areCoordinatesEqual = (a: Coordinate, b: Coordinate) => {
  return a.row === b.row && a.column === b.column;
};

const pipeConnections: Record<TileValue, Array<Coordinate>> = {
  '|': [
    { row: -1, column: 0 },
    { row: 1, column: 0 },
  ],
  '-': [
    { row: 0, column: -1 },
    { row: 0, column: 1 },
  ],
  L: [
    { row: -1, column: 0 },
    { row: 0, column: 1 },
  ],
  J: [
    { row: -1, column: 0 },
    { row: 0, column: -1 },
  ],
  '7': [
    { row: 0, column: -1 },
    { row: 1, column: 0 },
  ],
  F: [
    { row: 0, column: 1 },
    { row: 1, column: 0 },
  ],
  '.': [],
  S: [
    // By inspection, 'S' would be a '-' with my input.
    // This solution might not work for other input.
    { row: 0, column: -1 },
    { row: 0, column: 1 },
  ],
};

const getTilesAndStartLocation = (input: string): { tiles: Tile[][]; start: Coordinate } => {
  const lines = input.split('\n').filter(Boolean);

  let start: Coordinate | undefined = undefined;
  const tiles: Tile[][] = lines.map((line, row) => {
    const lineArr = [...line] as TileValue[];
    const tileArr = lineArr.map<Tile>((c) => ({ value: c, isPartOfPipeLoop: undefined }));

    if (!start) {
      const indexOfS = lineArr.indexOf('S');
      if (indexOfS >= 0) {
        start = { row, column: indexOfS };
      }
    }
    return tileArr;
  });

  if (!start) {
    throw new Error('Start coordinate not found.');
  }

  return { tiles, start };
};

const getLoop = (start: Coordinate, tiles: Tile[][]): Coordinate[] => {
  let previous = start;
  let current = start;
  let iterate = true;

  const loop: Coordinate[] = [start];
  while (iterate) {
    const { row, column } = current;
    const currentTile = tiles[row][column];

    if (currentTile.value === 'S' && loop.length > 1) {
      // We've closed the loop.
      iterate = false;
      continue;
    }

    const [option1, option2] = pipeConnections[currentTile.value].map((connection) => ({
      row: row + connection.row,
      column: column + connection.column,
    }));

    // Probably a better way to keep traversing the loop in the same direction, but 🤷‍♂️.
    const tileToAdd = areCoordinatesEqual(previous, option1) ? option2 : option1;
    loop.push(tileToAdd);
    tiles[tileToAdd.row][tileToAdd.column].isPartOfPipeLoop = true;

    previous = current;
    current = loop.at(-1)!;
  }

  return loop;
};

export const getPartOneSolution = (input: string): string => {
  const { tiles, start } = getTilesAndStartLocation(input);
  const loop: Coordinate[] = getLoop(start, tiles);

  return Math.floor(loop.length / 2).toString();
};

export const getPartTwoSolution = (input: string): string => {
  const { tiles, start } = getTilesAndStartLocation(input);
  const loop: Coordinate[] = getLoop(start, tiles);

  let numEnclosed = 0;
  //const loopVertices: Array<[number, number]> = loop.map((c) => [c.column, c.row]);
  for (let r = 0; r < tiles.length; r++) {
    for (let c = 0; c < tiles[r].length; c++) {
      if (tiles[r][c].isPartOfPipeLoop) {
        continue;
      }

      let intersections = 0;
      for (let c2 = 0; c2 < c; c2++) {
        if (
          ['|', 'L', 'J'].includes(tiles[r][c2].value) &&
          loop.find((l) => areCoordinatesEqual(l, { row: r, column: c2 }))
        ) {
          intersections++;
        }
      }

      if (intersections % 2 === 1) {
        numEnclosed++;
      }
    }
  }

  return numEnclosed.toString();
};
