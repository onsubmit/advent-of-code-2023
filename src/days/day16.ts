import { Coordinate } from '../coordinate';

type SpaceChar = '.' | '/' | '\\' | '|' | '-';
type Direction = 'north' | 'south' | 'east' | 'west';
type Space = {
  value: SpaceChar;
  coordinate: Coordinate;
  isEnergized: boolean;
  previousBeamDirections: Set<Direction>;
};
type Spaces = Array<Array<Space>>;

class Beam {
  private _coordinate: Coordinate;
  private _direction: Direction;

  constructor(coordinate: Coordinate, direction: Direction) {
    this._coordinate = coordinate;
    this._direction = direction;
  }

  get coordinate(): Coordinate {
    return this._coordinate;
  }

  get direction(): Direction {
    return this._direction;
  }

  clone = (): Beam => new Beam({ ...this._coordinate }, this._direction);

  goNorth = (): this => {
    this._coordinate.row--;
    this._direction = 'north';
    return this;
  };

  goSouth = (): this => {
    this._coordinate.row++;
    this._direction = 'south';
    return this;
  };

  goEast = (): this => {
    this._coordinate.column++;
    this._direction = 'east';
    return this;
  };

  goWest = (): this => {
    this._coordinate.column--;
    this._direction = 'west';
    return this;
  };
}

const stepBeam = (space: Space, beam: Beam): Beam | void => {
  const { direction } = beam;

  switch (space.value) {
    case '.': {
      switch (direction) {
        case 'north':
          return beam.goNorth();
        case 'south':
          return beam.goSouth();
        case 'east':
          return beam.goEast();
        case 'west':
          return beam.goWest();
      }
      break;
    }
    case '/': {
      switch (direction) {
        case 'north':
          return beam.goEast();
        case 'south':
          return beam.goWest();
        case 'east':
          return beam.goNorth();
        case 'west':
          return beam.goSouth();
      }
      break;
    }
    case '\\': {
      switch (direction) {
        case 'north':
          return beam.goWest();
        case 'south':
          return beam.goEast();
        case 'east':
          return beam.goSouth();
        case 'west':
          return beam.goNorth();
      }
      break;
    }
    case '|': {
      switch (direction) {
        case 'north':
          return beam.goNorth();
        case 'south':
          return beam.goSouth();
        case 'east': // E/W doesn't matter
        case 'west': {
          const newBeam = beam.clone();
          beam.goNorth();
          return newBeam.goSouth();
        }
      }
      break;
    }
    case '-': {
      switch (direction) {
        case 'north': // N/S doesn't matter
        case 'south': {
          const newBeam = beam.clone();
          beam.goWest();
          return newBeam.goEast();
        }
        case 'east':
          return beam.goEast();
        case 'west':
          return beam.goWest();
      }
      break;
    }
  }
};

const getInitialSpaces = (lines: string[]): Spaces =>
  lines.map<Space[]>((line, row) =>
    [...line].map<Space>((value, column) => ({
      value: value as SpaceChar,
      coordinate: { row, column },
      isEnergized: false,
      previousBeamDirections: new Set(),
    }))
  );

const stepBeams = (spaces: Spaces, beams: Map<number, Beam>) => {
  let beamCounter = beams.size;
  while (true) {
    let areBeamsStepping = false;
    for (const [beamNum, beam] of beams.entries()) {
      const { coordinate, direction } = beam;
      const { row, column } = coordinate;
      if (row < 0 || row >= spaces.length || column < 0 || column >= spaces[0].length) {
        // Beam fell off the edge and isn't coming back. Stop tracking it.
        beams.delete(beamNum);
        continue;
      }

      const space = spaces[row][column];
      if (space.previousBeamDirections.has(direction)) {
        // A beam going this direction has already been in this space!
        // There's no need to keep it around since it will follow the
        // the same path of the previous beam.
        beams.delete(beamNum);
        continue;
      }

      areBeamsStepping = true;
      space.isEnergized = true;
      space.previousBeamDirections.add(direction);

      const newBeam = stepBeam(space, beam);
      if (newBeam) {
        beams.set(++beamCounter, newBeam);
      }
    }

    if (!areBeamsStepping) {
      break;
    }
  }
};

export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);
  const spaces = getInitialSpaces(lines);

  const beams: Map<number, Beam> = new Map([[0, new Beam({ row: 0, column: 0 }, 'east')]]);
  stepBeams(spaces, beams);

  let count = 0;
  for (let r = 0; r < spaces.length; r++) {
    for (let c = 0; c < spaces[r].length; c++) {
      if (spaces[r][c].isEnergized) {
        count++;
      }
    }
  }

  return count.toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  let spaces = getInitialSpaces(lines);

  let max = Number.MIN_SAFE_INTEGER;
  for (const row of [0, spaces.length - 1]) {
    for (let column = 0; column < spaces[0].length; column++) {
      spaces = getInitialSpaces(lines);

      const beams: Map<number, Beam> = new Map([
        [0, new Beam({ row, column }, row === 0 ? 'south' : 'north')],
      ]);

      stepBeams(spaces, beams);

      let count = 0;
      for (let r = 0; r < spaces.length; r++) {
        for (let c = 0; c < spaces[r].length; c++) {
          if (spaces[r][c].isEnergized) {
            count++;
          }
        }
      }

      max = Math.max(max, count);
    }
  }

  for (const column of [0, spaces[0].length - 1]) {
    for (let row = 0; row < spaces.length; row++) {
      spaces = getInitialSpaces(lines);

      const beams: Map<number, Beam> = new Map([
        [0, new Beam({ row, column }, column === 0 ? 'east' : 'west')],
      ]);

      stepBeams(spaces, beams);

      let count = 0;
      for (let r = 0; r < spaces.length; r++) {
        for (let c = 0; c < spaces[r].length; c++) {
          if (spaces[r][c].isEnergized) {
            count++;
          }
        }
      }

      max = Math.max(max, count);
    }
  }

  return max.toString();
};
