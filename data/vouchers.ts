export interface VoucherDefinition {
  id: string
  name: string
  description: string
  cost: number
  tier: 'base' | 'upgrade'
  upgradeOf?: string
  effect: VoucherEffect
}

export type VoucherEffect =
  | { type: 'bonus_hands'; value: number }
  | { type: 'bonus_discards'; value: number }
  | { type: 'interest_cap'; value: number }
  | { type: 'hand_size'; value: number }
  | { type: 'consumable_slots'; value: number }
  | { type: 'reroll_discount'; value: number }
  | { type: 'shop_discount'; value: number }
  | { type: 'shop_slots'; value: number }

export const VOUCHER_DEFINITIONS: VoucherDefinition[] = [
  // --- Pair 1: Hands ---
  {
    id: 'grabber',
    name: 'Grabber',
    description: '+1 hand per round',
    cost: 10,
    tier: 'base',
    effect: { type: 'bonus_hands', value: 1 },
  },
  {
    id: 'nacho_tong',
    name: 'Nacho Tong',
    description: '+1 hand per round',
    cost: 10,
    tier: 'upgrade',
    upgradeOf: 'grabber',
    effect: { type: 'bonus_hands', value: 1 },
  },

  // --- Pair 2: Discards ---
  {
    id: 'wasteful',
    name: 'Wasteful',
    description: '+1 discard per round',
    cost: 10,
    tier: 'base',
    effect: { type: 'bonus_discards', value: 1 },
  },
  {
    id: 'recyclomancy',
    name: 'Recyclomancy',
    description: '+1 discard per round',
    cost: 10,
    tier: 'upgrade',
    upgradeOf: 'wasteful',
    effect: { type: 'bonus_discards', value: 1 },
  },

  // --- Pair 3: Interest Cap ---
  {
    id: 'seed_money',
    name: 'Seed Money',
    description: 'Raise interest cap to $10',
    cost: 10,
    tier: 'base',
    effect: { type: 'interest_cap', value: 10 },
  },
  {
    id: 'money_tree',
    name: 'Money Tree',
    description: 'Raise interest cap to $20',
    cost: 10,
    tier: 'upgrade',
    upgradeOf: 'seed_money',
    effect: { type: 'interest_cap', value: 20 },
  },

  // --- Pair 4: Hand Size ---
  {
    id: 'paintbrush',
    name: 'Paintbrush',
    description: '+1 hand size',
    cost: 10,
    tier: 'base',
    effect: { type: 'hand_size', value: 1 },
  },
  {
    id: 'palette',
    name: 'Palette',
    description: '+1 hand size',
    cost: 10,
    tier: 'upgrade',
    upgradeOf: 'paintbrush',
    effect: { type: 'hand_size', value: 1 },
  },

  // --- Pair 5: Consumable Slots ---
  {
    id: 'crystal_ball',
    name: 'Crystal Ball',
    description: '+1 consumable slot',
    cost: 10,
    tier: 'base',
    effect: { type: 'consumable_slots', value: 1 },
  },

  // --- Pair 6: Reroll Cost ---
  {
    id: 'reroll_surplus',
    name: 'Reroll Surplus',
    description: 'Rerolls cost $2 less',
    cost: 10,
    tier: 'base',
    effect: { type: 'reroll_discount', value: 2 },
  },
  {
    id: 'reroll_glut',
    name: 'Reroll Glut',
    description: 'Rerolls cost $2 less',
    cost: 10,
    tier: 'upgrade',
    upgradeOf: 'reroll_surplus',
    effect: { type: 'reroll_discount', value: 2 },
  },

  // --- Pair 7: Shop Discount ---
  {
    id: 'clearance_sale',
    name: 'Clearance Sale',
    description: 'All shop items 25% off',
    cost: 10,
    tier: 'base',
    effect: { type: 'shop_discount', value: 25 },
  },
  {
    id: 'liquidation',
    name: 'Liquidation',
    description: 'All shop items 50% off',
    cost: 10,
    tier: 'upgrade',
    upgradeOf: 'clearance_sale',
    effect: { type: 'shop_discount', value: 50 },
  },

  // --- Pair 8: Shop Joker Slots ---
  {
    id: 'overstock',
    name: 'Overstock',
    description: '+1 shop joker slot',
    cost: 10,
    tier: 'base',
    effect: { type: 'shop_slots', value: 1 },
  },
  {
    id: 'overstock_plus',
    name: 'Overstock Plus',
    description: '+1 shop joker slot',
    cost: 10,
    tier: 'upgrade',
    upgradeOf: 'overstock',
    effect: { type: 'shop_slots', value: 1 },
  },
]

export function getAvailableVouchers(purchased: string[]): VoucherDefinition[] {
  const purchasedSet = new Set(purchased)
  return VOUCHER_DEFINITIONS.filter((v) => {
    if (purchasedSet.has(v.id)) return false
    if (v.tier === 'upgrade' && v.upgradeOf && !purchasedSet.has(v.upgradeOf)) return false
    return true
  })
}
