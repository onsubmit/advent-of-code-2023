// class Node {
//   private _coordinateKey: string;
//   private _weight: number;

import { sumArray } from '../arrayMethods';

//   constructor(coordinate: Coordinate, destination: Node, weight: number) {
//     this._coordinateKey = [coordinate.row, coordinate.column].join();
//     this._destination = destination;
//     this._weight = weight;
//   }
// }

type Graph = Map<string, Map<string, number>>;
const dijkstra = (graph: Graph, sourceKey: string, targetKey: string) => {
  const distances: Map<string, number> = new Map();
  const previous: Map<string, string | undefined> = new Map();
  const vertexQueue: string[] = [];
  for (const nodeKey of graph.keys()) {
    distances.set(nodeKey, Number.MAX_SAFE_INTEGER);
    previous.set(nodeKey, undefined);
    vertexQueue.push(nodeKey);
  }
  distances.set(sourceKey, 0);

  while (vertexQueue.length) {
    let min = Number.MAX_SAFE_INTEGER;
    let minVertexIndex = -1;
    vertexQueue.forEach((vertex, i) => {
      const distance = distances.get(vertex)!;
      if (distance < min) {
        min = distance;
        minVertexIndex = i;
      }
    });

    const minVertex = vertexQueue[minVertexIndex];
    if (minVertex === targetKey) {
      break;
    }

    vertexQueue.splice(minVertexIndex, 1);

    for (const [neighborKey, neighborHeatLoss] of graph.get(minVertex)!.entries()) {
      if (!vertexQueue.includes(neighborKey)) {
        continue;
      }

      const distanceFromRootToNeighbor = distances.get(minVertex)! + neighborHeatLoss;
      if (distanceFromRootToNeighbor < distances.get(neighborKey)!) {
        distances.set(neighborKey, distanceFromRootToNeighbor);
        previous.set(neighborKey, minVertex);
      }
    }
  }

  return { distances, previous };
};

export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);
  const digits = lines.map<number[]>((line) => [...line].map((d) => parseInt(d, 10)));

  const graph: Graph = new Map();
  for (let row = 0; row < digits.length; row++) {
    for (let column = 0; column < digits[row].length; column++) {
      for (let r = row - 1; r <= row + 1; r++) {
        for (let c = column - 1; c <= column + 1; c++) {
          if (
            r < 0 ||
            c < 0 ||
            r >= digits.length ||
            c >= digits[row].length ||
            (r === row && c === column) ||
            (r !== row && c !== column)
          ) {
            continue;
          }

          const key = [row, column].join();
          if (!graph.get(key)) {
            graph.set(key, new Map());
          }

          const nextKey = [r, c].join();
          const nextVal = digits[r][c];
          graph.get(key)!.set(nextKey, nextVal);
        }
      }
    }
  }

  const source = [0, 0].join();
  const target = [digits.length - 1, digits[0].length - 1].join();

  const { distances: _, previous } = dijkstra(graph, source, target);

  const path: string[] = [];
  let vertex: string | undefined = target;

  if (previous.get(vertex) || vertex === source) {
    while (vertex) {
      path.unshift(vertex);
      vertex = previous.get(vertex);
    }
  }

  const weights = path.map((c) => {
    const [row, column] = c.split(',').map((d) => parseInt(d, 10));
    return digits[row][column];
  });

  return sumArray(weights).toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  return lines.toString();
};
