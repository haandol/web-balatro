export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  id: number;
  suit: Suit;
  rank: string;
  enhancement?: string;
  edition?: string;
  seal?: string;
  value?: number;
}

export const createCard = (suit: Suit, rank: Rank): Card => {
  let value = 0;

  if (rank === 'A') value = 14;
  else if (rank === 'K') value = 13;
  else if (rank === 'Q') value = 12;
  else if (rank === 'J') value = 11;
  else value = parseInt(rank, 10);

  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    suit,
    rank,
    value
  };
};