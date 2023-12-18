import { Coordinate } from '../coordinate';

type Direction = 'U' | 'D' | 'L' | 'R';
type Plan = {
  direction: Direction;
  distance: number;
  hex: string;
};

const getCoordinateKey = (c: Coordinate) => {
  return [c.row, c.column].join(',');
};

const iterativeFloodFill = (row: number, column: number, arr: string[][]) => {
  const queue: Coordinate[] = [{ row, column }];
  while (queue.length) {
    const { row: r, column: c } = queue.pop()!;
    arr[r][c] = '#';

    if (arr[r + 1]?.[c] === '.') {
      queue.push({ row: r + 1, column: c });
    }

    if (arr[r - 1]?.[c] === '.') {
      queue.push({ row: r - 1, column: c });
    }

    if (arr[r]?.[c + 1] === '.') {
      queue.push({ row: r, column: c + 1 });
    }

    if (arr[r]?.[c - 1] === '.') {
      queue.push({ row: r, column: c - 1 });
    }
  }
};

export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  const plans = lines.map<Plan>((line) => {
    const [dir, dist, hex] = line.split(' ');
    const direction = dir as Direction;
    const distance = parseInt(dist, 10);
    return { direction, distance, hex };
  });

  const trench: Map<string, string> = new Map();
  const current: Coordinate = { row: 0, column: 0 };

  let minRow = Number.MAX_SAFE_INTEGER;
  let minCol = Number.MAX_SAFE_INTEGER;
  let maxRow = Number.MIN_SAFE_INTEGER;
  let maxCol = Number.MIN_SAFE_INTEGER;

  trench.set(getCoordinateKey(current), '#');
  const adjustCurrentFns: Record<Direction, () => void> = {
    R: () => current.column++,
    L: () => current.column--,
    U: () => current.row--,
    D: () => current.row++,
  };

  for (const plan of plans) {
    for (let i = 0; i < plan.distance; i++) {
      adjustCurrentFns[plan.direction]();

      minRow = Math.min(minRow, current.row);
      minCol = Math.min(minCol, current.column);
      maxRow = Math.max(maxRow, current.row);
      maxCol = Math.max(maxCol, current.column);

      trench.set(getCoordinateKey(current), '#');
    }
  }

  const trenchArray = Array.from({ length: maxRow - minRow + 1 }, (_, row) =>
    Array.from({ length: maxCol - minCol + 1 }, (_, col) => {
      return trench.has(getCoordinateKey({ row: row + minRow, column: col + minCol })) ? '#' : '.';
    })
  );

  // By input inspection, (75,4) is "interior".
  iterativeFloodFill(75, 4, trenchArray);

  let count = 0;
  for (let r = 0; r < trenchArray.length; r++) {
    for (let c = 0; c < trenchArray[r].length; c++) {
      if (trenchArray[r][c] === '#') {
        count++;
      }
    }
  }

  return count.toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  const plans: Plan[] = lines.map((line) => {
    const hex = line.split(' ').at(-1)!;
    const hexArr = [...hex];
    const directions: Direction[] = ['R', 'D', 'L', 'U'];
    hexArr.pop(); // )
    const direction = directions[parseInt(hexArr.pop()!, 10)];
    const distance = parseInt(hexArr.slice(2).join(''), 16);
    return { direction, distance, hex };
  });

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
  return (interiorPoints + numBoundaryPoints).toString();
};
