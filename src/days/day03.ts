import { sumArray } from '../sumArray';

export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  const symbolLocations = lines.flatMap((line, lineNum) => {
    const indices: number[] = [];
    for (let i = 0; i < line.length; i++) {
      if (line[i] !== '.' && !Number.isInteger(parseInt(line[i], 10))) {
        indices.push(i);
      }
    }

    return indices.map((x) => ({ lineNum, column: x }));
  });

  const partNumbers: number[] = [];
  lines.forEach((line, lineNum) => {
    const regex = new RegExp(/\d+/g);
    const matches = [...line.matchAll(regex)].map((x) => ({ index: x.index!, value: x.at(0)! }));

    for (const number of matches) {
      const isPartNumber = symbolLocations.some((symbol) => {
        if (
          Math.abs(symbol.lineNum - lineNum) <= 1 &&
          symbol.column >= number.index - 1 &&
          symbol.column <= number.index + number.value.length
        ) {
          return true;
        } else {
          return false;
        }
      });

      if (isPartNumber) {
        partNumbers.push(parseInt(number.value, 10));
      }
    }
  });

  return sumArray(partNumbers).toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  const mapped = lines.map((line) => {
    return 0;
  });

  return sumArray(mapped).toString();
};
