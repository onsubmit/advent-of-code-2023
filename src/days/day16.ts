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
type Beam = {
  position: Coordinate;
  direction: Direction;
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
    [beamCounter, { position: { row: 0, column: 0 }, direction: 'east' }],
  ]);

  while (true) {
    let iterating = false;
    for (const [beamNum, beam] of beams.entries()) {
      const { position, direction } = beam;
      const { row, column } = position;
      if (row < 0 || row >= spaces.length || column < 0 || column >= spaces[0].length) {
        // Beam fell of the edge, kill it.
        beams.delete(beamNum);
        continue;
      }

      if (spaces[row][column].previousBeamDirections.has(direction)) {
        // A beam going this direction has already been in this space!
        // No need to keep this beam around, the other beam is fine.
        beams.delete(beamNum);
        continue;
      }

      iterating = true;
      spaces[row][column].isEnergized = true;
      spaces[row][column].previousBeamDirections.add(direction);
      switch (spaces[row][column].value) {
        case '.': {
          switch (direction) {
            case 'north': {
              position.row--;
              break;
            }
            case 'south': {
              position.row++;
              break;
            }
            case 'east': {
              position.column++;
              break;
            }
            case 'west': {
              position.column--;
              break;
            }
          }
          break;
        }
        case '/': {
          switch (direction) {
            case 'north': {
              position.column++;
              beam.direction = 'east';
              break;
            }
            case 'south': {
              position.column--;
              beam.direction = 'west';
              break;
            }
            case 'east': {
              position.row--;
              beam.direction = 'north';
              break;
            }
            case 'west': {
              position.row++;
              beam.direction = 'south';
              break;
            }
          }
          break;
        }
        case '\\': {
          switch (direction) {
            case 'north': {
              position.column--;
              beam.direction = 'west';
              break;
            }
            case 'south': {
              position.column++;
              beam.direction = 'east';
              break;
            }
            case 'east': {
              position.row++;
              beam.direction = 'south';
              break;
            }
            case 'west': {
              position.row--;
              beam.direction = 'north';
              break;
            }
          }
          break;
        }
        case '|': {
          switch (direction) {
            case 'north': {
              position.row--;
              break;
            }
            case 'south': {
              position.row++;
              break;
            }
            case 'east': {
              // This beam goes North
              const newBeam = structuredClone(beam);
              position.row--;
              beam.direction = 'north';

              // New beam goes South
              newBeam.position.row++;
              newBeam.direction = 'south';
              beams.set(++beamCounter, newBeam);
              break;
            }
            case 'west': {
              const newBeam = structuredClone(beam);
              // This beam goes North
              position.row--;
              beam.direction = 'north';

              // New beam goes South
              newBeam.position.row++;
              newBeam.direction = 'south';
              beams.set(++beamCounter, newBeam);
              break;
            }
          }
          break;
        }
        case '-': {
          switch (direction) {
            case 'north': {
              // This beam goes West
              const newBeam = structuredClone(beam);
              position.column--;
              beam.direction = 'west';

              // New beam goes East
              newBeam.position.column++;
              newBeam.direction = 'east';
              beams.set(++beamCounter, newBeam);
              break;
            }
            case 'south': {
              // This beam goes West
              const newBeam = structuredClone(beam);
              position.column--;
              beam.direction = 'west';

              // New beam goes East
              newBeam.position.column++;
              newBeam.direction = 'east';
              beams.set(++beamCounter, newBeam);
              break;
            }
            case 'east': {
              position.column++;
              break;
            }
            case 'west': {
              position.column--;
              break;
            }
          }
          break;
        }
      }
    }

    if (!iterating) {
      break;
    }
  }

  console.log(spaces.map((s) => s.map((x) => (x.isEnergized ? '#' : x.value)).join('')).join('\n'));

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

  const loop = (beams: Map<number, { position: Coordinate; direction: Direction }>) => {
    while (true) {
      let iterating = false;
      for (const [beamNum, beam] of beams.entries()) {
        const { position, direction } = beam;
        const { row, column } = position;
        if (row < 0 || row >= spaces.length || column < 0 || column >= spaces[0].length) {
          // Beam fell of the edge, kill it.
          beams.delete(beamNum);
          continue;
        }

        if (spaces[row][column].previousBeamDirections.has(direction)) {
          // A beam going this direction has already been in this space!
          // No need to keep this beam around, the other beam is fine.
          beams.delete(beamNum);
          continue;
        }

        iterating = true;
        spaces[row][column].isEnergized = true;
        spaces[row][column].previousBeamDirections.add(direction);
        switch (spaces[row][column].value) {
          case '.': {
            switch (direction) {
              case 'north': {
                position.row--;
                break;
              }
              case 'south': {
                position.row++;
                break;
              }
              case 'east': {
                position.column++;
                break;
              }
              case 'west': {
                position.column--;
                break;
              }
            }
            break;
          }
          case '/': {
            switch (direction) {
              case 'north': {
                position.column++;
                beam.direction = 'east';
                break;
              }
              case 'south': {
                position.column--;
                beam.direction = 'west';
                break;
              }
              case 'east': {
                position.row--;
                beam.direction = 'north';
                break;
              }
              case 'west': {
                position.row++;
                beam.direction = 'south';
                break;
              }
            }
            break;
          }
          case '\\': {
            switch (direction) {
              case 'north': {
                position.column--;
                beam.direction = 'west';
                break;
              }
              case 'south': {
                position.column++;
                beam.direction = 'east';
                break;
              }
              case 'east': {
                position.row++;
                beam.direction = 'south';
                break;
              }
              case 'west': {
                position.row--;
                beam.direction = 'north';
                break;
              }
            }
            break;
          }
          case '|': {
            switch (direction) {
              case 'north': {
                position.row--;
                break;
              }
              case 'south': {
                position.row++;
                break;
              }
              case 'east': {
                // This beam goes North
                const newBeam = structuredClone(beam);
                position.row--;
                beam.direction = 'north';

                // New beam goes South
                newBeam.position.row++;
                newBeam.direction = 'south';
                const newBeamNum = Math.max(...beams.keys()) + 1;
                beams.set(newBeamNum, newBeam);
                break;
              }
              case 'west': {
                const newBeam = structuredClone(beam);
                // This beam goes North
                position.row--;
                beam.direction = 'north';

                // New beam goes South
                newBeam.position.row++;
                newBeam.direction = 'south';
                const newBeamNum = Math.max(...beams.keys()) + 1;
                beams.set(newBeamNum, newBeam);
                break;
              }
            }
            break;
          }
          case '-': {
            switch (direction) {
              case 'north': {
                // This beam goes West
                const newBeam = structuredClone(beam);
                position.column--;
                beam.direction = 'west';

                // New beam goes East
                newBeam.position.column++;
                newBeam.direction = 'east';
                const newBeamNum = Math.max(...beams.keys()) + 1;
                beams.set(newBeamNum, newBeam);
                break;
              }
              case 'south': {
                // This beam goes West
                const newBeam = structuredClone(beam);
                position.column--;
                beam.direction = 'west';

                // New beam goes East
                newBeam.position.column++;
                newBeam.direction = 'east';
                const newBeamNum = Math.max(...beams.keys()) + 1;
                beams.set(newBeamNum, newBeam);
                break;
              }
              case 'east': {
                position.column++;
                break;
              }
              case 'west': {
                position.column--;
                break;
              }
            }
            break;
          }
        }
      }

      if (!iterating) {
        break;
      }
    }
  };

  let spaces: Space[][] = lines.map<Space[]>((line, row) =>
    [...line].map<Space>((value, column) => ({
      value: value as SpaceChar,
      coordinate: { row, column },
      isEnergized: false,
      previousBeamDirections: new Set(),
    }))
  );

  let max = Number.MIN_SAFE_INTEGER;
  for (const row of [0, spaces.length - 1]) {
    for (let column = 0; column < spaces[0].length; column++) {
      spaces = lines.map<Space[]>((line, row) =>
        [...line].map<Space>((value, column) => ({
          value: value as SpaceChar,
          coordinate: { row, column },
          isEnergized: false,
          previousBeamDirections: new Set(),
        }))
      );

      const beams: Map<number, { position: Coordinate; direction: Direction }> = new Map([
        [0, { position: { row, column }, direction: row === 0 ? 'south' : 'north' }],
      ]);

      loop(beams);

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
      spaces = lines.map<Space[]>((line, row) =>
        [...line].map<Space>((value, column) => ({
          value: value as SpaceChar,
          coordinate: { row, column },
          isEnergized: false,
          previousBeamDirections: new Set(),
        }))
      );

      const beams: Map<number, { position: Coordinate; direction: Direction }> = new Map([
        [0, { position: { row, column }, direction: column === 0 ? 'east' : 'west' }],
      ]);

      loop(beams);

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

  console.log(spaces.map((s) => s.map((x) => (x.isEnergized ? '#' : x.value)).join('')).join('\n'));

  return max.toString();
};
