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
          // This beam goes North
          const newBeam = beam.clone();
          beam.goNorth();

          // New beam goes South
          return newBeam.goSouth();
        }
      }
      break;
    }
    case '-': {
      switch (direction) {
        case 'north': // N/S doesn't matter
        case 'south': {
          // This beam goes West
          const newBeam = beam.clone();
          beam.goWest();

          // New beam goes East
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

export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  const spaces: Spaces = lines.map<Space[]>((line, row) =>
    [...line].map<Space>((value, column) => ({
      value: value as SpaceChar,
      coordinate: { row, column },
      isEnergized: false,
      previousBeamDirections: new Set(),
    }))
  );

  let beamCounter = 0;
  const beams: Map<number, Beam> = new Map([
    [beamCounter, new Beam({ row: 0, column: 0 }, 'east')],
  ]);

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

      console.log(
        spaces.map((s) => s.map((x) => (x.isEnergized ? '#' : x.value)).join('')).join('\n')
      );

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
  // const lines = input.split('\n').filter(Boolean);

  // const loop = (beams: Map<number, Beam>) => {
  //   while (true) {
  //     let iterating = false;
  //     for (const [beamNum, beam] of beams.entries()) {
  //       const { coordinate, direction } = beam;
  //       const { row, column } = coordinate;
  //       if (row < 0 || row >= spaces.length || column < 0 || column >= spaces[0].length) {
  //         // Beam fell of the edge, kill it.
  //         beams.delete(beamNum);
  //         continue;
  //       }

  //       if (spaces[row][column].previousBeamDirections.has(direction)) {
  //         // A beam going this direction has already been in this space!
  //         // No need to keep this beam around, the other beam is fine.
  //         beams.delete(beamNum);
  //         continue;
  //       }

  //       iterating = true;
  //       spaces[row][column].isEnergized = true;
  //       spaces[row][column].previousBeamDirections.add(direction);
  //       switch (spaces[row][column].value) {
  //         case '.': {
  //           switch (direction) {
  //             case 'north': {
  //               position.row--;
  //               break;
  //             }
  //             case 'south': {
  //               position.row++;
  //               break;
  //             }
  //             case 'east': {
  //               position.column++;
  //               break;
  //             }
  //             case 'west': {
  //               position.column--;
  //               break;
  //             }
  //           }
  //           break;
  //         }
  //         case '/': {
  //           switch (direction) {
  //             case 'north': {
  //               position.column++;
  //               beam.direction = 'east';
  //               break;
  //             }
  //             case 'south': {
  //               position.column--;
  //               beam.direction = 'west';
  //               break;
  //             }
  //             case 'east': {
  //               position.row--;
  //               beam.direction = 'north';
  //               break;
  //             }
  //             case 'west': {
  //               position.row++;
  //               beam.direction = 'south';
  //               break;
  //             }
  //           }
  //           break;
  //         }
  //         case '\\': {
  //           switch (direction) {
  //             case 'north': {
  //               position.column--;
  //               beam.direction = 'west';
  //               break;
  //             }
  //             case 'south': {
  //               position.column++;
  //               beam.direction = 'east';
  //               break;
  //             }
  //             case 'east': {
  //               position.row++;
  //               beam.direction = 'south';
  //               break;
  //             }
  //             case 'west': {
  //               position.row--;
  //               beam.direction = 'north';
  //               break;
  //             }
  //           }
  //           break;
  //         }
  //         case '|': {
  //           switch (direction) {
  //             case 'north': {
  //               position.row--;
  //               break;
  //             }
  //             case 'south': {
  //               position.row++;
  //               break;
  //             }
  //             case 'east': {
  //               // This beam goes North
  //               const newBeam = beam.clone();
  //               position.row--;
  //               beam.direction = 'north';

  //               // New beam goes South
  //               newBeam.position.row++;
  //               newBeam.direction = 'south';
  //               const newBeamNum = Math.max(...beams.keys()) + 1;
  //               beams.set(newBeamNum, newBeam);
  //               break;
  //             }
  //             case 'west': {
  //               const newBeam = beam.clone();
  //               // This beam goes North
  //               position.row--;
  //               beam.direction = 'north';

  //               // New beam goes South
  //               newBeam.position.row++;
  //               newBeam.direction = 'south';
  //               const newBeamNum = Math.max(...beams.keys()) + 1;
  //               beams.set(newBeamNum, newBeam);
  //               break;
  //             }
  //           }
  //           break;
  //         }
  //         case '-': {
  //           switch (direction) {
  //             case 'north': {
  //               // This beam goes West
  //               const newBeam = structuredClone(beam);
  //               position.column--;
  //               beam.direction = 'west';

  //               // New beam goes East
  //               newBeam.position.column++;
  //               newBeam.direction = 'east';
  //               const newBeamNum = Math.max(...beams.keys()) + 1;
  //               beams.set(newBeamNum, newBeam);
  //               break;
  //             }
  //             case 'south': {
  //               // This beam goes West
  //               const newBeam = structuredClone(beam);
  //               position.column--;
  //               beam.direction = 'west';

  //               // New beam goes East
  //               newBeam.position.column++;
  //               newBeam.direction = 'east';
  //               const newBeamNum = Math.max(...beams.keys()) + 1;
  //               beams.set(newBeamNum, newBeam);
  //               break;
  //             }
  //             case 'east': {
  //               position.column++;
  //               break;
  //             }
  //             case 'west': {
  //               position.column--;
  //               break;
  //             }
  //           }
  //           break;
  //         }
  //       }
  //     }

  //     if (!iterating) {
  //       break;
  //     }
  //   }
  // };

  // let spaces: Space[][] = lines.map<Space[]>((line, row) =>
  //   [...line].map<Space>((value, column) => ({
  //     value: value as SpaceChar,
  //     coordinate: { row, column },
  //     isEnergized: false,
  //     previousBeamDirections: new Set(),
  //   }))
  // );

  // let max = Number.MIN_SAFE_INTEGER;
  // for (const row of [0, spaces.length - 1]) {
  //   for (let column = 0; column < spaces[0].length; column++) {
  //     spaces = lines.map<Space[]>((line, row) =>
  //       [...line].map<Space>((value, column) => ({
  //         value: value as SpaceChar,
  //         coordinate: { row, column },
  //         isEnergized: false,
  //         previousBeamDirections: new Set(),
  //       }))
  //     );

  //     const beams: Map<number, { position: Coordinate; direction: Direction }> = new Map([
  //       [0, { position: { row, column }, direction: row === 0 ? 'south' : 'north' }],
  //     ]);

  //     loop(beams);

  //     let count = 0;
  //     for (let r = 0; r < spaces.length; r++) {
  //       for (let c = 0; c < spaces[r].length; c++) {
  //         if (spaces[r][c].isEnergized) {
  //           count++;
  //         }
  //       }
  //     }

  //     max = Math.max(max, count);
  //   }
  // }

  // for (const column of [0, spaces[0].length - 1]) {
  //   for (let row = 0; row < spaces.length; row++) {
  //     spaces = lines.map<Space[]>((line, row) =>
  //       [...line].map<Space>((value, column) => ({
  //         value: value as SpaceChar,
  //         coordinate: { row, column },
  //         isEnergized: false,
  //         previousBeamDirections: new Set(),
  //       }))
  //     );

  //     const beams: Map<number, { position: Coordinate; direction: Direction }> = new Map([
  //       [0, { position: { row, column }, direction: column === 0 ? 'east' : 'west' }],
  //     ]);

  //     loop(beams);

  //     let count = 0;
  //     for (let r = 0; r < spaces.length; r++) {
  //       for (let c = 0; c < spaces[r].length; c++) {
  //         if (spaces[r][c].isEnergized) {
  //           count++;
  //         }
  //       }
  //     }

  //     max = Math.max(max, count);
  //   }
  // }

  // console.log(spaces.map((s) => s.map((x) => (x.isEnergized ? '#' : x.value)).join('')).join('\n'));

  // return max.toString();

  return '';
};
