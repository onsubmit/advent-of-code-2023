export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  const numberSets: number[][] = lines.map((line) =>
    line
      .trim()
      .split(' ')
      .map((d) => parseInt(d.trim(), 10))
  );

  let sum = 0;
  for (const numberSet of numberSets) {
    const differences: number[][] = [[...numberSet]];
    let go = true;
    while (go) {
      const nextRow: number[] = [];
      const currentRow = differences.at(-1)!;
      for (let i = 0; i < currentRow.length - 1; i++) {
        nextRow.push(currentRow[i + 1] - currentRow[i]);
      }
      differences.push(nextRow);
      if (nextRow.every((d) => d === 0)) {
        go = false;
      }
    }

    differences.at(-1)?.push(0);
    const endNeg2 = differences.at(-2)?.at(-1) ?? 0;
    differences.at(-2)?.push(endNeg2);
    for (let i = 3; i <= differences.length; i++) {
      const endThisRow = differences.at(0 - i)?.at(-1) ?? 0;
      const endBelowRow = differences.at(1 - i)?.at(-1) ?? 0;
      differences.at(0 - i)?.push(endThisRow + endBelowRow);
    }
    sum += differences.at(0)?.at(-1) ?? 0;
  }

  return sum.toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  const numberSets: number[][] = lines.map((line) =>
    line
      .trim()
      .split(' ')
      .map((d) => parseInt(d.trim(), 10))
  );

  let sum = 0;
  for (const numberSet of numberSets) {
    const differences: number[][] = [[...numberSet]];
    let go = true;
    while (go) {
      const nextRow: number[] = [];
      const currentRow = differences.at(-1)!;
      for (let i = 0; i < currentRow.length - 1; i++) {
        nextRow.push(currentRow[i + 1] - currentRow[i]);
      }
      differences.push(nextRow);
      if (nextRow.every((d) => d === 0)) {
        go = false;
      }
    }

    differences.at(-1)?.unshift(0);
    const begNeg2 = differences.at(-2)?.at(0) ?? 0;
    differences.at(-2)?.unshift(begNeg2);
    for (let i = 3; i <= differences.length; i++) {
      const begThisRow = differences.at(0 - i)?.at(0) ?? 0;
      const begBelowRow = differences.at(1 - i)?.at(0) ?? 0;
      differences.at(0 - i)?.unshift(begThisRow - begBelowRow);
    }
    sum += differences.at(0)?.at(0) ?? 0;
  }

  return sum.toString();
};
