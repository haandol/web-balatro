import type { ConsumableCard } from '~/types/consumable'
import { TAROT_DEFINITIONS } from '~/data/tarots'

export function createTarotConsumable(tarotId: string): ConsumableCard {
  const def = TAROT_DEFINITIONS.find((t) => t.id === tarotId)
  if (!def) throw new Error(`Unknown tarot: ${tarotId}`)
  return {
    id: `tarot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: 'tarot',
    name: def.name,
    description: def.description,
    effect: { type: 'tarot', effectType: def.effectType },
    sellPrice: 1,
  }
}

export function createRandomTarotConsumable(): ConsumableCard {
  const def = TAROT_DEFINITIONS[Math.floor(Math.random() * TAROT_DEFINITIONS.length)]
  return createTarotConsumable(def.id)
}
