const getVerticalLineOfReflection = (pattern: string[][]) => {
  const linesOfReflection: number[] = [];

  for (let c = 0; c < pattern[0].length - 1; c++) {
    let match = true;
    for (let r = 0; match && r < pattern.length; r++) {
      if (pattern[r][c] !== pattern[r][c + 1]) {
        match = false;
      }
    }

    if (match) {
      linesOfReflection.push(c);
    }
  }

  for (const possibility of linesOfReflection) {
    const col = possibility;
    let isMirror = true;
    const matchedCols: number[] = [col, col + 1];
    for (let c = 1; c < pattern[0].length; c++) {
      for (let r = 0; isMirror && r < pattern.length; r++) {
        if (col - c < 0 || c + col + 1 >= pattern[0].length) {
          return col + 1;
        }

        if (pattern[r][col - c] !== pattern[r][c + col + 1]) {
          isMirror = false;
        }
      }

      if (isMirror) {
        matchedCols.push(col - c);
        matchedCols.push(c + col + 1);
      }
    }

    if (isMirror) {
      return col + 1;
    }
  }

  return 0;
};

const getHorizontalLineOfReflection = (pattern: string[][]) => {
  const linesOfReflection: number[] = [];
  for (let r = 0; r < pattern.length - 1; r++) {
    let match = true;
    for (let c = 0; match && c < pattern[r].length; c++) {
      if (pattern[r][c] !== pattern[r + 1][c]) {
        match = false;
      }
    }

    if (match) {
      linesOfReflection.push(r);
    }
  }

  for (const possibility of linesOfReflection) {
    const row = possibility;
    let isMirror = true;
    const matchedRows: number[] = [row, row + 1];
    for (let r = 1; r <= pattern.length; r++) {
      for (let c = 0; isMirror && c < pattern[0].length; c++) {
        if (row - r < 0 || row + r + 1 >= pattern.length) {
          return row + 1;
        }

        if (pattern[row - r][c] !== pattern[row + r + 1][c]) {
          isMirror = false;
        }
      }

      if (isMirror) {
        matchedRows.push(row - r);
        matchedRows.push(row + r + 1);
      }
    }

    if (isMirror) {
      return row + 1;
    }
  }

  return 0;
};

export const getPartOneSolution = (input: string): string => {
  const patterns: Array<string[][]> = [[]];
  const lines = input.trim().split('\n');

  lines.forEach((line) => {
    if (!line) {
      patterns.push([]);
      return;
    }

    patterns.at(-1)?.push([...line]);
  });

  let totalColsLeftOfVerticalLineOfReflection = 0;
  let totalRowsAboveHorizontalLineOfReflection = 0;
  for (const pattern of patterns) {
    totalColsLeftOfVerticalLineOfReflection += getVerticalLineOfReflection(pattern);
    totalRowsAboveHorizontalLineOfReflection += getHorizontalLineOfReflection(pattern);
  }

  return (
    totalColsLeftOfVerticalLineOfReflection +
    100 * totalRowsAboveHorizontalLineOfReflection
  ).toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  return lines.toString();
};
