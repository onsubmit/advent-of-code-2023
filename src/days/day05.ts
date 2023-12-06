type RangeData = {
  destinationStart: number;
  sourceStart: number;
  length: number;
};

type SeedInterval = {
  start: number;
  end: number;
};

const mapTypes = [
  'seed-to-soil',
  'soil-to-fertilizer',
  'fertilizer-to-water',
  'water-to-light',
  'light-to-temperature',
  'temperature-to-humidity',
  'humidity-to-location',
] as const;

export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n');

  let seeds: number[] = [];
  const maps: Array<Array<RangeData>> = [];

  for (const line of lines) {
    if (!line.trim()) {
      maps.push([]);
      continue;
    }

    if (line.startsWith('seeds:')) {
      seeds = line
        .split(':')[1]
        .trim()
        .split(' ')
        .filter(Boolean)
        .map((d) => parseInt(d, 10));
      continue;
    }

    if (mapTypes.some((mapType) => line.startsWith(mapType))) {
      continue;
    }

    const [destinationRangeStart, sourceRangeStart, rangeLength] = line
      .split(' ')
      .filter(Boolean)
      .map((d) => parseInt(d, 10));

    maps.at(-1)?.push({
      destinationStart: destinationRangeStart,
      sourceStart: sourceRangeStart,
      length: rangeLength,
    });
  }

  let minLocationNumber = Number.MAX_SAFE_INTEGER;
  for (const seed of seeds) {
    const location = getLocationForSeed(seed, maps);
    minLocationNumber = Math.min(minLocationNumber, location);
  }

  return minLocationNumber.toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n');

  const seedIntervals: SeedInterval[] = [];
  const maps: Array<Array<RangeData>> = [];

  for (const line of lines) {
    if (!line.trim()) {
      maps.push([]);
      continue;
    }

    if (line.startsWith('seeds:')) {
      const mapped = line
        .split(':')[1]
        .trim()
        .split(' ')
        .filter(Boolean)
        .map((d) => parseInt(d, 10));

      for (let i = 0; i < mapped.length; i += 2) {
        seedIntervals.push({ start: mapped[i], end: mapped[i] + mapped[i + 1] - 1 });
      }

      continue;
    }

    if (mapTypes.some((mapType) => line.startsWith(mapType))) {
      continue;
    }

    const [destinationRangeStart, sourceRangeStart, rangeLength] = line
      .split(' ')
      .filter(Boolean)
      .map((d) => parseInt(d, 10));

    maps.at(-1)?.push({
      destinationStart: destinationRangeStart,
      sourceStart: sourceRangeStart,
      length: rangeLength,
    });
  }

  let minLocationNumber = Number.MAX_SAFE_INTEGER;
  for (const seedInterval of seedIntervals) {
    for (let seed = seedInterval.start; seed <= seedInterval.end; seed++) {
      const location = getLocationForSeed(seed, maps);
      minLocationNumber = Math.min(minLocationNumber, location);
    }
  }

  return minLocationNumber.toString();
};

const getLocationForSeed = (seed: number, maps: Array<Array<RangeData>>): number => {
  let mappedVal = seed;
  for (const map of maps) {
    const data = map.find(
      (x) => mappedVal >= x.sourceStart && mappedVal < x.sourceStart + x.length
    );

    mappedVal = data ? data.destinationStart + (mappedVal - data.sourceStart) : mappedVal;
  }

  return mappedVal;
};
