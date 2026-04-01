import type { PokerHandType, HandLevelMap } from '~/types/poker'
import type { ConsumableCard } from '~/types/consumable'
import { PLANET_DEFINITIONS, type PlanetDefinition } from '~/data/planets'

export function getPlanetByHand(handType: PokerHandType): PlanetDefinition | undefined {
  return PLANET_DEFINITIONS.find((p) => p.targetHand === handType)
}

export function applyPlanetEffect(handType: PokerHandType, handLevels: HandLevelMap): HandLevelMap {
  const planet = getPlanetByHand(handType)
  if (!planet) return handLevels
  const current = handLevels[handType]
  return {
    ...handLevels,
    [handType]: {
      level: current.level + 1,
      baseChips: current.baseChips + planet.chipsPerLevel,
      baseMult: current.baseMult + planet.multPerLevel,
    },
  }
}

export function createPlanetConsumable(planetId: string): ConsumableCard | null {
  const planet = PLANET_DEFINITIONS.find((p) => p.id === planetId)
  if (!planet) return null
  return {
    id: `planet-${planetId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: 'planet',
    name: planet.name,
    description: `Upgrades ${getHandNameForPlanet(planet.targetHand)} by 1 level`,
    effect: { type: 'planet', targetHand: planet.targetHand },
    sellPrice: 1,
  }
}

export function createRandomPlanetConsumable(): ConsumableCard {
  const planet = PLANET_DEFINITIONS[Math.floor(Math.random() * PLANET_DEFINITIONS.length)]
  return createPlanetConsumable(planet.id)!
}

function getHandNameForPlanet(handType: PokerHandType): string {
  const names: Record<PokerHandType, string> = {
    HIGH_CARD: 'High Card',
    ONE_PAIR: 'One Pair',
    TWO_PAIR: 'Two Pair',
    THREE_OF_A_KIND: 'Three of a Kind',
    STRAIGHT: 'Straight',
    FLUSH: 'Flush',
    FULL_HOUSE: 'Full House',
    FOUR_OF_A_KIND: 'Four of a Kind',
    STRAIGHT_FLUSH: 'Straight Flush',
    ROYAL_FLUSH: 'Royal Flush',
  }
  return names[handType]
}
