import { getLeastCommonMultipleForArray } from '../math';

type Elements = {
  left: string;
  right: string;
};

const INSTRUCTION_REGEX = /(?<ORIGIN>[A-Z]{3}) = \((?<LEFT>[A-Z]{3}), (?<RIGHT>[A-Z]{3})\)/;

const getElementsMap = (lines: string[]): Map<string, Elements> => {
  const elementsMap = new Map<string, Elements>();
  for (let i = 1; i < lines.length; i++) {
    const match = lines[i].match(INSTRUCTION_REGEX);
    const origin = match?.groups?.['ORIGIN'] ?? '';
    const left = match?.groups?.['LEFT'] ?? '';
    const right = match?.groups?.['RIGHT'] ?? '';
    elementsMap.set(origin, { left, right });
  }

  return elementsMap;
};

export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  const instructions = [...lines[0]];
  const elementsMap = getElementsMap(lines);

  let step = 0;
  let current = 'AAA';
  while (current !== 'ZZZ') {
    const direction = instructions[step++ % instructions.length];
    const { left, right } = elementsMap.get(current)!;
    current = direction === 'R' ? right : left;
  }

  return step.toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  const instructions = [...lines[0]];
  const elementsMap = getElementsMap(lines);

  const startingPoints = [...elementsMap.keys()].filter((k) => k.endsWith('A'));
  const paths = new Map<string, string[]>(startingPoints.map((c) => [c, []]));

  // Determine the paths from each starting to their ending node.
  let step = 0;
  for (const startingPoint of startingPoints) {
    let path = startingPoint;
    while (!path.endsWith('Z')) {
      const direction = instructions[step++ % instructions.length];
      const { left, right } = elementsMap.get(path)!;
      path = direction === 'R' ? right : left;
      paths.get(startingPoint)?.push(path);
    }
  }

  // Stars align when the step is the LCM of the path lengths.
  const pathLengths = [...paths.values()].map((path) => path.length);
  return getLeastCommonMultipleForArray(pathLengths).toString();
};
