import { getPartOneSolution, getPartTwoSolution } from '../days/day04';
import Day from './day';

export default function Day04() {
  const props = { day: 4, getPartOneSolution, getPartTwoSolution };
  return <Day {...props} />;
}
