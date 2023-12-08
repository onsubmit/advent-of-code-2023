import { sumArray } from '../arrayMethods';

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
  ['5-of-a-kind', 6],
  ['4-of-a-kind', 5],
  ['full-house', 4],
  ['3-of-a-kind', 3],
  ['two-pair', 2],
  ['one-pair', 1],
  ['high-card', 0],
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
  const cardCountsMap = new Map<string, number>();
  for (const card of cards) {
    if (cardCountsMap.has(card)) {
      const value = cardCountsMap.get(card)!;
      cardCountsMap.set(card, value + 1);
    } else {
      cardCountsMap.set(card, 1);
    }
  }

  const jokerCount = cardRankMap.get('J') === 1 ? cardCountsMap.get('J') ?? 0 : 0;
  if (cardCountsMap.size === 1) {
    return '5-of-a-kind';
  }

  const counts = [...cardCountsMap].map((x) => x[1]);
  if (cardCountsMap.size === 2) {
    if (counts.includes(4)) {
      if (jokerCount > 0) {
        // 4 Jokers or 1 Joker both make for a 5 of a Kind.
        return '5-of-a-kind';
      }
      return '4-of-a-kind';
    } else {
      if (jokerCount === 2 || jokerCount === 3) {
        // One group from the Full House are Jokers implies 5 of a Kind.
        return '5-of-a-kind';
      }

      return 'full-house';
    }
  }

  if (cardCountsMap.size === 3) {
    if (counts.includes(3)) {
      if (jokerCount === 3) {
        // 3 Jokers implies singles of the others which results in a 4 of a Kind.
        return '4-of-a-kind';
      }

      if (jokerCount === 1) {
        // 1 Joker implies the 3 of a Kind becomes a 4 of a Kind.
        return '4-of-a-kind';
      }

      return '3-of-a-kind';
    }

    if (jokerCount === 2) {
      // 2 Jokers implies the Two Pair becomes a 4 of a Kind.
      return '4-of-a-kind';
    }

    if (jokerCount === 1) {
      // 1 Joker implies the Two Pair becomes a Full House.
      return 'full-house';
    }

    return 'two-pair';
  }

  if (cardCountsMap.size === 4) {
    if (jokerCount === 2) {
      // The Jokers are the pair, so any of the other singles implies a 3 of a Kind.
      return '3-of-a-kind';
    }

    if (jokerCount === 1) {
      // 1 Joker implies the pair is some other card which becomes a 3 of a Kind.
      return '3-of-a-kind';
    }

    return 'one-pair';
  }

  if (jokerCount === 1) {
    // 1 Joker upgrades the High Card to a Pair.
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

const getSolution = (input: string): string => {
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

export const getPartOneSolution = (input: string): string => {
  // J means Jack
  cardRankMap.set('J', 11);
  return getSolution(input);
};

export const getPartTwoSolution = (input: string): string => {
  // J means Joker
  cardRankMap.set('J', 1);
  return getSolution(input);
};
