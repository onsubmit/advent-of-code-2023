import { getPartOneSolution, getPartTwoSolution } from '../days/day05';
import Day from './day';

export default function Day05() {
  const props = { day: 5, getPartOneSolution, getPartTwoSolution };
  return <Day {...props} />;
}
