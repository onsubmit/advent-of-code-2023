import { Coordinate } from '../coordinate';

type Direction = 'U' | 'D' | 'L' | 'R';
type Plan = {
  direction: Direction;
  distance: number;
};

const getLavaAmount = (plans: Plan[]): number => {
  // Get all the corner coordinates.
  const current: Coordinate = { row: 0, column: 0 };
  const corners: Coordinate[] = [current];

  const adjustCurrentFns: Record<Direction, (amount: number) => void> = {
    R: (amount) => (current.column += amount),
    L: (amount) => (current.column -= amount),
    U: (amount) => (current.row -= amount),
    D: (amount) => (current.row += amount),
  };

  let numBoundaryPoints = 0;
  for (const plan of plans) {
    numBoundaryPoints += plan.distance;
    adjustCurrentFns[plan.direction](plan.distance);
    corners.push({ ...current });
  }

  // https://en.wikipedia.org/wiki/Shoelace_formula
  let area = 0;
  for (let i = 0; i < corners.length - 1; i++) {
    const cornerA = corners[i];
    const cornerB = corners[i + 1];
    area += (cornerA.row + cornerB.row) * (cornerA.column - cornerB.column);
  }

  area /= 2;

  // https://en.wikipedia.org/wiki/Pick%27s_theorem
  // A = i + b/2 - 1
  // i = A - b/2 + 1
  const interiorPoints = area - numBoundaryPoints / 2 + 1;
  return interiorPoints + numBoundaryPoints;
};

export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  const plans = lines.map<Plan>((line) => {
    const [dir, dist] = line.split(' ');
    const direction = dir as Direction;
    const distance = parseInt(dist, 10);
    return { direction, distance };
  });

  return getLavaAmount(plans).toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  const plans: Plan[] = lines.map((line) => {
    const directions: Direction[] = ['R', 'D', 'L', 'U'];
    const hexArr = [...line.split(' ').at(-1)!];
    const direction = directions[parseInt(hexArr.at(-2)!, 10)];
    const distance = parseInt(hexArr.slice(2, -2)!.join(''), 16);
    return { direction, distance };
  });

  return getLavaAmount(plans).toString();
};
