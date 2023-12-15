import memoizee from 'memoizee';

type LabelToFocalLengthMap = Map<string, number>;
type BoxToLabelToFocalLengthMap = Map<number, LabelToFocalLengthMap>;

const getHash = memoizee(
  (string: string): number => {
    let currentValue = 0;
    for (const char of [...string]) {
      const ascii = char.charCodeAt(0);
      currentValue += ascii;
      currentValue *= 17;
      currentValue %= 256;
    }
    return currentValue;
  },
  { primitive: true }
);

export const getPartOneSolution = (input: string): string => {
  const strings = input.trim().split(',');

  let sum = 0;
  for (const string of strings) {
    sum += getHash(string);
  }

  return sum.toString();
};

export const getPartTwoSolution = (input: string): string => {
  const strings = input.trim().split(',');

  const boxes: BoxToLabelToFocalLengthMap = new Map();
  for (const string of strings) {
    if (string.includes('=')) {
      const [label, focalLengthStr] = string.split('=');
      const focalLength = parseInt(focalLengthStr, 10);
      const box = getHash(label);

      const labelToFocalLengthMap = boxes.get(box);
      if (labelToFocalLengthMap) {
        labelToFocalLengthMap.set(label, focalLength);
      } else {
        boxes.set(box, new Map([[label, focalLength]]));
      }
    } else {
      const [label] = string.split('-');
      const box = getHash(label);

      const labelToFocalLengthMap = boxes.get(box);
      if (labelToFocalLengthMap) {
        labelToFocalLengthMap.delete(label);
        if (!labelToFocalLengthMap.size) {
          boxes.delete(box);
        }
      }
    }
  }

  let totalFocusingPower = 0;
  for (const [box, labelToFocalLengthMap] of boxes.entries()) {
    [...labelToFocalLengthMap].forEach(([_label, focalLength], slot) => {
      totalFocusingPower += (box + 1) * (slot + 1) * focalLength;
    });
  }

  return totalFocusingPower.toString();
};
