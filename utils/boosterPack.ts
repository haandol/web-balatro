import type { BoosterPack } from '~/types/boosterPack'
import type { ConsumableCard } from '~/types/consumable'
import { createRandomPlanetConsumable } from '~/utils/planet'
import { createRandomSpectralConsumable } from '~/utils/spectral'

export function generatePackContents(pack: BoosterPack): ConsumableCard[] {
  const cards: ConsumableCard[] = []
  for (let i = 0; i < pack.totalCards; i++) {
    switch (pack.type) {
      case 'arcana':
        // F16(타로) 미구현 — 플래닛 카드로 대체
        cards.push(createRandomPlanetConsumable())
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
