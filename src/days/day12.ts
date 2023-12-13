import memoize from 'memoizee';

import { sumArray } from '../arrayMethods';

const getNumArrangements = memoize(
  (springs: string, damagedSpringGroupsLengths: number[]): number => {
    if (springs.length === 0) {
      // Only 0 damaged springs are allowed for 0 springs.
      return damagedSpringGroupsLengths.length === 0 ? 1 : 0;
    }

    if (damagedSpringGroupsLengths.length === 0) {
      // No damaged springs allowed.
      return springs.includes('#') ? 0 : 1;
    }

    if (
      springs.length <
      sumArray(damagedSpringGroupsLengths) + damagedSpringGroupsLengths.length - 1
    ) {
      // Not enough room for all groups of damaged springs and the operational springs between them.
      return 0;
    }

    const firstSpring = springs[0];
    switch (firstSpring) {
      case '.': {
        // First spring is operational, continue.
        return getNumArrangements(springs.slice(1), damagedSpringGroupsLengths);
      }
      case '#': {
        // First spring is damaged.
        const [firstGroupLength, ...remainingGroupsLengths] = damagedSpringGroupsLengths;
        for (let i = 1; i < firstGroupLength; i++) {
          if (springs[i] === '.') {
            // No operational springs are allowed, otherwise the damaged group size wouldn't be big enough.
            return 0;
          }
        }

        if (springs[firstGroupLength] === '#') {
          // The spring immediately following a damaged group must be operational.
          return 0;
        }

        // Damaged group is processed, continue to next group.
        return getNumArrangements(springs.slice(firstGroupLength + 1), remainingGroupsLengths);
      }
      case '?': {
        // First spring status is unknown. Try both options.
        return sumArray(
          ['#', '.'].map((s) =>
            getNumArrangements(`${s}${springs.slice(1)}`, damagedSpringGroupsLengths)
          )
        );
      }
      default: {
        throw new Error('Invalid spring type');
      }
    }
  },
  { primitive: true }
);

const getSolution = (input: string, repeat: number) => {
  const lines = input.split('\n').filter(Boolean);

  let sum = 0;
  lines.forEach((line) => {
    const split = line.split(' ');
    const springs = [...Array.from({ length: repeat }, () => split[0]).join('?')].join('');
    const damagedSpringGroupsLengths = [
      ...Array.from({ length: repeat }, () => split[1].split(',').map((d) => parseInt(d, 10))),
    ].flatMap((d) => d);

    sum += getNumArrangements(springs, damagedSpringGroupsLengths);
  });

  return sum.toString();
};

export const getPartOneSolution = (input: string): string => {
  return getSolution(input, 1);
};

export const getPartTwoSolution = (input: string): string => {
  return getSolution(input, 5);
};
