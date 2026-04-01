import type { ConsumableCard } from '~/types/consumable'

export type PackType = 'arcana' | 'celestial' | 'spectral'
export type PackSize = 'normal' | 'jumbo' | 'mega'

export interface BoosterPack {
  id: string
  type: PackType
  size: PackSize
  cost: number
  totalCards: number
  selectCount: number
}

export interface OpenPackState {
  pack: BoosterPack
  cards: ConsumableCard[]
  selectedIds: string[]
  selectionsRemaining: number
}
