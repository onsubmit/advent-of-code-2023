import { sumArray } from '../sumArray';

type Location = {
  row: number;
  column: number;
};

type EnginePart = {
  type: 'number' | 'symbol';
  value: string;
  location: Location;
};

type EngineSymbolData = {
  location: Location;
  neighboringParts: Array<EnginePart>;
};

type EngineSymbols = Map<string, Array<EngineSymbolData>>;

export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  const engineSymbols: EngineSymbols = new Map();
  lines.forEach((line, lineNum) => {
    for (let i = 0; i < line.length; i++) {
      const symbol = line[i];
      if (symbol !== '.' && !Number.isInteger(parseInt(symbol, 10))) {
        if (!engineSymbols.has(symbol)) {
          engineSymbols.set(symbol, []);
        }

        engineSymbols
          .get(symbol)
          ?.push({ location: { row: lineNum, column: i }, neighboringParts: [] });
      }
    }
  });

  lines.forEach((line, lineNum) => {
    const engineNumbers = [...line.matchAll(/\d+/g)].map<EnginePart>((match) => ({
      type: 'number',
      value: match[0],
      location: { row: lineNum, column: match.index! },
    }));

    for (const engineNumber of engineNumbers) {
      engineSymbols.forEach((symbolData) => {
        symbolData.forEach((symbol) => {
          if (
            Math.abs(symbol.location.row - lineNum) <= 1 &&
            symbol.location.column >= engineNumber.location.column - 1 &&
            symbol.location.column <= engineNumber.location.column + engineNumber.value.length
          ) {
            symbol.neighboringParts.push(engineNumber);
          }
        });
      });
    }
  });

  const partNumberValues: number[] = [];
  engineSymbols.forEach((symbolData) => {
    symbolData.forEach((symbol) => {
      symbol.neighboringParts.forEach(({ value }) => {
        partNumberValues.push(parseInt(value, 10));
      });
    });
  });

  return sumArray(partNumberValues).toString();
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
