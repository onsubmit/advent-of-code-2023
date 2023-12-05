import { sumArray } from '../sumArray';

type Card = {
  number: number;
  copies: number;
  winningNumbers: Set<number>;
  numbersOnCard: number[];
  score: number;
};

const getCards = (lines: string[]): Card[] => {
  const numExtraCopies: Map<number, number> = new Map();

  return lines.map<Card>((line, i) => {
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
    const extraCopiesWon = (numExtraCopies.get(cardNumber) ?? 0) + 1;
    for (let j = 1; j <= numWinningNumbersOnCard; j++) {
      const cardNumToWin = cardNumber + j;
      if (numExtraCopies.has(cardNumToWin)) {
        const currentNumberOfCopies = numExtraCopies.get(cardNumToWin)!;
        numExtraCopies.set(cardNumToWin, currentNumberOfCopies + extraCopiesWon);
      } else {
        numExtraCopies.set(cardNumToWin, extraCopiesWon);
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
};

export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);
  const cards = getCards(lines);

  return sumArray(cards.map((c) => c.score)).toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);
  const cards = getCards(lines);

  return sumArray(cards.map((c) => c.copies)).toString();
};
