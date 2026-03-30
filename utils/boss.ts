import type { PlayingCard, Rank } from '~/types/card'
import type { BossModifier } from '~/data/bossBlinds'

const FACE_RANKS: Set<Rank> = new Set(['J', 'Q', 'K'])

export function isDebuffed(card: PlayingCard, modifier: BossModifier | null): boolean {
  if (!modifier) return false
  switch (modifier.type) {
    case 'debuff_suit':
      return card.suit === modifier.suit
    case 'debuff_face':
      return FACE_RANKS.has(card.rank)
    default:
      return false
  }
}
