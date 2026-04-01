import type { PlayingCard, Enhancement, Edition, Seal, Suit } from '~/types/card'
import type { Joker } from '~/types/joker'

// --- PlayingCard modifier operations (immutable) ---

export function setEnhancement(card: PlayingCard, enhancement: Enhancement): PlayingCard {
  return { ...card, enhancement }
}

export function removeEnhancement(card: PlayingCard): PlayingCard {
  const { enhancement: _, ...rest } = card
  return rest as PlayingCard
}

export function setEdition(card: PlayingCard, edition: Edition): PlayingCard {
  return { ...card, edition }
}

export function removeEdition(card: PlayingCard): PlayingCard {
  const { edition: _, ...rest } = card
  return rest as PlayingCard
}

export function setSeal(card: PlayingCard, seal: Seal): PlayingCard {
  return { ...card, seal }
}

export function removeSeal(card: PlayingCard): PlayingCard {
  const { seal: _, ...rest } = card
  return rest as PlayingCard
}

// --- Joker modifier operations (immutable) ---

export function setJokerEdition(joker: Joker, edition: Edition): Joker {
  return { ...joker, edition }
}

export function removeJokerEdition(joker: Joker): Joker {
  const { edition: _, ...rest } = joker
  return rest as Joker
}

// --- Query helpers ---

export function hasModifier(card: PlayingCard): boolean {
  return hasEnhancement(card) || hasEdition(card) || hasSeal(card)
}

export function hasEnhancement(card: PlayingCard): boolean {
  return card.enhancement !== undefined
}

export function hasEdition(card: PlayingCard): boolean {
  return card.edition !== undefined && card.edition !== 'base'
}

export function hasSeal(card: PlayingCard): boolean {
  return card.seal !== undefined
}

export function isWild(card: PlayingCard): boolean {
  return card.enhancement === 'wild'
}

export function isStone(card: PlayingCard): boolean {
  return card.enhancement === 'stone'
}

/** Wild cards return all 4 suits. Stone cards return empty array. */
export function getEffectiveSuits(card: PlayingCard): Suit[] {
  if (isStone(card)) return []
  if (isWild(card)) return ['hearts', 'diamonds', 'clubs', 'spades']
  return [card.suit]
}

/** Apply a modifier function to a specific card in an array. Returns a new array. */
export function applyModifierToCard(
  cards: PlayingCard[],
  cardId: string,
  modifier: (card: PlayingCard) => PlayingCard
): PlayingCard[] {
  return cards.map((c) => (c.id === cardId ? modifier(c) : c))
}

/** Apply a modifier function to multiple cards in an array. Returns a new array. */
export function applyModifierToCards(
  cards: PlayingCard[],
  cardIds: string[],
  modifier: (card: PlayingCard) => PlayingCard
): PlayingCard[] {
  const idSet = new Set(cardIds)
  return cards.map((c) => (idSet.has(c.id) ? modifier(c) : c))
}
