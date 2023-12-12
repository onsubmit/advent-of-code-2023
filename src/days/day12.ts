import Iter from 'es-iter';

import { sumArray } from '../arrayMethods';

type SpringStatus = '.' | '#' | '?';

type Record = {
  springs: SpringStatus[];
  damagedSpringGroupsLengths: number[];
};

export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  const records = lines.map<Record>((line) => {
    const split = line.split(' ');
    const springs = [...split[0]] as SpringStatus[];
    const damagedSpringGroupsLengths = split[1].split(',').map((d) => parseInt(d, 10));
    return {
      springs,
      damagedSpringGroupsLengths,
    };
  });

  const recordNumArrangements: number[] = [];

  for (const record of records) {
    const width = record.springs.length;
    const totalOptions =
      sumArray(record.damagedSpringGroupsLengths) + record.damagedSpringGroupsLengths.length - 1;
    const extraSquares = width - totalOptions;
    const range = Array.from(
      { length: record.damagedSpringGroupsLengths.length + extraSquares },
      (_, i) => i
    );

    const combinations: number[][] = [
      ...new Iter(range).combinations(record.damagedSpringGroupsLengths.length),
    ];

    const rows = combinations
      .map((combination) => {
        const row: SpringStatus[] = [];
        for (let i = 0; i < combination.length; i++) {
          row.push(
            ...Array.from(
              { length: combination[i] - (combination[i - 1] ?? 0) },
              () => '.' as SpringStatus
            )
          );
          row.push(
            ...Array.from(
              { length: record.damagedSpringGroupsLengths[i] },
              () => '#' as SpringStatus
            )
          );
        }

        row.push(...Array.from({ length: width - row.length }, () => '.' as SpringStatus));

        for (let j = 0; j < width; j++) {
          if (record.springs[j] === '?') {
            continue;
          }

          if (row[j] !== record.springs[j]) {
            return;
          }
        }

        return row;
      })
      .filter(Boolean);

    recordNumArrangements.push(rows.length);
  }

  return sumArray(recordNumArrangements).toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  return lines.toString();
};
