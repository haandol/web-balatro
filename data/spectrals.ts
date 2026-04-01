export interface SpectralDefinition {
  id: string
  name: string
  description: string
  effectType: string
  /** 'auto' = instant use, 'select_cards' = player selects target cards from hand */
  targetType: 'auto' | 'select_cards'
  minTargets?: number
  maxTargets?: number
  requiresConfirmation: boolean
}

export const SPECTRAL_DEFINITIONS: SpectralDefinition[] = [
  // 1. Deck add/modify
  {
    id: 'familiar',
    name: 'Familiar',
    description: 'Add 3 random enhanced face cards to hand. Destroy 1 random card in hand.',
    effectType: 'add_face_cards',
    targetType: 'auto',
    requiresConfirmation: true,
  },
  {
    id: 'grim',
    name: 'Grim',
    description: 'Add 3 random enhanced Aces to hand. Destroy 1 random card in hand.',
    effectType: 'add_aces',
    targetType: 'auto',
    requiresConfirmation: true,
  },
  {
    id: 'incantation',
    name: 'Incantation',
    description: 'Add 4 random enhanced number cards (2-10) to hand. Destroy 1 random card in hand.',
    effectType: 'add_number_cards',
    targetType: 'auto',
    requiresConfirmation: true,
  },
  {
    id: 'cryptid',
    name: 'Cryptid',
    description: 'Create 2 copies of a selected card in your hand.',
    effectType: 'copy_card',
    targetType: 'select_cards',
    minTargets: 1,
    maxTargets: 1,
    requiresConfirmation: false,
  },
  // 2. Card modifier
  {
    id: 'talisman',
    name: 'Talisman',
    description: 'Add Gold Seal to a selected card.',
    effectType: 'add_gold_seal',
    targetType: 'select_cards',
    minTargets: 1,
    maxTargets: 1,
    requiresConfirmation: false,
  },
  {
    id: 'aura',
    name: 'Aura',
    description: 'Add Foil, Holographic, or Polychrome to a selected card.',
    effectType: 'add_random_edition',
    targetType: 'select_cards',
    minTargets: 1,
    maxTargets: 1,
    requiresConfirmation: false,
  },
  // 3. Joker related
  {
    id: 'wraith',
    name: 'Wraith',
    description: 'Create a random Rare Joker. Set money to $0.',
    effectType: 'create_rare_joker',
    targetType: 'auto',
    requiresConfirmation: true,
  },
  {
    id: 'ectoplasm',
    name: 'Ectoplasm',
    description: 'Add Negative to a random Joker. Hand size permanently -1.',
    effectType: 'add_negative_to_joker',
    targetType: 'auto',
    requiresConfirmation: true,
  },
  {
    id: 'ankh',
    name: 'Ankh',
    description: 'Create a copy of a random Joker. Destroy all other Jokers.',
    effectType: 'copy_joker',
    targetType: 'auto',
    requiresConfirmation: true,
  },
  {
    id: 'hex',
    name: 'Hex',
    description: 'Add Polychrome to a random Joker. Destroy all other Jokers.',
    effectType: 'add_polychrome_to_joker',
    targetType: 'auto',
    requiresConfirmation: true,
  },
  // 4. Mass transform
  {
    id: 'sigil',
    name: 'Sigil',
    description: 'Convert all cards in hand to a single random suit.',
    effectType: 'unify_suit',
    targetType: 'auto',
    requiresConfirmation: false,
  },
  {
    id: 'ouija',
    name: 'Ouija',
    description: 'Convert all cards in hand to a single random rank. Hand size permanently -1.',
    effectType: 'unify_rank',
    targetType: 'auto',
    requiresConfirmation: true,
  },
  // 5. Resource/special
  {
    id: 'immolate',
    name: 'Immolate',
    description: 'Gain $20. Destroy 5 random cards in hand.',
    effectType: 'gain_money',
    targetType: 'auto',
    requiresConfirmation: true,
  },
  {
    id: 'black_hole',
    name: 'Black Hole',
    description: 'Upgrade every poker hand by 1 level.',
    effectType: 'level_all_hands',
    targetType: 'auto',
    requiresConfirmation: false,
  },
  {
    id: 'soul',
    name: 'Soul',
    description: 'Create a random Rare Joker.',
    effectType: 'create_legendary_joker',
    targetType: 'auto',
    requiresConfirmation: false,
  },
]
