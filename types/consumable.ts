import type { Edition } from '~/types/card'

export type ConsumableType = 'tarot' | 'planet' | 'spectral'

export interface ConsumableEffect {
  type: string
}

export interface ConsumableCard {
  id: string
  type: ConsumableType
  name: string
  description: string
  effect: ConsumableEffect
  edition?: Edition
  sellPrice: number
}
