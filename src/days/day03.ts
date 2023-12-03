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

  const symbolLocations = lines.flatMap((line, lineNum) => {
    const indices: Array<{ index: number; value: string }> = [];
    for (let i = 0; i < line.length; i++) {
      if (line[i] !== '.' && !Number.isInteger(parseInt(line[i], 10))) {
        indices.push({ index: i, value: line[i] });
      }
    }

    return indices.map((x) => ({ lineNum, column: x.index, value: x.value }));
  });

  const partNumbers: Array<{
    location: { lineNum: number; index: number };
    value: number;
    neighboringSymbols: Array<{
      value: string;
      location: { lineNum: number; index: number };
    }>;
  }> = [];

  lines.forEach((line, lineNum) => {
    const regex = new RegExp(/\d+/g);
    const matches = [...line.matchAll(regex)].map((x) => ({ index: x.index!, value: x.at(0)! }));

    for (const number of matches) {
      const neighboringSymbols: Array<{
        value: string;
        location: { lineNum: number; index: number };
      }> = [];
      symbolLocations.forEach((symbol) => {
        if (
          Math.abs(symbol.lineNum - lineNum) <= 1 &&
          symbol.column >= number.index - 1 &&
          symbol.column <= number.index + number.value.length
        ) {
          neighboringSymbols.push({
            value: lines[symbol.lineNum]?.[symbol.column],
            location: { lineNum: symbol.lineNum, index: symbol.column },
          });
        }
      });

      if (symbolLocations.length) {
        partNumbers.push({
          location: { lineNum, index: number.index },
          value: parseInt(number.value, 10),
          neighboringSymbols,
        });
      }
    }
  });

  const gearRatios: number[] = [];
  symbolLocations
    .filter((s) => s.value === '*')
    .forEach((symbol) => {
      const neighboringPartNumbers: number[] = [];
      partNumbers.forEach((p) => {
        if (
          p.neighboringSymbols.find(
            (s) =>
              s.value === '*' &&
              s.location.lineNum === symbol.lineNum &&
              s.location.index === symbol.column
          )
        ) {
          neighboringPartNumbers.push(p.value);
        }
      });

      if (neighboringPartNumbers.length === 2) {
        gearRatios.push(neighboringPartNumbers[0]! * neighboringPartNumbers[1]!);
      }
    });

  return sumArray(gearRatios).toString();
};
