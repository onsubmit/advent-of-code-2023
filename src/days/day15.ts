export const getPartOneSolution = (input: string): string => {
  const strings = input.trim().split(',');

  let sum = 0;
  for (const string of strings) {
    let currentValue = 0;
    for (const char of [...string]) {
      const ascii = char.charCodeAt(0);
      currentValue += ascii;
      currentValue *= 17;
      currentValue = currentValue % 256;
    }
    sum += currentValue;
  }

  return sum.toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  return lines.toString();
};
