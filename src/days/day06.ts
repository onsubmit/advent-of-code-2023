import { multiplyArray } from '../sumArray';

type Race = {
  time: number;
  currentDistanceRecord: number;
};

export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n');

  const times = lines[0]
    .split(':')[1]
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((d) => parseInt(d, 10));

  const distances = lines[1]
    .split(':')[1]
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((d) => parseInt(d, 10));

  const races: Race[] = times.map((_, i) => ({
    time: times[i],
    currentDistanceRecord: distances[i],
  }));

  const numWaysToWin: number[] = [];

  for (const race of races) {
    const winners = Array.from({ length: race.time }, (_, i) => i).filter(
      (s) => (race.time - s) * s > race.currentDistanceRecord
    );
    numWaysToWin.push(winners.length);
  }

  return multiplyArray(numWaysToWin).toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n');

  const time = parseInt(lines[0].split(':')[1].trim().replaceAll(' ', ''));
  const currentDistanceRecord = parseInt(lines[1].split(':')[1].trim().replaceAll(' ', ''));

  const winners = Array.from({ length: time }, (_, i) => i).filter(
    (s) => (time - s) * s > currentDistanceRecord
  );

  return winners.length.toString();
};
