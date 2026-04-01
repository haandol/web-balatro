import type { PlayingCard, Rank } from '~/types/card'
import type { BossModifier } from '~/data/bossBlinds'

const FACE_RANKS: Set<Rank> = new Set(['J', 'Q', 'K'])

export function isDebuffed(card: PlayingCard, modifier: BossModifier | null): boolean {
  if (!modifier) return false

  // Stone cards have no rank/suit — never debuffed by suit/face conditions
  if (card.enhancement === 'stone') return false

  switch (modifier.type) {
    case 'debuff_suit':
      // Wild cards count as all suits — always debuffed by suit conditions
      if (card.enhancement === 'wild') return true
      return card.suit === modifier.suit
    case 'debuff_face':
      return FACE_RANKS.has(card.rank)
    default:
      return false
  }
}
