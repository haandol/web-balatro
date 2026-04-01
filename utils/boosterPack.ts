import type { BoosterPack } from '~/types/boosterPack'
import type { ConsumableCard } from '~/types/consumable'
import { createRandomPlanetConsumable } from '~/utils/planet'
import { createRandomSpectralConsumable } from '~/utils/spectral'
import { createRandomTarotConsumable } from '~/utils/tarot'

export function generatePackContents(pack: BoosterPack): ConsumableCard[] {
  const cards: ConsumableCard[] = []
  for (let i = 0; i < pack.totalCards; i++) {
    switch (pack.type) {
      case 'arcana':
        cards.push(createRandomTarotConsumable())
        break
      case 'celestial':
        cards.push(createRandomPlanetConsumable())
        break
      case 'spectral':
        cards.push(createRandomSpectralConsumable())
        break
    }
  }
  return cards
}
