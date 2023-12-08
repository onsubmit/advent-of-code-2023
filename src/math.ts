export const getGreatestCommonDenominator = (n: number, m: number): number => {
  while (m != 0) {
    const temp = m;
    m = n % m;
    n = temp;
  }

  return n;
};

export const getLeastCommonMultiple = (n: number, m: number): number => {
  return (n * m) / getGreatestCommonDenominator(n, m);
};

export const getLeastCommonMultipleForArray = (numbers: number[]): number => {
  if (numbers.length == 2) {
    return getLeastCommonMultiple(numbers[0], numbers[1]);
  } else {
    const first = numbers.shift()!;
    return getLeastCommonMultiple(first, getLeastCommonMultipleForArray(numbers));
  }
};
