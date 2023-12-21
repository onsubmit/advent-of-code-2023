import { Coordinate } from '../coordinate';

export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  const plots = lines.map<string[]>((line) => [...line]);

  const findStartCoordinate = (plots: string[][]): Coordinate => {
    for (let row = 0; row < plots.length; row++) {
      for (let column = 0; column < plots[row].length; column++) {
        if (plots[row][column] === 'S') {
          return { row, column };
        }
      }
    }

    throw new Error('Start not found');
  };

  const isValidCoordinate = (coordinate: Coordinate): boolean => {
    const { row, column } = coordinate;
    if (row < 0 || column < 0 || row >= plots.length || column >= plots[row].length) {
      return false;
    }

    return true;
  };

  const start: Coordinate = findStartCoordinate(plots);
  plots[start.row][start.column] = 'S';

  const step = (coordinate: Coordinate) => {
    const newCoordinates: Coordinate[] = [];
    const { row, column } = coordinate;
    plots[row][column] = plots[row][column] === 'S' ? 'O' : '.';

    const north = { row: row - 1, column };
    if (
      isValidCoordinate(north) &&
      ['S', '.', 'O'].includes(plots[north.row][north.column]) &&
      !tempQueue.find((c) => c.row === north.row && c.column === north.column)
    ) {
      newCoordinates.push(north);
      plots[north.row][north.column] = 'O';
    }

    const south = { row: row + 1, column };
    if (
      isValidCoordinate(south) &&
      ['S', '.', 'O'].includes(plots[south.row][south.column]) &&
      !tempQueue.find((c) => c.row === south.row && c.column === south.column)
    ) {
      newCoordinates.push(south);
      plots[south.row][south.column] = 'O';
    }

    const east = { row: row, column: column + 1 };
    if (
      isValidCoordinate(east) &&
      ['S', '.', 'O'].includes(plots[east.row][east.column]) &&
      !tempQueue.find((c) => c.row === east.row && c.column === east.column)
    ) {
      newCoordinates.push(east);
      plots[east.row][east.column] = 'O';
    }

    const west = { row: row, column: column - 1 };
    if (
      isValidCoordinate(west) &&
      ['S', '.', 'O'].includes(plots[west.row][west.column]) &&
      !tempQueue.find((c) => c.row === west.row && c.column === west.column)
    ) {
      newCoordinates.push(west);
      plots[west.row][west.column] = 'O';
    }

    return newCoordinates;
  };

  let queue = [start];
  let stepCount: number = 0;
  let tempQueue: Coordinate[] = [];
  while (queue.length) {
    tempQueue = [];
    while (queue.length) {
      const coordinate = queue.shift()!;
      const next = step(coordinate);
      tempQueue.push(...next);
    }

    console.log('step', stepCount, tempQueue.length);
    //console.log(plots.map((s) => s.join('')).join('\n'));
    if (++stepCount === 64) {
      tempQueue = [];
      break;
    }

    queue = tempQueue;
  }

  let sum = 0;
  for (let row = 0; row < plots.length; row++) {
    for (let column = 0; column < plots[row].length; column++) {
      if (plots[row][column] === 'O') {
        sum++;
      }
    }
  }

  return sum.toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  const world: Map<string, string[][]> = new Map();
  const originPlots = lines.map<string[]>((line) => [...line]);
  world.set('0,0', originPlots);

  const findStartCoordinate = (plots: string[][]): Coordinate => {
    for (let row = 0; row < plots.length; row++) {
      for (let column = 0; column < plots[row].length; column++) {
        if (plots[row][column] === 'S') {
          return { row, column };
        }
      }
    }

    throw new Error('Start not found');
  };

  const start: Coordinate = findStartCoordinate(originPlots);
  originPlots[start.row][start.column] = 'S';

  const step = (coordinate: Coordinate, regionCoordinate: Coordinate) => {
    const regionKey = `${regionCoordinate.row},${regionCoordinate.column}`;
    const region = world.get(regionKey)!;
    const newCoordinates: Coordinate[] = [];
    const { row, column } = coordinate;
    region[row][column] = region[row][column] === 'S' ? 'O' : '.';

    const north = { row: row - 1, column };
    const northRegion = region;
    if (north.row === -1) {
      north.row = region.length - 1;

      const newRegionCoordinate = {
        row: regionCoordinate.row - 1,
        column: regionCoordinate.column,
      };
      const newRegionCoordinateKey = `${newRegionCoordinate.row},${newRegionCoordinate.column}`;
      let northRegion = world.get(newRegionCoordinateKey);
      if (!northRegion) {
        northRegion = lines.map<string[]>((line) => [...line]);
        world.set(newRegionCoordinateKey, northRegion);
      }
    }

    if (
      ['S', '.', 'O'].includes(northRegion[north.row][north.column]) &&
      !tempQueue.find((c) => c.row === north.row && c.column === north.column)
    ) {
      newCoordinates.push(north);
      region[north.row][north.column] = 'O';
    }

    const south = { row: row + 1, column };
    if (south.row === region.length) {
      south.row = 0;
      regionCoordinate.row++;
    }

    if (
      ['S', '.', 'O'].includes(world[south.row][south.column]) &&
      !tempQueue.find((c) => c.row === south.row && c.column === south.column)
    ) {
      newCoordinates.push(south);
      region[south.row][south.column] = 'O';
    }

    const east = { row: row, column: column + 1 };
    if (east.column === world.length) {
      east.column = 0;
    }

    if (
      ['S', '.', 'O'].includes(world[east.row][east.column]) &&
      !tempQueue.find((c) => c.row === east.row && c.column === east.column)
    ) {
      newCoordinates.push(east);
      world[east.row][east.column] = 'O';
    }

    const west = { row: row, column: column - 1 };
    if (west.column === -1) {
      west.column = world[0].length - 1;
    }
    if (
      ['S', '.', 'O'].includes(world[west.row][west.column]) &&
      !tempQueue.find((c) => c.row === west.row && c.column === west.column)
    ) {
      newCoordinates.push(west);
      world[west.row][west.column] = 'O';
    }

    return newCoordinates;
  };

  let queue = [start];
  let stepCount: number = 0;
  let tempQueue: Coordinate[] = [];
  while (queue.length) {
    tempQueue = [];
    while (queue.length) {
      const coordinate = queue.shift()!;
      const next = step(coordinate);
      tempQueue.push(...next);
    }

    console.log('step', stepCount, tempQueue.length);
    console.log(world.map((s) => s.join('')).join('\n'));
    if (++stepCount === 50) {
      return tempQueue.length.toString();
      tempQueue = [];
    }

    queue = tempQueue;
  }

  throw new Error();
};
