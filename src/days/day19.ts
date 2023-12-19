import { sumArray } from '../arrayMethods';

type Operator = '<' | '>';

type Operation =
  | {
      workflow: string;
      part: string;
      operator: Operator;
      value: number;
    }
  | string;

type Rule = {
  operations: Operation[];
};

type Rating = {
  value: number;
};

export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n');

  // px{a<2006:qkq,m>2090:A,rfg}
  let parseRatings = false;
  const rules: Map<string, Rule> = new Map();
  const ratings: Array<Map<string, Rating>> = [];
  lines.forEach((line) => {
    if (!line) {
      parseRatings = true;
      return;
    }

    if (parseRatings) {
      const partRatings: Map<string, Rating> = new Map();
      const ratingsArr: string[] = line.substring(1, line.length - 1).split(',');
      for (const ratingStr of ratingsArr) {
        const [name, valueStr] = ratingStr.split('=');
        const value = parseInt(valueStr, 10);
        partRatings.set(name, { value });
      }
      ratings.push(partRatings);
    } else {
      const [name, operationsStr] = line.split('{');
      const operationsArr: string[] = operationsStr.slice(0, -1).split(',');

      const operations: Operation[] = [];
      for (const operationStr of operationsArr) {
        if (operationStr.includes(':')) {
          const [formula, workflow] = operationStr.split(':');
          const part = formula.at(0)!;
          const operator = formula.at(1)! as Operator;
          const value = parseInt(formula.substring(2), 10);
          operations.push({ workflow, part, operator, value });
        } else {
          operations.push(operationStr);
        }
      }
      rules.set(name, { operations });
    }
  });

  let sum = 0;
  let current = 'in';
  let rule = rules.get(current)!;
  for (const partRatings of ratings) {
    let iterate = true;
    while (iterate) {
      let changedCurrent = false;
      for (const operation of rule.operations) {
        if (typeof operation === 'string') {
          current = operation;
          changedCurrent = true;
        } else {
          const rating = partRatings.get(operation.part)!;
          if (operation.operator === '>' && rating.value > operation.value) {
            current = operation.workflow;
            changedCurrent = true;
          } else if (operation.operator === '<' && rating.value < operation.value) {
            current = operation.workflow;
            changedCurrent = true;
          }
        }

        if (changedCurrent) {
          rule = rules.get(current)!;
          if (current === 'A') {
            sum += sumArray([...partRatings.values()].map((r) => r.value));
            rule = rules.get('in')!;
            iterate = false;
          } else if (current === 'R') {
            rule = rules.get('in')!;
            iterate = false;
          }
          break;
        }
      }
    }
  }

  return sum.toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  return lines.toString();
};
