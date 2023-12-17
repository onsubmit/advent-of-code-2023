import { sumArray } from '../arrayMethods';
import { Coordinate } from '../coordinate';

//type Graph = Map<string, Map<string, number>>;

// const dijkstra = (graph: Graph, sourceKey: string, targetKey: string) => {
//   const distanceFromSourceTo: Map<string, number> = new Map();
//   const previous: Map<string, string | undefined> = new Map();
//   const unvisitedNodes: string[] = [];
//   for (const nodeKey of graph.keys()) {
//     distanceFromSourceTo.set(nodeKey, Number.MAX_SAFE_INTEGER);
//     previous.set(nodeKey, undefined);
//     unvisitedNodes.push(nodeKey);
//   }
//   distanceFromSourceTo.set(sourceKey, 0);

//   let runLength = 1;
//   let runDirection: 'north' | 'south' | 'east' | 'west' | 'none' = 'none';
//   while (unvisitedNodes.length) {
//     let min = Number.MAX_SAFE_INTEGER;
//     let minVertexIndex = -1;
//     unvisitedNodes.forEach((vertex, i) => {
//       const distance = distanceFromSourceTo.get(vertex)!;

//       if (distance < min) {
//         min = distance;
//         minVertexIndex = i;
//       }
//     });

//     const minVertex = unvisitedNodes[minVertexIndex];

//     const previousVertex = previous.get(minVertex);
//     if (previousVertex) {
//       const [previousVertexRow, previousVertexColumn] = previousVertex
//         .split(',')
//         .map((d) => parseInt(d, 10));
//       const [minVertexRow, minVertexColumn] = minVertex.split(',').map((d) => parseInt(d, 10));

//       let changedDirection = false;
//       if (minVertexRow === previousVertexRow) {
//         const newRunDirection = minVertexRow === previousVertexColumn - 1 ? 'west' : 'east';
//         if (runDirection !== newRunDirection) {
//           runLength = 1;
//           changedDirection = true;
//         }
//         runDirection = newRunDirection;
//       } else {
//         const newRunDirection = minVertexRow === previousVertexRow - 1 ? 'north' : 'south';
//         if (runDirection !== newRunDirection) {
//           runLength = 1;
//           changedDirection = true;
//         }
//         runDirection = newRunDirection;
//       }

//       if (!changedDirection) {
//         switch (runDirection) {
//           case 'north': {
//             if (
//               minVertexColumn === previousVertexColumn &&
//               minVertexRow === previousVertexRow - 1
//             ) {
//               runLength++;
//             }
//             break;
//           }
//           case 'south': {
//             if (
//               minVertexColumn === previousVertexColumn &&
//               minVertexRow === previousVertexRow + 1
//             ) {
//               runLength++;
//             }
//             break;
//           }
//           case 'east': {
//             if (
//               minVertexColumn === previousVertexColumn + 1 &&
//               minVertexRow === previousVertexRow
//             ) {
//               runLength++;
//             }
//             break;
//           }
//           case 'west': {
//             if (
//               minVertexColumn === previousVertexColumn - 1 &&
//               minVertexRow === previousVertexRow
//             ) {
//               runLength++;
//             }
//             break;
//           }
//           // case 'none': {
//           //   runLength++;
//           //   if (vertexRow === previousVertexRow) {
//           //     runDirection = vertexColumn === previousVertexColumn - 1 ? 'west' : 'east';
//           //   } else {
//           //     runDirection = vertexRow === previousVertexRow - 1 ? 'north' : 'south';
//           //   }
//           //   break;
//           // }
//         }

//         if (runLength === 3) {
//           break;
//         }
//       }
//     }

//     if (minVertex === targetKey) {
//       break;
//     }

//     unvisitedNodes.splice(minVertexIndex, 1);

//     for (const [neighborKey, neighborHeatLoss] of graph.get(minVertex)!.entries()) {
//       if (!unvisitedNodes.includes(neighborKey)) {
//         continue;
//       }

//       const distanceFromRootToNeighbor = distanceFromSourceTo.get(minVertex)! + neighborHeatLoss;
//       if (distanceFromRootToNeighbor < distanceFromSourceTo.get(neighborKey)!) {
//         distanceFromSourceTo.set(neighborKey, distanceFromRootToNeighbor);
//         previous.set(neighborKey, minVertex);
//       }
//     }
//   }

//   return { distances: distanceFromSourceTo, previous };
// };

type Direction = 'north' | 'south' | 'east' | 'west';

const dijkstra2 = (digits: number[][]) => {
  const rows = digits.length;
  const columns = digits[0].length;

  const distances: number[][] = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => Number.MAX_SAFE_INTEGER)
  );
  const backTrack: ({ coordinate: Coordinate; fromDirection: Direction } | undefined)[][] =
    Array.from({ length: rows }, () => Array.from({ length: columns }, () => undefined));
  const visited: boolean[][] = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => false)
  );

  distances[0][0] = 0;
  const current: Coordinate = { row: 0, column: 0 };
  let finished = false;
  while (!finished) {
    const { row: r, column: c } = current;
    // Try move south
    if (r < rows - 1) {
      if (!visited[r + 1][c] && distances[r + 1][c] > digits[r + 1][c] + distances[r][c]) {
        let backTracker = backTrack[r][c];
        let runLength = 0;
        while (backTracker?.fromDirection === 'south') {
          runLength++;
          backTracker = backTrack[backTracker.coordinate.row][backTracker.coordinate.column];
        }

        if (runLength <= 3) {
          distances[r + 1][c] = digits[r + 1][c] + distances[r][c];

          if (backTrack[r + 1][c]) {
            debugger;
          }

          backTrack[r + 1][c] = {
            coordinate: { row: r, column: c },
            fromDirection: 'south',
          };
        }
      }
    }

    // Try move north
    if (r > 0) {
      if (!visited[r - 1][c] && distances[r - 1][c] > digits[r - 1][c] + distances[r][c]) {
        let backTracker = backTrack[r][c];
        let runLength = 0;
        while (backTracker?.fromDirection === 'north') {
          runLength++;
          backTracker = backTrack[backTracker.coordinate.row][backTracker.coordinate.column];
        }

        if (runLength <= 3) {
          distances[r - 1][c] = digits[r - 1][c] + distances[r][c];

          if (backTrack[r - 1][c]) {
            debugger;
          }

          backTrack[r - 1][c] = {
            coordinate: { row: r, column: c },
            fromDirection: 'north',
          };
        }
      }
    }

    // Try move east
    if (c < columns - 1) {
      if (!visited[r][c + 1] && distances[r][c + 1] > digits[r][c + 1] + distances[r][c]) {
        let backTracker = backTrack[r][c];
        let runLength = 0;
        while (backTracker?.fromDirection === 'east') {
          runLength++;
          backTracker = backTrack[backTracker.coordinate.row][backTracker.coordinate.column];
        }

        if (runLength <= 3) {
          distances[r][c + 1] = digits[r][c + 1] + distances[r][c];

          if (backTrack[r][c + 1]) {
            debugger;
          }

          backTrack[r][c + 1] = {
            coordinate: { row: r, column: c },
            fromDirection: 'east',
          };
        }
      }
    }

    // Try move west
    if (c > 0) {
      if (!visited[r][c - 1] && distances[r][c - 1] > digits[r][c - 1] + distances[r][c]) {
        let backTracker = backTrack[r][c];
        let runLength = 0;
        while (backTracker?.fromDirection === 'west') {
          runLength++;
          backTracker = backTrack[backTracker.coordinate.row][backTracker.coordinate.column];
        }

        if (runLength <= 3) {
          distances[r][c - 1] = digits[r][c - 1] + distances[r][c];

          if (backTrack[r][c - 1]) {
            debugger;
          }

          backTrack[r][c - 1] = {
            coordinate: { row: r, column: c },
            fromDirection: 'west',
          };
        }
      }
    }

    visited[r][c] = true;

    let minCoordinate: Coordinate = { row: 0, column: 0 };
    let minDistance = Number.MAX_SAFE_INTEGER;
    for (let rDist = 0; rDist < rows; rDist++) {
      for (let cDist = 0; cDist < columns; cDist++) {
        if (visited[rDist][cDist]) {
          continue;
        }

        const distance = distances[rDist][cDist];
        if (distance < minDistance) {
          minDistance = distance;
          minCoordinate = { row: rDist, column: cDist };
        }
      }
    }

    current.row = minCoordinate.row;
    current.column = minCoordinate.column;

    if (current.row === rows - 1 && current.column === columns - 1) {
      finished = true;
      break;
    }
  }

  const path: Coordinate[] = [];
  let u: Coordinate | undefined = { row: rows - 1, column: columns - 1 };
  while (u) {
    path.unshift(u);
    u = backTrack[u.row][u.column]?.coordinate;
  }

  return path;
};

export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);
  const digits = lines.map<number[]>((line) => [...line].map((d) => parseInt(d, 10)));

  const path = dijkstra2(digits);
  console.log(path.map(({ row, column }) => [row, column].join()).join('|'));
  const weights = path.map(({ row, column }) => digits[row][column]);

  const grid: string[][] = Array.from({ length: digits.length }, (_, r) =>
    Array.from({ length: digits[0].length }, (_, c) => digits[r][c].toString())
  );
  for (const coordinate of path) {
    grid[coordinate.row][coordinate.column] = '#';
  }

  console.log(grid.map((l) => l.join('')).join('\n'));

  return sumArray(weights).toString();

  // const graph: Graph = new Map();
  // for (let row = 0; row < digits.length; row++) {
  //   for (let column = 0; column < digits[row].length; column++) {
  //     for (let r = row - 1; r <= row + 1; r++) {
  //       for (let c = column - 1; c <= column + 1; c++) {
  //         if (
  //           r < 0 ||
  //           c < 0 ||
  //           r >= digits.length ||
  //           c >= digits[row].length ||
  //           (r === row && c === column) ||
  //           (r !== row && c !== column)
  //         ) {
  //           continue;
  //         }

  //         const key = [row, column].join();
  //         if (!graph.get(key)) {
  //           graph.set(key, new Map());
  //         }

  //         const nextKey = [r, c].join();
  //         const nextVal = digits[r][c];
  //         graph.get(key)!.set(nextKey, nextVal);
  //       }
  //     }
  //   }
  // }

  // const source = [0, 0].join();
  // const target = [digits.length - 1, digits[0].length - 1].join();

  // const { distances: _, previous } = dijkstra(graph, source, target);

  // const path: string[] = [];
  // let vertex: string | undefined = target;

  // if (previous.get(vertex) || vertex === source) {
  //   while (vertex) {
  //     path.unshift(vertex);
  //     vertex = previous.get(vertex);
  //   }
  // }

  // const weights = path.map((c) => {
  //   const [row, column] = c.split(',').map((d) => parseInt(d, 10));
  //   return digits[row][column];
  // });

  // return sumArray(weights).toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  return lines.toString();
};
