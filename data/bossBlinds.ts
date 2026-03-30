import type { Suit } from '~/types/card'

export type BossModifier =
  | { type: 'debuff_suit'; suit: Suit }
  | { type: 'debuff_face' }
  | { type: 'force_hand_size'; size: number }
  | { type: 'no_discards' }
  | { type: 'base_multiplied'; factor: number }

export interface BossBlind {
  id: string
  name: string
  description: string
  modifier: BossModifier
}

export const BOSS_BLINDS: BossBlind[] = [
  {
    id: 'the_club',
    name: 'The Club',
    description: 'All Club cards are debuffed',
    modifier: { type: 'debuff_suit', suit: 'clubs' },
  },
  {
    id: 'the_goad',
    name: 'The Goad',
    description: 'All Spade cards are debuffed',
    modifier: { type: 'debuff_suit', suit: 'spades' },
  },
  {
    id: 'the_window',
    name: 'The Window',
    description: 'All Diamond cards are debuffed',
    modifier: { type: 'debuff_suit', suit: 'diamonds' },
  },
  {
    id: 'the_head',
    name: 'The Head',
    description: 'All Heart cards are debuffed',
    modifier: { type: 'debuff_suit', suit: 'hearts' },
  },
  { id: 'the_plant', name: 'The Plant', description: 'All face cards are debuffed', modifier: { type: 'debuff_face' } },
  {
    id: 'the_psychic',
    name: 'The Psychic',
    description: 'Must play exactly 5 cards',
    modifier: { type: 'force_hand_size', size: 5 },
  },
  { id: 'the_water', name: 'The Water', description: 'Start with 0 discards', modifier: { type: 'no_discards' } },
  {
    id: 'the_wall',
    name: 'The Wall',
    description: 'Extra large blind',
    modifier: { type: 'base_multiplied', factor: 2 },
  },
]
