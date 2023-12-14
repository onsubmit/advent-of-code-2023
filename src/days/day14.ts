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

  const spaces = lines.map((line) => [...line]);

  const previous: Map<string, number> = new Map();
  const known: Map<number, number[]> = new Map();
  for (let cycle = 0; cycle < 10000; cycle++) {
    //console.log('cycle', cycle);
    //console.log('initial');
    //console.log(spaces.map((s) => s.join('')).join('\n'));
    const stringRep = spaces.map((s) => s.join('')).join('\n');
    if (previous.has(stringRep)) {
      const repeat = previous.get(stringRep);
      console.log({ repeat, cycle });
      debugger;
    }

    // previous.set(stringRep, cycle);
    let iterate = true;
    // North
    while (iterate) {
      let didSlide = false;
      for (let c = 0; c < spaces[0].length; c++) {
        for (let r = 1; r < spaces.length; r++) {
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

    // West
    //console.log('after north');
    //console.log(spaces.map((s) => s.join('')).join('\n'));
    iterate = true;
    while (iterate) {
      let didSlide = false;
      for (let r = 0; r < spaces.length; r++) {
        for (let c = 1; c < spaces[0].length; c++) {
          if (spaces[r][c - 1] === '.' && spaces[r][c] === 'O') {
            spaces[r][c - 1] = 'O';
            spaces[r][c] = '.';
            didSlide = true;
          }
        }
      }

      if (!didSlide) {
        iterate = false;
      }
    }

    // South
    //console.log('after west');
    //console.log(spaces.map((s) => s.join('')).join('\n'));
    iterate = true;
    while (iterate) {
      let didSlide = false;
      for (let c = 0; c < spaces[0].length; c++) {
        for (let r = spaces.length - 2; r >= 0; r--) {
          if (spaces[r + 1][c] === '.' && spaces[r][c] === 'O') {
            spaces[r + 1][c] = 'O';
            spaces[r][c] = '.';
            didSlide = true;
          }
        }
      }

      if (!didSlide) {
        iterate = false;
      }
    }

    // East
    //console.log('after south');
    //console.log(spaces.map((s) => s.join('')).join('\n'));
    iterate = true;
    while (iterate) {
      let didSlide = false;
      for (let r = 0; r < spaces.length; r++) {
        for (let c = spaces[0].length - 2; c >= 0; c--) {
          if (spaces[r][c + 1] === '.' && spaces[r][c] === 'O') {
            spaces[r][c + 1] = 'O';
            spaces[r][c] = '.';
            didSlide = true;
          }
        }
      }

      if (!didSlide) {
        iterate = false;
      }
    }

    //console.log('after east');
    //console.log(spaces.map((s) => s.join('')).join('\n'));

    let sum = 0;
    for (let r = 0; r < lines.length; r++) {
      sum += (lines.length - r) * spaces[r].filter((s) => s === 'O').length;
    }

    // if (sum === 64) {
    //   console.log(cycle);
    // }

    if (!known.get(cycle)) {
      known.set(cycle, []);
    }

    known.get(cycle)!.push(sum);
  }

  const loops = [...known].filter((x) => x[1].length > 1);
  if (loops.length) {
    debugger;
  }

  let sum = 0;
  for (let r = 0; r < lines.length; r++) {
    sum += (lines.length - r) * spaces[r].filter((s) => s === 'O').length;
  }

  return sum.toString();
};
