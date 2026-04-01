import type { PokerHandType, HandLevelMap } from '~/types/poker'

export interface PlanetDefinition {
  id: string
  name: string
  targetHand: PokerHandType
  chipsPerLevel: number
  multPerLevel: number
}

export const PLANET_DEFINITIONS: PlanetDefinition[] = [
  { id: 'pluto', name: 'Pluto', targetHand: 'HIGH_CARD', chipsPerLevel: 10, multPerLevel: 1 },
  { id: 'mercury', name: 'Mercury', targetHand: 'ONE_PAIR', chipsPerLevel: 15, multPerLevel: 1 },
  { id: 'uranus', name: 'Uranus', targetHand: 'TWO_PAIR', chipsPerLevel: 20, multPerLevel: 1 },
  { id: 'venus', name: 'Venus', targetHand: 'THREE_OF_A_KIND', chipsPerLevel: 20, multPerLevel: 2 },
  { id: 'earth', name: 'Earth', targetHand: 'STRAIGHT', chipsPerLevel: 30, multPerLevel: 3 },
  { id: 'jupiter', name: 'Jupiter', targetHand: 'FLUSH', chipsPerLevel: 15, multPerLevel: 2 },
  { id: 'saturn', name: 'Saturn', targetHand: 'FULL_HOUSE', chipsPerLevel: 25, multPerLevel: 2 },
  { id: 'mars', name: 'Mars', targetHand: 'FOUR_OF_A_KIND', chipsPerLevel: 30, multPerLevel: 3 },
  { id: 'neptune', name: 'Neptune', targetHand: 'STRAIGHT_FLUSH', chipsPerLevel: 40, multPerLevel: 4 },
  { id: 'planet_x', name: 'Planet X', targetHand: 'ROYAL_FLUSH', chipsPerLevel: 40, multPerLevel: 4 },
]

const INITIAL_HAND_LEVELS: Record<PokerHandType, { chips: number; mult: number }> = {
  HIGH_CARD: { chips: 5, mult: 1 },
  ONE_PAIR: { chips: 10, mult: 2 },
  TWO_PAIR: { chips: 20, mult: 2 },
  THREE_OF_A_KIND: { chips: 30, mult: 3 },
  STRAIGHT: { chips: 30, mult: 4 },
  FLUSH: { chips: 35, mult: 4 },
  FULL_HOUSE: { chips: 40, mult: 4 },
  FOUR_OF_A_KIND: { chips: 60, mult: 7 },
  STRAIGHT_FLUSH: { chips: 100, mult: 8 },
  ROYAL_FLUSH: { chips: 100, mult: 8 },
}

export function createInitialHandLevels(): HandLevelMap {
  const levels = {} as HandLevelMap
  for (const [hand, base] of Object.entries(INITIAL_HAND_LEVELS)) {
    levels[hand as PokerHandType] = { level: 1, baseChips: base.chips, baseMult: base.mult }
  }
  return levels
}

export function getHandName(handType: PokerHandType): string {
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
