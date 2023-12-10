type Coordinate = { row: number; column: number };

export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  const start: { row: number; column: number } = { row: 0, column: 0 };
  const tiles: string[][] = lines.map((line, row) => {
    const lineArr = [...line];
    const indexOfS = lineArr.indexOf('S');
    if (indexOfS >= 0) {
      start.row = row;
      start.column = indexOfS;
    }
    return lineArr;
  });

  let previous = start;
  let current = start;
  const loop: Coordinate[] = [start];
  let go = true;
  while (go) {
    const { row, column } = current;
    const currentTile = tiles[row][column];

    switch (currentTile) {
      case '|': {
        const option1 = { row: row - 1, column };
        const option2 = { row: row + 1, column };

        loop.push(
          previous.row === option1.row && previous.column === option1.column ? option2 : option1
        );
        break;
      }
      case '-': {
        const option1 = { row: row, column: column - 1 };
        const option2 = { row: row, column: column + 1 };

        loop.push(
          previous.row === option1.row && previous.column === option1.column ? option2 : option1
        );
        break;
      }
      case 'L': {
        const option1 = { row: row - 1, column };
        const option2 = { row: row, column: column + 1 };

        loop.push(
          previous.row === option1.row && previous.column === option1.column ? option2 : option1
        );
        break;
      }
      case 'J': {
        const option1 = { row: row - 1, column };
        const option2 = { row: row, column: column - 1 };

        loop.push(
          previous.row === option1.row && previous.column === option1.column ? option2 : option1
        );
        break;
      }
      case '7': {
        const option1 = { row: row, column: column - 1 };
        const option2 = { row: row + 1, column };

        loop.push(
          previous.row === option1.row && previous.column === option1.column ? option2 : option1
        );
        break;
      }
      case 'F': {
        const option1 = { row: row, column: column + 1 };
        const option2 = { row: row + 1, column };

        loop.push(
          previous.row === option1.row && previous.column === option1.column ? option2 : option1
        );
        break;
      }
      case 'S': {
        if (loop.length > 1) {
          go = false;
          break;
        }

        // const option1 = { row: row, column: column + 1 };
        // const option2 = { row: row + 1, column };

        // loop.push(
        //   previous.row === option1.row && previous.column === option1.column ? option2 : option1
        // );
        // break;

        // S is a dash in my input
        const option1 = { row: row, column: column - 1 };
        const option2 = { row: row, column: column + 1 };

        loop.push(
          previous.row === option1.row && previous.column === option1.column ? option2 : option1
        );
        break;
      }
    }

    previous = current;
    current = loop.at(-1)!;
  }

  return ((loop.length - 1) / 2).toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  return lines.toString();
};
