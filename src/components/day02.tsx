import { getPartOneSolution, getPartTwoSolution } from '../days/day02';
import Day from './day';

export default function Day02() {
  const props = { day: 2, getPartOneSolution, getPartTwoSolution };
  return <Day {...props} />;
}
