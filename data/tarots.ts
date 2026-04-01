import type { Enhancement, Suit } from '~/types/card'

export interface TarotDefinition {
  id: string
  name: string
  description: string
  effectType: string
  enhancement?: Enhancement
  suit?: Suit
  targetCount?: number
}

export const TAROT_DEFINITIONS: TarotDefinition[] = [
  // --- Enhancement 부여 ---
  {
    id: 'the_magician',
    name: 'The Magician',
    description: 'Enhances 1 card to Lucky Card',
    effectType: 'add_enhancement',
    enhancement: 'lucky',
    targetCount: 1,
  },
  {
    id: 'the_empress',
    name: 'The Empress',
    description: 'Enhances 2 cards to Mult Cards',
    effectType: 'add_enhancement',
    enhancement: 'mult',
    targetCount: 2,
  },
  {
    id: 'the_emperor',
    name: 'The Emperor',
    description: 'Enhances 2 cards to Wild Cards',
    effectType: 'add_enhancement',
    enhancement: 'wild',
    targetCount: 2,
  },
  {
    id: 'the_hierophant',
    name: 'The Hierophant',
    description: 'Enhances 2 cards to Bonus Cards',
    effectType: 'add_enhancement',
    enhancement: 'bonus',
    targetCount: 2,
  },
  {
    id: 'the_lovers',
    name: 'The Lovers',
    description: 'Enhances 1 card to Wild Card',
    effectType: 'add_enhancement',
    enhancement: 'wild',
    targetCount: 1,
  },
  {
    id: 'the_chariot',
    name: 'The Chariot',
    description: 'Enhances 1 card to Steel Card',
    effectType: 'add_enhancement',
    enhancement: 'steel',
    targetCount: 1,
  },
  {
    id: 'justice',
    name: 'Justice',
    description: 'Enhances 1 card to Glass Card',
    effectType: 'add_enhancement',
    enhancement: 'glass',
    targetCount: 1,
  },
  {
    id: 'the_devil',
    name: 'The Devil',
    description: 'Enhances 1 card to Gold Card',
    effectType: 'add_enhancement',
    enhancement: 'gold',
    targetCount: 1,
  },
  {
    id: 'the_tower',
    name: 'The Tower',
    description: 'Enhances 1 card to Stone Card',
    effectType: 'add_enhancement',
    enhancement: 'stone',
    targetCount: 1,
  },

  // --- 수트 변환 ---
  {
    id: 'the_star',
    name: 'The Star',
    description: 'Converts up to 3 cards to Diamonds',
    effectType: 'convert_suit',
    suit: 'diamonds',
    targetCount: 3,
  },
  {
    id: 'the_moon',
    name: 'The Moon',
    description: 'Converts up to 3 cards to Clubs',
    effectType: 'convert_suit',
    suit: 'clubs',
    targetCount: 3,
  },
  {
    id: 'the_sun',
    name: 'The Sun',
    description: 'Converts up to 3 cards to Hearts',
    effectType: 'convert_suit',
    suit: 'hearts',
    targetCount: 3,
  },
  {
    id: 'the_world',
    name: 'The World',
    description: 'Converts up to 3 cards to Spades',
    effectType: 'convert_suit',
    suit: 'spades',
    targetCount: 3,
  },

  // --- 덱 조작 ---
  {
    id: 'the_hanged_man',
    name: 'The Hanged Man',
    description: 'Destroys up to 2 selected cards',
    effectType: 'destroy_cards',
    targetCount: 2,
  },
  {
    id: 'death',
    name: 'Death',
    description: 'Select 2 cards, left converts to right',
    effectType: 'copy_card_to_card',
    targetCount: 2,
  },
  {
    id: 'strength',
    name: 'Strength',
    description: 'Increases rank of up to 2 cards by 1',
    effectType: 'increase_rank',
    targetCount: 2,
  },

  // --- 자원 생성 ---
  {
    id: 'the_hermit',
    name: 'The Hermit',
    description: 'Doubles money (max $20)',
    effectType: 'double_money',
  },
  {
    id: 'the_wheel_of_fortune',
    name: 'The Wheel of Fortune',
    description: '1 in 4 chance to add Foil, Holo, or Polychrome to a random Joker',
    effectType: 'random_joker_edition',
  },
  {
    id: 'the_high_priestess',
    name: 'The High Priestess',
    description: 'Creates up to 2 Planet cards (if space)',
    effectType: 'generate_planet',
  },
  {
    id: 'judgment',
    name: 'Judgment',
    description: 'Creates a random Joker (if space)',
    effectType: 'generate_joker',
  },
  {
    id: 'the_fool',
    name: 'The Fool',
    description: 'Creates a random Planet card (if space)',
    effectType: 'generate_planet_single',
  },

  // --- Seal 부여 ---
  {
    id: 'temperance',
    name: 'Temperance',
    description: 'Gives a random card a Gold Seal',
    effectType: 'add_seal',
    targetCount: 1,
  },
]
