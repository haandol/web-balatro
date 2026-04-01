import type { PackType, PackSize, BoosterPack } from '~/types/boosterPack'

interface PackConfig {
  type: PackType
  size: PackSize
  cost: number
  totalCards: number
  selectCount: number
}

const PACK_CONFIGS: PackConfig[] = [
  // Arcana (Tarot)
  { type: 'arcana', size: 'normal', cost: 4, totalCards: 3, selectCount: 1 },
  { type: 'arcana', size: 'jumbo', cost: 6, totalCards: 5, selectCount: 1 },
  { type: 'arcana', size: 'mega', cost: 8, totalCards: 5, selectCount: 2 },
  // Celestial (Planet)
  { type: 'celestial', size: 'normal', cost: 4, totalCards: 3, selectCount: 1 },
  { type: 'celestial', size: 'jumbo', cost: 6, totalCards: 5, selectCount: 1 },
  { type: 'celestial', size: 'mega', cost: 8, totalCards: 5, selectCount: 2 },
  // Spectral
  { type: 'spectral', size: 'normal', cost: 4, totalCards: 2, selectCount: 1 },
  { type: 'spectral', size: 'jumbo', cost: 6, totalCards: 4, selectCount: 1 },
  { type: 'spectral', size: 'mega', cost: 8, totalCards: 4, selectCount: 2 },
]

export function getPackConfig(type: PackType, size: PackSize): PackConfig {
  return PACK_CONFIGS.find((p) => p.type === type && p.size === size)!
}

const PACK_TYPE_WEIGHTS: { type: PackType; weight: number }[] = [
  { type: 'arcana', weight: 4 },
  { type: 'celestial', weight: 4 },
  { type: 'spectral', weight: 1 },
]

const PACK_SIZE_WEIGHTS: { size: PackSize; weight: number }[] = [
  { size: 'normal', weight: 6 },
  { size: 'jumbo', weight: 3 },
  { size: 'mega', weight: 1 },
]

function weightedRandom<T>(items: { weight: number }[], values: T[]): T {
  const totalWeight = items.reduce((sum, i) => sum + i.weight, 0)
  let roll = Math.random() * totalWeight
  for (let i = 0; i < items.length; i++) {
    roll -= items[i].weight
    if (roll <= 0) return values[i]
  }
  return values[values.length - 1]
}

export function rollShopPack(): BoosterPack {
  const type = weightedRandom(
    PACK_TYPE_WEIGHTS,
    PACK_TYPE_WEIGHTS.map((p) => p.type)
  )
  const size = weightedRandom(
    PACK_SIZE_WEIGHTS,
    PACK_SIZE_WEIGHTS.map((p) => p.size)
  )
  const config = getPackConfig(type, size)
  return {
    id: `pack-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: config.type,
    size: config.size,
    cost: config.cost,
    totalCards: config.totalCards,
    selectCount: config.selectCount,
  }
}

export const PACK_TYPE_NAMES: Record<PackType, string> = {
  arcana: 'Arcana Pack',
  celestial: 'Celestial Pack',
  spectral: 'Spectral Pack',
}

export const PACK_SIZE_LABELS: Record<PackSize, string> = {
  normal: '',
  jumbo: 'Jumbo',
  mega: 'Mega',
}
