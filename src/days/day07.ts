import { sumArray } from '../sumArray';

type HandType =
  | '5-of-a-kind'
  | '4-of-a-kind'
  | 'full-house'
  | '3-of-a-kind'
  | 'two-pair'
  | 'one-pair'
  | 'high-card';

type Hand = {
  cards: string[];
  type: HandType;
};

type Game = {
  hand: Hand;
  bid: number;
};

const handTypeRankMap = new Map<HandType, number>([
  ['5-of-a-kind', 10],
  ['4-of-a-kind', 9],
  ['full-house', 8],
  ['3-of-a-kind', 7],
  ['two-pair', 6],
  ['one-pair', 5],
  ['high-card', 4],
]);

const cardRankMap = new Map<string, number>([
  ['A', 14],
  ['K', 13],
  ['Q', 12],
  ['J', 11],
  ['T', 10],
  ['9', 9],
  ['8', 8],
  ['7', 7],
  ['6', 6],
  ['5', 5],
  ['4', 4],
  ['3', 3],
  ['2', 2],
]);

const getHandType = (cards: string[]): HandType => {
  const cardCounts = new Map<string, number>();
  for (const card of cards) {
    if (cardCounts.has(card)) {
      const value = cardCounts.get(card)!;
      cardCounts.set(card, value + 1);
    } else {
      cardCounts.set(card, 1);
    }
  }

  if (cardCounts.size === 1) {
    return '5-of-a-kind';
  }

  const counts = [...cardCounts].map((x) => x[1]);
  if (cardCounts.size === 2) {
    if (counts.includes(4)) {
      return '4-of-a-kind';
    } else {
      return 'full-house';
    }
  }

  if (cardCounts.size === 3) {
    if (counts.includes(3)) {
      return '3-of-a-kind';
    }
    return 'two-pair';
  }

  if (cardCounts.size === 4) {
    return 'one-pair';
  }

  return 'high-card';
};

const sortGames = (a: Game, b: Game): number => {
  if (a.hand.type === b.hand.type) {
    for (let i = 0; i < a.hand.cards.length; i++) {
      const aRank = cardRankMap.get(a.hand.cards[i])!;
      const bRank = cardRankMap.get(b.hand.cards[i])!;
      if (aRank === bRank) {
        continue;
      }

      return aRank > bRank ? 1 : -1;
    }
  }

  const aRank = handTypeRankMap.get(a.hand.type)!;
  const bRank = handTypeRankMap.get(b.hand.type)!;
  return aRank === bRank ? 0 : aRank > bRank ? 1 : -1;
};

export const getPartOneSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  const games = lines.map<Game>((line) => {
    const cards = [...line.split(' ')[0]];
    const type = getHandType(cards);
    const bid = parseInt(line.split(' ')[1], 10);
    return { hand: { cards, type }, bid };
  });

  const sortedGames = games.sort(sortGames);
  const winnings = sortedGames.map((g, i) => {
    return g.bid * (i + 1);
  });

  return sumArray(winnings).toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n');

  return lines.toString();
};
