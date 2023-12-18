import { Coordinate } from '../coordinate';

type Direction = 'U' | 'D' | 'L' | 'R';
type Plan = {
  direction: Direction;
  distance: number;
  hex: string;
};

export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  const plans: Plan[] = lines.map((line) => {
    const [dir, dist, hex] = line.split(' ');
    const direction = dir as Direction;
    const distance = parseInt(dist, 10);
    return { direction, distance, hex };
  });

  const trench: Map<string, string> = new Map();
  const current: Coordinate = { row: 0, column: 0 };

  const coordinateKey = (c: Coordinate) => {
    return [c.row, c.column].join(',');
  };

  trench.set(coordinateKey(current), '#');

  for (const plan of plans) {
    for (let i = 0; i < plan.distance; i++) {
      switch (plan.direction) {
        case 'R': {
          current.column++;
          break;
        }
        case 'L': {
          current.column--;
          break;
        }
        case 'U': {
          current.row--;
          break;
        }
        case 'D': {
          current.row++;
          break;
        }
      }
      trench.set(coordinateKey(current), '#');
    }
  }

  // Dig interior
  const keys: Coordinate[] = [...trench.keys()].map((k) => {
    const [r, c] = k.split(',');
    const row = parseInt(r, 10);
    const column = parseInt(c, 10);
    return { row, column };
  });

  let minRow = Number.MAX_SAFE_INTEGER;
  let minCol = Number.MAX_SAFE_INTEGER;
  let maxRow = Number.MIN_SAFE_INTEGER;
  let maxCol = Number.MIN_SAFE_INTEGER;

  for (const key of keys) {
    const { row, column } = key;
    minRow = Math.min(minRow, row);
    minCol = Math.min(minCol, column);
    maxRow = Math.max(maxRow, row);
    maxCol = Math.max(maxCol, column);
  }

  const arr: string[][] = Array.from({ length: Math.abs(minRow) + Math.abs(maxRow) + 1 }, (_, r) =>
    Array.from({ length: Math.abs(minCol) + Math.abs(maxCol) + 1 }, (_, c) => {
      const cr = r + minRow;
      const cc = c + minCol;
      return trench.has(coordinateKey({ row: cr, column: cc })) ? '#' : '.';
    })
  );

  console.log(arr.map((l) => l.join('')).join('\n'));

  //let count = 0;
  //for (let r = 0; r < arr.length; r++) {
  //   // For each row, mark the beginning and endpoints of each row of pounds
  //   // The interior spaces will be between them.

  //   const chunks: Array<[number, number]> = [];
  //   for (let c = 0; c < arr[r].length; c++) {
  //     let inChunk = false;
  //     let start = -1;
  //     let end = -1;
  //     for (; c < arr[r].length; c++) {
  //       if (arr[r][c] === '#') {
  //         count++;
  //         if (!inChunk) {
  //           start = c;
  //         }
  //         if (c === arr[r].length - 1) {
  //           end = c;
  //         }
  //         inChunk = true;
  //       } else {
  //         if (inChunk) {
  //           end = c - 1;
  //         }
  //         break;
  //       }
  //     }

  //     if (start >= 0 && end >= 0) {
  //       chunks.push([start, end]);
  //     }
  //   }

  //   for (let i = 1; i < chunks.length; i++) {
  //     if (i % 2 === 1) {
  //       count += chunks[i][0] - chunks[i - 1][1] - 1;
  //     }
  //   }
  // }

  //   let inside = false;
  //   for (let c = 0; c < arr[r].length; c++) {
  //     if (arr[r][c] === '#') {
  //       let foundDot = false;
  //       for (; c < arr[r].length; c++) {
  //         if (arr[r][c] === '#') {
  //           count++;
  //         } else {
  //           foundDot = true;
  //           break;
  //         }
  //       }

  //       if (foundDot) {
  //         inside = !inside;
  //       }
  //     }

  //     if (inside && arr[r][c] === '.') {
  //       count++;
  //     }
  //   }
  // }

  //const arr2 = floodFill(arr, 75, 4, '#');

  //console.log(arr2.map((l) => l.join('')).join('\n'));

  floodFill(75, 4, arr);

  let count = 0;
  for (let r = 0; r < arr.length; r++) {
    for (let c = 0; c < arr[r].length; c++) {
      if (arr[r][c] === '#') {
        count++;
      }
    }
  }

  return count.toString();
};

const floodFill = (row: number, column: number, arr: string[][]) => {
  //here check_validity is a function that given coordinates of the point tells you whether
  //the point should be colored or not
  const q: Coordinate[] = [];
  q.push({ row, column });
  while (q.length) {
    const { row: r, column: c } = q.pop()!;
    arr[r][c] = '#';

    if (arr[r + 1]?.[c] === '.') {
      q.push({ row: r + 1, column: c });
    }

    if (arr[r - 1]?.[c] === '.') {
      q.push({ row: r - 1, column: c });
    }

    if (arr[r]?.[c + 1] === '.') {
      q.push({ row: r, column: c + 1 });
    }

    if (arr[r]?.[c - 1] === '.') {
      q.push({ row: r, column: c - 1 });
    }
  }

  //  while (q is not empty)
  //      (x1,y1) = q.pop()
  //      color(x1,y1)

  //      if (check_validity(x1+1,y1))
  //           q.push(x1+1,y1)
  //      if (check_validity(x1-1,y1))
  //           q.push(x1-1,y1)
  //      if (check_validity(x1,y1+1))
  //           q.push(x1,y1+1)
  //      if (check_validity(x1,y1-1))
  //           q.push(x1,y1-1)
};
// const floodFill = (arr: string[][], row: number, column: number, newColor: string) => {
//   //Get the input which needs to be replaced.
//   const current = arr[row][column];

//   //If the newColor is same as the existing
//   //Then return the original image.
//   if (current === newColor) {
//     return arr;
//   }

//   //Other wise call the fill function which will fill in the existing image.
//   fill(arr, row, column, newColor, current);

//   //Return the image once it is filled
//   return arr;
// };

// const fill = (arr: string[][], row: number, column: number, newColor: string, current: string) => {
//   //If row is less than 0
//   if (row < 0) {
//     return;
//   }

//   //If column is less than 0
//   if (column < 0) {
//     return;
//   }

//   //If row is greater than image length
//   if (row > arr.length - 1) {
//     return;
//   }

//   //If column is greater than image length
//   if (column > arr[row].length - 1) {
//     return;
//   }

//   //If the current pixel is not which needs to be replaced
//   if (arr[row][column] !== current) {
//     return;
//   }

//   //Update the new color
//   arr[row][column] = newColor;

//   //Fill in all four directions
//   //Fill Prev row
//   fill(arr, row - 1, column, newColor, current);

//   //Fill Next row
//   fill(arr, row + 1, column, newColor, current);

//   //Fill Prev col
//   fill(arr, row, column - 1, newColor, current);

//   //Fill next col
//   fill(arr, row, column + 1, newColor, current);
// };

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  return lines.toString();
};
