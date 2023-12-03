import { getPartOneSolution, getPartTwoSolution } from '../days/day03';
import Day from './day';

export default function Day03() {
  const props = { day: 3, getPartOneSolution, getPartTwoSolution };
  return <Day {...props} />;
}
