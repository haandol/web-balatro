export type JokerEffectType = 'add_chips' | 'add_mult' | 'x_mult'

export type JokerRarity = 'common' | 'uncommon' | 'rare'

export interface JokerEffect {
  type: JokerEffectType
  value: number
}

export interface Joker {
  id: string
  name: string
  description: string
  rarity: JokerRarity
  effect: JokerEffect
  sellPrice: number
}
