import type { ConsumableCard } from '~/types/consumable'
import { SPECTRAL_DEFINITIONS, type SpectralDefinition } from '~/data/spectrals'

export function getSpectralDefinition(spectralId: string): SpectralDefinition | undefined {
  return SPECTRAL_DEFINITIONS.find((s) => s.id === spectralId)
}

export function createSpectralConsumable(spectralId: string): ConsumableCard | null {
  const def = getSpectralDefinition(spectralId)
  if (!def) return null
  return {
    id: `spectral-${spectralId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: 'spectral',
    name: def.name,
    description: def.description,
    effect: { type: 'spectral', spectralId: def.id, effectType: def.effectType },
    sellPrice: 2,
  }
}

export function createRandomSpectralConsumable(): ConsumableCard {
  const def = SPECTRAL_DEFINITIONS[Math.floor(Math.random() * SPECTRAL_DEFINITIONS.length)]
  return createSpectralConsumable(def.id)!
}
