import FileReader from '../fileReader';
import { sumArray } from '../sumArray';
import Day from './day';

const numberStrings = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

export default class Day01 extends Day {
  getPartOneSolution = (): string => {
    const numbers = FileReader.getLines('../input/day01-1.txt', (line) => {
      const matches = line.match(/\d/g);
      const first = matches?.at(0);
      const last = matches?.at(-1);
      return parseInt(`${first}${last}`, 10);
    });

    return sumArray(numbers).toString();
  };

  getPartTwoSolution = (): string => {
    const numbers = FileReader.getLines('../input/day01-2.txt', (line) => {
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

      return 10 * digits.at(0)! + digits.at(1)!;
    });

    return sumArray(numbers).toString();
  };
}
