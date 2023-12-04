import { sumArray } from '../sumArray';

type Card = {
  number: number;
  copies: number;
  winningNumbers: Set<number>;
  numbersOnCard: number[];
  score: number;
};

export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  const cards = lines.map<Card>((line, i) => {
    const cardNumber = i + 1;
    const split = line.split(':')[1].split('|');

    const winningNumbers = new Set(
      split[0]
        .trim()
        .split(' ')
        .filter(Boolean)
        .map((s) => parseInt(s, 10))
    );

    const numbersOnCard = split[1]
      .trim()
      .split(' ')
      .filter(Boolean)
      .map((s) => parseInt(s, 10));

    const numWinningNumbersOnCard = numbersOnCard.filter((num) => winningNumbers.has(num)).length;

    return {
      number: cardNumber,
      copies: 1,
      winningNumbers,
      numbersOnCard,
      score: numWinningNumbersOnCard === 0 ? 0 : Math.pow(2, numWinningNumbersOnCard - 1),
    };
  });

  return sumArray(cards.map((c) => c.score)).toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  const numExtraCopies: Map<number, number> = new Map();

  const cards = lines.map<Card>((line, i) => {
    const cardNumber = i + 1;
    const split = line.split(':')[1].split('|');

    const winningNumbers = new Set(
      split[0]
        .trim()
        .split(' ')
        .filter(Boolean)
        .map((s) => parseInt(s, 10))
    );

    const numbersOnCard = split[1]
      .trim()
      .split(' ')
      .filter(Boolean)
      .map((s) => parseInt(s, 10));

    const numWinningNumbersOnCard = numbersOnCard.filter((num) => winningNumbers.has(num)).length;
    for (let i = 0; i <= (numExtraCopies.get(cardNumber) ?? 0); i++) {
      for (let j = 1; j <= numWinningNumbersOnCard; j++) {
        if (numExtraCopies.has(cardNumber + j)) {
          const value = numExtraCopies.get(cardNumber + j)!;
          numExtraCopies.set(cardNumber + j, value + 1);
        } else {
          numExtraCopies.set(cardNumber + j, 1);
        }
      }
    }

    return {
      number: cardNumber,
      copies: 1 + (numExtraCopies.get(cardNumber) ?? 0),
      winningNumbers,
      numbersOnCard,
      score: numWinningNumbersOnCard === 0 ? 0 : Math.pow(2, numWinningNumbersOnCard - 1),
    };
  });

  return sumArray(cards.map((c) => c.copies)).toString();
};
