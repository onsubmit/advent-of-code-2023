type RangeData = {
  destinationStart: number;
  sourceStart: number;
  length: number;
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
    let mappedVal = seed;
    for (const map of maps) {
      const data = map.find(
        (x) => mappedVal >= x.sourceStart && mappedVal <= x.sourceStart + x.length
      );

      mappedVal = data ? data.destinationStart + (mappedVal - data.sourceStart) : mappedVal;
    }

    minLocationNumber = Math.min(minLocationNumber, mappedVal);
  }

  return minLocationNumber.toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  return lines.join();
};
