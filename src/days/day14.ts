type Space = '.' | '#' | 'O';
type Direction = 'north' | 'south' | 'east' | 'west';

class Platform {
  private _spaces: Array<Array<Space>>;
  private readonly _rows: number;
  private readonly _columns: number;

  constructor(lines: string[]) {
    this._spaces = lines.map<Array<Space>>((line) => [...line] as Array<Space>);
    this._rows = this._spaces.length;
    this._columns = this._spaces[0].length;
  }

  tiltLever = (slideDirection: Direction) => {
    switch (slideDirection) {
      case 'north':
        return this._slideNorth();
      case 'south':
        return this._slideSouth();
      case 'east':
        return this._slideEast();
      case 'west':
        return this._slideWest();
    }
  };

  cycle = () => {
    this.tiltLever('north');
    this.tiltLever('west');
    this.tiltLever('south');
    this.tiltLever('east');
  };

  getTotalLoad = (): number => {
    let sum = 0;
    for (let r = 0; r < this._rows; r++) {
      sum += (this._rows - r) * this._spaces[r].filter((s) => s === 'O').length;
    }

    return sum;
  };

  toString = (): string => this._spaces.map((s) => s.join('')).join('\n');

  private _slideNorth = () => {
    while (true) {
      let didSlide = false;
      for (let c = 0; c < this._columns; c++) {
        for (let r = 1; r < this._rows; r++) {
          if (this._spaces[r - 1][c] === '.' && this._spaces[r][c] === 'O') {
            this._spaces[r - 1][c] = 'O';
            this._spaces[r][c] = '.';
            didSlide = true;
          }
        }
      }

      if (!didSlide) {
        return;
      }
    }
  };

  private _slideSouth = () => {
    while (true) {
      let didSlide = false;
      for (let c = 0; c < this._columns; c++) {
        for (let r = this._rows - 2; r >= 0; r--) {
          if (this._spaces[r + 1][c] === '.' && this._spaces[r][c] === 'O') {
            this._spaces[r + 1][c] = 'O';
            this._spaces[r][c] = '.';
            didSlide = true;
          }
        }
      }

      if (!didSlide) {
        return;
      }
    }
  };

  private _slideEast = () => {
    while (true) {
      let didSlide = false;
      for (let r = 0; r < this._rows; r++) {
        for (let c = this._columns - 2; c >= 0; c--) {
          if (this._spaces[r][c + 1] === '.' && this._spaces[r][c] === 'O') {
            this._spaces[r][c + 1] = 'O';
            this._spaces[r][c] = '.';
            didSlide = true;
          }
        }
      }

      if (!didSlide) {
        return;
      }
    }
  };

  private _slideWest = () => {
    while (true) {
      let didSlide = false;
      for (let r = 0; r < this._rows; r++) {
        for (let c = 1; c < this._columns; c++) {
          if (this._spaces[r][c - 1] === '.' && this._spaces[r][c] === 'O') {
            this._spaces[r][c - 1] = 'O';
            this._spaces[r][c] = '.';
            didSlide = true;
          }
        }
      }

      if (!didSlide) {
        return;
      }
    }
  };
}

export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  const platform = new Platform(lines);
  platform.tiltLever('north');

  return platform.getTotalLoad().toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  const getTotalLoad = () => {
    const platform = new Platform(lines);
    const platformToCycleMap: Map<string, number> = new Map();
    const cycleToTotalLoadMap: Map<number, number> = new Map();

    const maxCycle = 1_000_000_000;
    for (let cycle = 0; cycle < maxCycle; cycle++) {
      const platformStringRepresentation = platform.toString();

      const previousCycleStart = platformToCycleMap.get(platformStringRepresentation);
      if (previousCycleStart !== undefined) {
        const minCyclesNeeded =
          previousCycleStart + ((maxCycle - previousCycleStart) % (cycle - previousCycleStart));
        return cycleToTotalLoadMap.get(minCyclesNeeded)!;
      }

      platformToCycleMap.set(platformStringRepresentation, cycle);
      cycleToTotalLoadMap.set(cycle, platform.getTotalLoad());
      platform.cycle();
    }

    throw new Error('No cycle detected, try again nerd.');
  };

  return getTotalLoad().toString();
};
