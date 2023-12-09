const getValueHistories = (input: string): number[][] => {
  const lines = input.split('\n').filter(Boolean);

  return lines.map((line) =>
    line
      .trim()
      .split(' ')
      .map((d) => parseInt(d.trim(), 10))
  );
};

const getDifferences = (valueHistory: number[]): number[][] => {
  const differences: number[][] = [[...valueHistory]];
  while (differences.at(-1)?.some((d) => d !== 0)) {
    const nextRow: number[] = [];
    const currentRow = differences.at(-1)!;
    for (let i = 0; i < currentRow.length - 1; i++) {
      nextRow.push(currentRow[i + 1] - currentRow[i]);
    }
    differences.push(nextRow);
  }

  return differences;
};

export const getPartOneSolution = (input: string): string => {
  const valueHistories = getValueHistories(input);

  let sum = 0;
  for (const valueHistory of valueHistories) {
    const differences = getDifferences(valueHistory);

    // Last row has all 0s, push another.
    differences.at(-1)?.push(0);

    // Value to push to the remaining rows is the sum of the
    // last items from its row and the one below it.
    for (let i = 2; i <= differences.length; i++) {
      const lastThisRow = differences.at(0 - i)!.at(-1)!;
      const lastBelowRow = differences.at(1 - i)!.at(-1)!;
      differences.at(0 - i)?.push(lastThisRow + lastBelowRow);
    }

    sum += differences.at(0)!.at(-1)!;
  }

  return sum.toString();
};

export const getPartTwoSolution = (input: string): string => {
  const valueHistories = getValueHistories(input);

  let sum = 0;
  for (const valueHistory of valueHistories) {
    const differences = getDifferences(valueHistory);

    // Last row has all 0s, insert another.
    differences.at(-1)?.unshift(0);

    // Value to insert to the remaining rows is the difference between the
    // first items from its row and the one below it.
    for (let i = 2; i <= differences.length; i++) {
      const startThisRow = differences.at(0 - i)!.at(0)!;
      const startBelowRow = differences.at(1 - i)!.at(0)!;
      differences.at(0 - i)?.unshift(startThisRow - startBelowRow);
    }
    sum += differences.at(0)!.at(0)!;
  }

  return sum.toString();
};
