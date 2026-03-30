import type { PlayingCard } from '~/types/card'

export type PokerHandType =
  | 'HIGH_CARD'
  | 'ONE_PAIR'
  | 'TWO_PAIR'
  | 'THREE_OF_A_KIND'
  | 'STRAIGHT'
  | 'FLUSH'
  | 'FULL_HOUSE'
  | 'FOUR_OF_A_KIND'
  | 'STRAIGHT_FLUSH'
  | 'ROYAL_FLUSH'

export interface HandResult {
  type: PokerHandType
  name: string
  baseChips: number
  baseMult: number
  scoringCards: PlayingCard[]
}
