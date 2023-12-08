import { getLeastCommonMultipleForArray } from '../math';

type Elements = {
  left: string;
  right: string;
};

export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  const instructions = [...lines[0]];
  const elementsMap = new Map<string, Elements>();
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const split = line.split('=');
    const start = split[0].trim();

    const split2 = split[1].split(',');
    const left = split2[0].trim().substring(1);
    const right = split2[1].trim().substring(0, 3);
    elementsMap.set(start, { left, right });
  }

  let i = 0;
  let current = 'AAA';
  while (current !== 'ZZZ') {
    const direction = instructions[i++ % instructions.length];
    const { left, right } = elementsMap.get(current)!;
    current = direction === 'R' ? right : left;
  }

  return i.toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  const instructions = [...lines[0]];
  const elementsMap = new Map<string, Elements>();
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const split = line.split('=');
    const start = split[0].trim();

    const split2 = split[1].split(',');
    const left = split2[0].trim().substring(1);
    const right = split2[1].trim().substring(0, 3);
    elementsMap.set(start, { left, right });
  }

  const startingPoints = [...elementsMap.keys()].filter((k) => k.endsWith('A'));
  const cycles = new Map<string, string[]>(startingPoints.map((c) => [c, []]));

  let i = 0;
  for (const startingPoint of startingPoints) {
    let elementAlongCycle = startingPoint;
    while (!elementAlongCycle.endsWith('Z')) {
      const direction = instructions[i++ % instructions.length];
      const { left, right } = elementsMap.get(elementAlongCycle)!;
      elementAlongCycle = direction === 'R' ? right : left;
      cycles.get(startingPoint)?.push(elementAlongCycle);
    }
  }

  const cycleLengths = [...cycles.values()].map((v) => v.length);
  return getLeastCommonMultipleForArray(cycleLengths).toString();
};
