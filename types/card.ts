export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'

export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

export type Enhancement = 'bonus' | 'mult' | 'wild' | 'glass' | 'steel' | 'stone' | 'gold' | 'lucky'

export type Edition = 'base' | 'foil' | 'holographic' | 'polychrome' | 'negative'

export type Seal = 'gold' | 'blue' | 'red' | 'purple'

export interface PlayingCard {
  id: string
  rank: Rank
  suit: Suit
  enhancement?: Enhancement
  edition?: Edition
  seal?: Seal
}
