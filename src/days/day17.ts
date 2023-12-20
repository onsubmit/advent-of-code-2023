import { sumArray } from '../arrayMethods';
import { Coordinate } from '../coordinate';

type Direction = 'U' | 'D' | 'R' | 'L' | '?';
type NodeKey = `${string},${string},${Direction},${string}`; // x,y,direction,steps
type Graph = Map<NodeKey, Map<NodeKey, number>>;

const getNodeKey = (coordinate: Coordinate, direction: Direction, steps: number): NodeKey => {
  const { row, column } = coordinate;
  return `${row},${column},${direction},${steps}`;
};

const parseNodeKey = (
  nodeKey: NodeKey
): { coordinate: Coordinate; direction: Direction; steps: number } => {
  const [rowStr, colStr, directionStr, stepsStr] = nodeKey.split(',');
  const row = parseInt(rowStr, 10);
  const column = parseInt(colStr, 10);
  const coordinate = { row, column };
  const direction = directionStr as Direction;
  const steps = parseInt(stepsStr);
  return { coordinate, direction, steps };
};

const dijkstra = (graph: Graph, sourceKey: NodeKey, target: Coordinate) => {
  const distanceFromSourceTo: Map<NodeKey, number> = new Map();
  const previous: Map<NodeKey, NodeKey | undefined> = new Map();
  const unvisitedNodes: NodeKey[] = [];
  for (const nodeKey of graph.keys()) {
    distanceFromSourceTo.set(nodeKey, Number.MAX_SAFE_INTEGER);
    previous.set(nodeKey, undefined);
    unvisitedNodes.push(nodeKey);
  }
  distanceFromSourceTo.set(sourceKey, 0);

  let minVertex = sourceKey;
  while (unvisitedNodes.length) {
    let min = Number.MAX_SAFE_INTEGER;
    let minVertexIndex = -1;
    unvisitedNodes.forEach((vertex, i) => {
      const distance = distanceFromSourceTo.get(vertex)!;

      if (distance < min) {
        min = distance;
        minVertexIndex = i;
      }
    });

    minVertex = unvisitedNodes[minVertexIndex];
    const { coordinate } = parseNodeKey(minVertex);
    if (coordinate.row === target.row && coordinate.column === target.column) {
      break;
    }

    unvisitedNodes.splice(minVertexIndex, 1);

    for (const [neighborKey, neighborHeatLoss] of graph.get(minVertex)!.entries()) {
      if (!unvisitedNodes.includes(neighborKey)) {
        continue;
      }

      const distanceFromRootToNeighbor = distanceFromSourceTo.get(minVertex)! + neighborHeatLoss;
      if (distanceFromRootToNeighbor < distanceFromSourceTo.get(neighborKey)!) {
        distanceFromSourceTo.set(neighborKey, distanceFromRootToNeighbor);
        previous.set(neighborKey, minVertex);
      }
    }
  }

  return { distances: distanceFromSourceTo, previous, finalVertex: minVertex };
};

export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);
  const digits = lines.map<number[]>((line) => [...line].map((d) => parseInt(d, 10)));

  const isValidCoordinate = (coordinate: Coordinate): boolean => {
    const { row, column } = coordinate;
    if (row < 0 || column < 0 || row >= digits.length || column >= digits[row].length) {
      return false;
    }

    return true;
  };

  const addEdgesToNode = (nodeKey: NodeKey): NodeKey[] => {
    const { coordinate, direction, steps } = parseNodeKey(nodeKey);
    const { row, column } = coordinate;

    let sourceEdges = graph.get(nodeKey);
    if (!sourceEdges) {
      sourceEdges = new Map();
      graph.set(nodeKey, sourceEdges);
    }

    if (row === digits.length - 1 && column === digits[row].length - 1) {
      return [];
    }

    const newNodeKeys: NodeKey[] = [];

    // U
    if (direction !== 'D' && !(direction === 'U' && steps === 3)) {
      const targetCoordinate = { row: row - 1, column: column };
      if (isValidCoordinate(targetCoordinate)) {
        const targetNodeKey = getNodeKey(targetCoordinate, 'U', direction === 'U' ? steps + 1 : 1);
        if (!sourceEdges.has(targetNodeKey)) {
          sourceEdges.set(targetNodeKey, digits[targetCoordinate.row][targetCoordinate.column]);
          newNodeKeys.push(targetNodeKey);
        }
      }
    }

    // D
    if (direction !== 'U' && !(direction === 'D' && steps === 3)) {
      const targetCoordinate = { row: row + 1, column: column };
      if (isValidCoordinate(targetCoordinate)) {
        const targetNodeKey = getNodeKey(targetCoordinate, 'D', direction === 'D' ? steps + 1 : 1);
        if (!sourceEdges.has(targetNodeKey)) {
          sourceEdges.set(targetNodeKey, digits[targetCoordinate.row][targetCoordinate.column]);
          newNodeKeys.push(targetNodeKey);
        }
      }
    }

    // R
    if (direction !== 'L' && !(direction === 'R' && steps === 3)) {
      const targetCoordinate = { row, column: column + 1 };
      if (isValidCoordinate(targetCoordinate)) {
        const targetNodeKey = getNodeKey(targetCoordinate, 'R', direction === 'R' ? steps + 1 : 1);
        if (!sourceEdges.has(targetNodeKey)) {
          sourceEdges.set(targetNodeKey, digits[targetCoordinate.row][targetCoordinate.column]);
          newNodeKeys.push(targetNodeKey);
        }
      }
    }

    // L
    if (direction !== 'R' && !(direction === 'L' && steps === 3)) {
      const targetCoordinate = { row, column: column - 1 };
      if (isValidCoordinate(targetCoordinate)) {
        const targetNodeKey = getNodeKey(targetCoordinate, 'L', direction === 'L' ? steps + 1 : 1);
        if (!sourceEdges.has(targetNodeKey)) {
          sourceEdges.set(targetNodeKey, digits[targetCoordinate.row][targetCoordinate.column]);
          newNodeKeys.push(targetNodeKey);
        }
      }
    }

    return newNodeKeys;
  };

  const graph: Graph = new Map();
  const sourceKey = getNodeKey({ row: 0, column: 0 }, '?', 0);
  const nodeKeys = [sourceKey];
  while (nodeKeys.length) {
    const nodeKey = nodeKeys.pop()!;
    nodeKeys.push(...addEdgesToNode(nodeKey));
  }

  const target = { row: digits.length - 1, column: digits[0].length - 1 };
  const { distances: _, previous, finalVertex } = dijkstra(graph, sourceKey, target);

  const path: NodeKey[] = [];
  let vertex: NodeKey | undefined = finalVertex;

  while (vertex) {
    path.unshift(vertex);
    vertex = previous.get(vertex);
  }

  const weights = path.slice(1).map((nodeKey) => {
    const { coordinate } = parseNodeKey(nodeKey);
    const { row, column } = coordinate;
    return digits[row][column];
  });

  return sumArray(weights).toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  return lines.toString();
};
