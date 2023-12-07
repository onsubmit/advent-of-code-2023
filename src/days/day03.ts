import { sumArray } from '../arrayMethods';

type Location = {
  row: number;
  column: number;
};

type EngineNumberPart = {
  value: string;
  valueAsNumber: number;
  location: Location;
};

type EngineSymbolData = {
  location: Location;
  neighboringParts: Array<EngineNumberPart>;
};

type EngineSymbols = Map<string, Array<EngineSymbolData>>;

const getEngineSymbols = (lines: string[]): EngineSymbols => {
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
    const engineNumbers = [...line.matchAll(/\d+/g)].map<EngineNumberPart>((match) => ({
      value: match[0],
      valueAsNumber: parseInt(match[0], 10),
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

  return engineSymbols;
};

export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);
  const engineSymbols = getEngineSymbols(lines);

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
  const engineSymbols = getEngineSymbols(lines);

  const gears = engineSymbols
    .get('*')
    ?.filter(({ neighboringParts }) => neighboringParts.length === 2)
    .map(
      ({ neighboringParts }) =>
        neighboringParts[0].valueAsNumber * neighboringParts[1].valueAsNumber
    );

  return sumArray(gears!).toString();
};
