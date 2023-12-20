export class MinPriorityQueue<TElement> {
  private readonly _queue: Map<TElement, number>;

  constructor() {
    this._queue = new Map();
  }

  isEmpty = (): boolean => this._queue.size === 0;

  dequeue = (): TElement => {
    const [[element]] = [...this._queue.entries()].sort(([_k1, v1], [_k2, v2]) => v1 - v2);

    this._queue.delete(element);
    return element;
  };

  setPriority = (element: TElement, priority: number) => {
    this._queue.set(element, priority);
  };
}
