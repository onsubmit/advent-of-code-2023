import Day01 from "./days/day01";

[Day01].forEach((Day, i) => {
  const day = new Day();
  const solution1 = day.getPartOneSolution();
  const solution2 = day.getPartTwoSolution();
  console.log(`Day ${i + 1}, part 1: ${solution1}`);
  console.log(`Day ${i + 1}, part 2: ${solution2}`);
});
