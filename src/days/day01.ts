import { sumArray } from '../arrayMethods';

const numberStrings = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);
  const numbers = lines.map((line) => {
    const matches = line.match(/\d/g);
    const first = matches?.at(0);
    const last = matches?.at(-1);
    return parseInt(`${first}${last}`, 10);
  });

  return sumArray(numbers).toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);
  const numbers = lines.map((line) => {
    const regex = new RegExp(`\\d|${numberStrings.join('|')}`, 'g');

    const matches: string[] = [];
    let result: ReturnType<typeof regex.exec>;
    while ((result = regex.exec(line))) {
      matches.push(result.at(0)!);

      // Allow for overlapping strings by backtracking.
      regex.lastIndex = result.index + 1;
    }

    const digits = [matches.at(0)!, matches.at(-1)!].map((str) =>
      str.length > 1 ? numberStrings.indexOf(str) + 1 : parseInt(str, 10)
    );

    return 10 * digits[0] + digits[1];
  });

  return sumArray(numbers).toString();
};
