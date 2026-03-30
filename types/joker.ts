import type { Suit } from '~/types/card'
import type { PokerHandType } from '~/types/poker'

export type JokerRarity = 'common' | 'uncommon' | 'rare'

export type JokerTrigger =
  | { type: 'always' }
  | { type: 'if_hand'; handType: PokerHandType }
  | { type: 'per_suit'; suit: Suit }
  | { type: 'per_face_card' }
  | { type: 'if_hand_size_lte'; size: number }

export type JokerEffectType = 'add_chips' | 'add_mult' | 'x_mult'

export interface JokerEffect {
  trigger: JokerTrigger
  type: JokerEffectType
  value: number
}

export interface JokerDefinition {
  name: string
  description: string
  rarity: JokerRarity
  effect: JokerEffect
  sellPrice: number
}

export interface Joker extends JokerDefinition {
  id: string
}
