import type { Enhancement, Edition, Seal } from '~/types/card'

// --- Enhancement ---

export type EnhancementEffect =
  | { type: 'add_chips'; value: number; trigger: 'on_score' }
  | { type: 'add_mult'; value: number; trigger: 'on_score' }
  | { type: 'x_mult'; value: number; trigger: 'on_score'; destroyChance?: number }
  | { type: 'x_mult'; value: number; trigger: 'in_hand' }
  | { type: 'add_chips'; value: number; trigger: 'always' }
  | { type: 'wild'; trigger: 'hand_evaluation' }
  | { type: 'earn_money'; value: number; trigger: 'round_end_in_hand' }
  | {
      type: 'lucky'
      multChance: number
      multValue: number
      moneyChance: number
      moneyValue: number
      trigger: 'on_score'
    }

export interface EnhancementDefinition {
  id: Enhancement
  name: string
  description: string
  effect: EnhancementEffect
}

export const ENHANCEMENTS: Record<Enhancement, EnhancementDefinition> = {
  bonus: {
    id: 'bonus',
    name: 'Bonus Card',
    description: '+30 Chips when this card scores',
    effect: { type: 'add_chips', value: 30, trigger: 'on_score' },
  },
  mult: {
    id: 'mult',
    name: 'Mult Card',
    description: '+4 Mult when this card scores',
    effect: { type: 'add_mult', value: 4, trigger: 'on_score' },
  },
  wild: {
    id: 'wild',
    name: 'Wild Card',
    description: 'Considered every suit',
    effect: { type: 'wild', trigger: 'hand_evaluation' },
  },
  glass: {
    id: 'glass',
    name: 'Glass Card',
    description: 'x2 Mult, 1 in 4 chance to destroy',
    effect: { type: 'x_mult', value: 2, trigger: 'on_score', destroyChance: 0.25 },
  },
  steel: {
    id: 'steel',
    name: 'Steel Card',
    description: 'x1.5 Mult while in hand',
    effect: { type: 'x_mult', value: 1.5, trigger: 'in_hand' },
  },
  stone: {
    id: 'stone',
    name: 'Stone Card',
    description: '+50 Chips, no rank or suit',
    effect: { type: 'add_chips', value: 50, trigger: 'always' },
  },
  gold: {
    id: 'gold',
    name: 'Gold Card',
    description: 'Earn $3 at end of round if in hand',
    effect: { type: 'earn_money', value: 3, trigger: 'round_end_in_hand' },
  },
  lucky: {
    id: 'lucky',
    name: 'Lucky Card',
    description: '1/5 chance +20 Mult, 1/15 chance +$20',
    effect: {
      type: 'lucky',
      multChance: 0.2,
      multValue: 20,
      moneyChance: 1 / 15,
      moneyValue: 20,
      trigger: 'on_score',
    },
  },
}

// --- Edition ---

export type EditionEffect =
  | { type: 'none' }
  | { type: 'add_chips'; value: number }
  | { type: 'add_mult'; value: number }
  | { type: 'x_mult'; value: number }
  | { type: 'joker_slot'; value: number }

export interface EditionDefinition {
  id: Edition
  name: string
  description: string
  effect: EditionEffect
}

export const EDITIONS: Record<Edition, EditionDefinition> = {
  base: {
    id: 'base',
    name: 'Base',
    description: 'No effect',
    effect: { type: 'none' },
  },
  foil: {
    id: 'foil',
    name: 'Foil',
    description: '+50 Chips',
    effect: { type: 'add_chips', value: 50 },
  },
  holographic: {
    id: 'holographic',
    name: 'Holographic',
    description: '+10 Mult',
    effect: { type: 'add_mult', value: 10 },
  },
  polychrome: {
    id: 'polychrome',
    name: 'Polychrome',
    description: 'x1.5 Mult',
    effect: { type: 'x_mult', value: 1.5 },
  },
  negative: {
    id: 'negative',
    name: 'Negative',
    description: '+1 Joker slot',
    effect: { type: 'joker_slot', value: 1 },
  },
}

// --- Seal ---

export type SealEffect =
  | { type: 'earn_money'; value: number; trigger: 'on_score' }
  | { type: 'generate_planet'; trigger: 'round_end_in_hand' }
  | { type: 'retrigger'; count: number; trigger: 'on_score' }
  | { type: 'generate_tarot'; trigger: 'on_discard' }

export interface SealDefinition {
  id: Seal
  name: string
  description: string
  effect: SealEffect
}

export const SEALS: Record<Seal, SealDefinition> = {
  gold: {
    id: 'gold',
    name: 'Gold Seal',
    description: 'Earn $3 when this card scores',
    effect: { type: 'earn_money', value: 3, trigger: 'on_score' },
  },
  blue: {
    id: 'blue',
    name: 'Blue Seal',
    description: 'Creates a Planet card at end of round',
    effect: { type: 'generate_planet', trigger: 'round_end_in_hand' },
  },
  red: {
    id: 'red',
    name: 'Red Seal',
    description: 'Retrigger this card',
    effect: { type: 'retrigger', count: 1, trigger: 'on_score' },
  },
  purple: {
    id: 'purple',
    name: 'Purple Seal',
    description: 'Creates a Tarot card when discarded',
    effect: { type: 'generate_tarot', trigger: 'on_discard' },
  },
}
