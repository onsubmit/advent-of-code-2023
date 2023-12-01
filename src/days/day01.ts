import FileReader from '../fileReader';
import { sumArray } from '../sumArray';
import Day from './day';

export default class Day01 extends Day {
  getPartOneSolution = (): string => {
    const numbers = FileReader.getLines('../input/day01-1.txt', (line) => {
      const first = line.match(/\d/)?.at(0);
      const last = [...line].reverse().join().match(/\d/)?.at(0);
      return parseInt(`${first}${last}`, 10);
    });

    return sumArray(numbers).toString();
  };

  getPartTwoSolution = (): string => {
    return '0';
  };
}
