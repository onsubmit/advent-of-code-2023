import { getPartOneSolution, getPartTwoSolution } from '../days/day01';
import Day from './day';

export default function Day01() {
  const props = { day: 1, getPartOneSolution, getPartTwoSolution };
  return <Day {...props} />;
}
