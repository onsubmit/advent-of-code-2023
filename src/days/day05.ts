type Data = {
  destinationRangeStart: number;
  sourceRangeStart: number;
  rangeLength: number;
};

export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n');

  let seeds: number[] = [];
  const seedToSoil: Array<Data> = [];
  const soilToFertilizer: Array<Data> = [];
  const fertilizerToWater: Array<Data> = [];
  const waterToLight: Array<Data> = [];
  const lightToTemperature: Array<Data> = [];
  const temperatureToHumidity: Array<Data> = [];
  const humidityToLocation: Array<Data> = [];

  let mapType:
    | 'none'
    | 'seed-to-soil'
    | 'soil-to-fertilizer'
    | 'fertilizer-to-water'
    | 'water-to-light'
    | 'light-to-temperature'
    | 'temperature-to-humidity'
    | 'humidity-to-location' = 'none';

  lines.forEach((line) => {
    if (!line.trim()) {
      mapType = 'none';
      return;
    }

    if (line.startsWith('seeds:')) {
      seeds = line
        .split(':')[1]
        .trim()
        .split(' ')
        .filter(Boolean)
        .map((d) => parseInt(d, 10));
      return;
    }

    if (line.startsWith('seed-to-soil map:')) {
      mapType = 'seed-to-soil';
      return;
    }

    if (mapType === 'seed-to-soil') {
      const [destinationRangeStart, sourceRangeStart, rangeLength] = line
        .split(' ')
        .filter(Boolean)
        .map((d) => parseInt(d, 10));

      seedToSoil.push({
        destinationRangeStart,
        sourceRangeStart,
        rangeLength,
      });

      return;
    }

    if (line.startsWith('soil-to-fertilizer map:')) {
      mapType = 'soil-to-fertilizer';
      return;
    }

    if (mapType === 'soil-to-fertilizer') {
      const [destinationRangeStart, sourceRangeStart, rangeLength] = line
        .split(' ')
        .filter(Boolean)
        .map((d) => parseInt(d, 10));

      soilToFertilizer.push({
        destinationRangeStart,
        sourceRangeStart,
        rangeLength,
      });

      return;
    }

    if (line.startsWith('fertilizer-to-water map:')) {
      mapType = 'fertilizer-to-water';
      return;
    }

    if (mapType === 'fertilizer-to-water') {
      const [destinationRangeStart, sourceRangeStart, rangeLength] = line
        .split(' ')
        .filter(Boolean)
        .map((d) => parseInt(d, 10));

      fertilizerToWater.push({
        destinationRangeStart,
        sourceRangeStart,
        rangeLength,
      });

      return;
    }

    if (line.startsWith('water-to-light map:')) {
      mapType = 'water-to-light';
      return;
    }

    if (mapType === 'water-to-light') {
      const [destinationRangeStart, sourceRangeStart, rangeLength] = line
        .split(' ')
        .filter(Boolean)
        .map((d) => parseInt(d, 10));

      waterToLight.push({
        destinationRangeStart,
        sourceRangeStart,
        rangeLength,
      });

      return;
    }

    if (line.startsWith('light-to-temperature map:')) {
      mapType = 'light-to-temperature';
      return;
    }

    if (mapType === 'light-to-temperature') {
      const [destinationRangeStart, sourceRangeStart, rangeLength] = line
        .split(' ')
        .filter(Boolean)
        .map((d) => parseInt(d, 10));

      lightToTemperature.push({
        destinationRangeStart,
        sourceRangeStart,
        rangeLength,
      });

      return;
    }

    if (line.startsWith('temperature-to-humidity map:')) {
      mapType = 'temperature-to-humidity';
      return;
    }

    if (mapType === 'temperature-to-humidity') {
      const [destinationRangeStart, sourceRangeStart, rangeLength] = line
        .split(' ')
        .filter(Boolean)
        .map((d) => parseInt(d, 10));

      temperatureToHumidity.push({
        destinationRangeStart,
        sourceRangeStart,
        rangeLength,
      });

      return;
    }

    if (line.startsWith('humidity-to-location map:')) {
      mapType = 'humidity-to-location';
      return;
    }

    if (mapType === 'humidity-to-location') {
      const [destinationRangeStart, sourceRangeStart, rangeLength] = line
        .split(' ')
        .filter(Boolean)
        .map((d) => parseInt(d, 10));

      humidityToLocation.push({
        destinationRangeStart,
        sourceRangeStart,
        rangeLength,
      });

      return;
    }
  });

  let minLocationNumber = Number.MAX_SAFE_INTEGER;
  for (const seed of seeds) {
    const soilData = seedToSoil.find(
      (x) => seed >= x.sourceRangeStart && seed <= x.sourceRangeStart + x.rangeLength
    );
    const soil = soilData
      ? soilData.destinationRangeStart + (seed - soilData.sourceRangeStart)
      : seed;

    const fertilizerData = soilToFertilizer.find(
      (x) => soil >= x.sourceRangeStart && soil <= x.sourceRangeStart + x.rangeLength
    );
    const fertilizer = fertilizerData
      ? fertilizerData.destinationRangeStart + (soil - fertilizerData.sourceRangeStart)
      : soil;

    const waterData = fertilizerToWater.find(
      (x) => fertilizer >= x.sourceRangeStart && fertilizer <= x.sourceRangeStart + x.rangeLength
    );
    const water = waterData
      ? waterData.destinationRangeStart + (fertilizer - waterData.sourceRangeStart)
      : fertilizer;

    const lightData = waterToLight.find(
      (x) => water >= x.sourceRangeStart && water <= x.sourceRangeStart + x.rangeLength
    );
    const light = lightData
      ? lightData.destinationRangeStart + (water - lightData.sourceRangeStart)
      : water;

    const temperatureData = lightToTemperature.find(
      (x) => light >= x.sourceRangeStart && light <= x.sourceRangeStart + x.rangeLength
    );
    const temperature = temperatureData
      ? temperatureData.destinationRangeStart + (light - temperatureData.sourceRangeStart)
      : light;

    const humidityData = temperatureToHumidity.find(
      (x) => temperature >= x.sourceRangeStart && temperature <= x.sourceRangeStart + x.rangeLength
    );
    const humidity = humidityData
      ? humidityData.destinationRangeStart + (temperature - humidityData.sourceRangeStart)
      : temperature;

    const locationData = humidityToLocation.find(
      (x) => humidity >= x.sourceRangeStart && humidity <= x.sourceRangeStart + x.rangeLength
    );
    const location = locationData
      ? locationData.destinationRangeStart + (humidity - locationData.sourceRangeStart)
      : humidity;

    minLocationNumber = Math.min(minLocationNumber, location);
  }

  return minLocationNumber.toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  return lines.join();
};
