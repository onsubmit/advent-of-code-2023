import { Button, TextField } from '@mui/material';
import { useState } from 'react';

import styles from './day.module.css';

export type DayProps = {
  day: number;
  getPartOneSolution: (input: string) => string;
  getPartTwoSolution: (input: string) => string;
};

export default function Day({ day, getPartOneSolution, getPartTwoSolution }: DayProps) {
  const [partOneInput, setPartOneInput] = useState('');
  const [partTwoInput, setPartTwoInput] = useState('');
  const [partOneOutput, setPartOneOutput] = useState('');
  const [partTwoOutput, setPartTwoOutput] = useState('');
  const [partOneTiming, setPartOneTiming] = useState('');
  const [partTwoTiming, setPartTwoTiming] = useState('');

  return (
    <div className={styles.day}>
      <h1>Day {day}</h1>
      <TextField
        label="Part 1 input"
        multiline
        rows={4}
        value={partOneInput}
        onChange={(e) => setPartOneInput(e.currentTarget.value)}
      />
      <TextField label="Part 1 output" disabled value={partOneOutput} />
      <TextField label="Part 1 timing" disabled value={partOneTiming} />
      <Button
        variant="contained"
        onClick={() => {
          const startTime = performance.now();
          const solution = getPartOneSolution(partOneInput);
          const endTime = performance.now();
          setPartOneOutput(solution);
          setPartOneTiming(`${endTime - startTime}ms`);
        }}
      >
        Get part 1 solution
      </Button>

      <TextField
        label="Part 2 input"
        multiline
        rows={4}
        value={partTwoInput}
        onChange={(e) => setPartTwoInput(e.currentTarget.value)}
      />
      <TextField label="Part 2 output" disabled value={partTwoOutput} />
      <TextField label="Part 2 timing" disabled value={partTwoTiming} />
      <Button
        variant="contained"
        onClick={() => {
          const startTime = performance.now();
          const solution = getPartTwoSolution(partOneInput);
          const endTime = performance.now();
          setPartTwoOutput(solution);
          setPartTwoTiming(`${endTime - startTime}ms`);
        }}
      >
        Get part 2 solution
      </Button>
    </div>
  );
}
