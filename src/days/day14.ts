export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  const spaces = lines.map((line) => [...line]);

  let iterate = true;
  while (iterate) {
    let didSlide = false;
    for (let c = 0; c < lines[0].length; c++) {
      for (let r = 1; r < lines.length; r++) {
        if (spaces[r - 1][c] === '.' && spaces[r][c] === 'O') {
          spaces[r - 1][c] = 'O';
          spaces[r][c] = '.';
          didSlide = true;
        }
      }
    }

    if (!didSlide) {
      iterate = false;
    }
  }

  let sum = 0;
  for (let r = 0; r < lines.length; r++) {
    sum += (lines.length - r) * spaces[r].filter((s) => s === 'O').length;
  }

  return sum.toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  return lines.toString();
};
