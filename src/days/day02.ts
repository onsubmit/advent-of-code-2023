import { sumArray } from '../arrayMethods';

export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  const successfulGameNums = lines
    .map((line, i) => {
      const gameNum = i + 1;
      const cubeSets = line
        .substring(line.indexOf(':') + 1)
        .trim()
        .split(';')
        .map((c) =>
          c
            .trim()
            .split(',')
            .map((x) => x.trim())
        );

      const isSuccessful = cubeSets.every((set) =>
        set.every((revealing) => {
          const match = revealing.match(/(?<AMOUNT>\d+) (?<COLOR>\S+)/);
          const color = match?.groups?.['COLOR'];
          const value = parseInt(match?.groups?.['AMOUNT'] ?? '0', 10);
          return (
            (color === 'red' && value <= 12) ||
            (color === 'green' && value <= 13) ||
            (color === 'blue' && value <= 14)
          );
        })
      );

      if (isSuccessful) {
        return gameNum;
      }
    })
    .filter(Boolean);

  return sumArray(successfulGameNums).toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);
  const maxes = lines.map((line) => {
    const cubeSets = line
      .substring(line.indexOf(':') + 1)
      .trim()
      .split(';')
      .map((c) =>
        c
          .trim()
          .split(',')
          .map((x) => x.trim())
      );

    const max = {
      red: Number.MIN_SAFE_INTEGER,
      blue: Number.MIN_SAFE_INTEGER,
      green: Number.MIN_SAFE_INTEGER,
    };

    for (const set of cubeSets) {
      for (const revealing of set) {
        const match = revealing.match(/(?<AMOUNT>\d+) (?<COLOR>\S+)/);
        const color = match?.groups?.['COLOR'];
        const value = parseInt(match?.groups?.['AMOUNT'] ?? '0', 10);
        color === 'red' && (max.red = Math.max(max.red, value));
        color === 'green' && (max.green = Math.max(max.green, value));
        color === 'blue' && (max.blue = Math.max(max.blue, value));
      }
    }

    return max;
  });

  return sumArray(maxes.map((m) => m.red * m.green * m.blue)).toString();
};
