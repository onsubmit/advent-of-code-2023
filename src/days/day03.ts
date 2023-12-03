export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);
  return lines.length.toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);
  return lines.length.toString();
};
