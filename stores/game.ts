import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PlayingCard } from '~/types/card'
import type { HandResult, ScoreBreakdown, HandLevelMap } from '~/types/poker'
import type { Joker } from '~/types/joker'
import type { ConsumableCard } from '~/types/consumable'
import { createDeck, shuffle, draw } from '~/utils/deck'
import { evaluateHand, calculateScore } from '~/utils/poker'
import { type BlindType, BLIND_ORDER, MAX_ANTE, getTargetScore, BLIND_REWARDS } from '~/data/blinds'
import { JOKER_DEFINITIONS, MAX_JOKER_SLOTS } from '~/data/jokers'
import type { JokerRarity } from '~/types/joker'
import { calculateRoundEarnings, type RoundEarnings } from '~/utils/economy'
import { BOSS_BLINDS, type BossBlind } from '~/data/bossBlinds'
import { TAGS, type Tag } from '~/data/tags'
import { saveGame, loadGame, clearSave } from '~/utils/saveGame'
import { createInitialHandLevels } from '~/data/planets'
import { applyPlanetEffect } from '~/utils/planet'
import type { PokerHandType } from '~/types/poker'
import type { Rank, Enhancement } from '~/types/card'
import { SUITS, RANKS } from '~/data/cards'
import type { BoosterPack, OpenPackState } from '~/types/boosterPack'
import { rollShopPack } from '~/data/boosterPacks'
import { generatePackContents } from '~/utils/boosterPack'
import { TAROT_DEFINITIONS } from '~/data/tarots'
import { createRandomPlanetConsumable } from '~/utils/planet'

export type GamePhase = 'menu' | 'blind_select' | 'playing' | 'round_end' | 'shop' | 'won' | 'lost'

export interface RunStats {
  blindsCleared: number
  bestHand: number
  bestHandName: string
  totalMoneyEarned: number
}

function emptyStats(): RunStats {
  return { blindsCleared: 0, bestHand: 0, bestHandName: '', totalMoneyEarned: 0 }
}

export const useGameStore = defineStore('game', () => {
  const DEFAULT_HAND_SIZE = 8
  const DEFAULT_HANDS = 4
  const DEFAULT_DISCARDS = 3

  // --- F1: Deck State ---
  const drawPile = ref<PlayingCard[]>([])
  const hand = ref<PlayingCard[]>([])
  const discardPile = ref<PlayingCard[]>([])

  // --- F7: Ante/Blind State ---
  const currentAnte = ref(1)
  const currentBlind = ref<BlindType>('small')
  const gamePhase = ref<GamePhase>('menu')

  // --- F8: Boss Blind ---
  const currentBoss = ref<BossBlind | null>(null)
  const usedBossIds = ref<string[]>([])

  // --- F2: Round State ---
  const handsRemaining = ref(DEFAULT_HANDS)
  const discardsRemaining = ref(DEFAULT_DISCARDS)
  const roundScore = ref(0)
  const targetScore = ref(0)
  const lastHandResult = ref<(HandResult & ScoreBreakdown) | null>(null)
  const roundReward = ref(0)

  // --- F5/F6: Jokers ---
  const jokers = ref<Joker[]>([])

  // --- F10: Economy ---
  const money = ref(4)
  const lastEarnings = ref<RoundEarnings | null>(null)

  // --- F12: Run Stats ---
  const runStats = ref<RunStats>(emptyStats())

  // --- F11: Blind Skip ---
  const lastSkipTag = ref<Tag | null>(null)
  const freeRerolls = ref(0)

  // --- F15: Consumables ---
  const consumables = ref<ConsumableCard[]>([])
  const consumableSlots = ref(2)

  // --- F17: Hand Levels ---
  const handLevels = ref<HandLevelMap>(createInitialHandLevels())

  // --- F18: Spectral modifiers ---
  const handSizeModifier = ref(0)

  // --- F9: Shop ---
  const shopJokers = ref<Joker[]>([])
  const rerollCost = ref(5)
  const BASE_REROLL_COST = 5

  // --- F20: Booster Packs ---
  const shopPacks = ref<BoosterPack[]>([])
  const openPack = ref<OpenPackState | null>(null)

  // --- Getters ---
  const drawPileSize = computed(() => drawPile.value.length)
  const handSize = computed(() => hand.value.length)
  const discardPileSize = computed(() => discardPile.value.length)
  const totalCards = computed(() => drawPile.value.length + hand.value.length + discardPile.value.length)
  const effectiveHandSize = computed(() => Math.max(1, DEFAULT_HAND_SIZE + handSizeModifier.value))
  const maxJokerSlots = computed(() => {
    const negativeCount = jokers.value.filter((j) => j.edition === 'negative').length
    return MAX_JOKER_SLOTS + negativeCount
  })
  const activeBossModifier = computed(() =>
    currentBlind.value === 'boss' ? (currentBoss.value?.modifier ?? null) : null
  )

  // --- F7: Run Management ---

  /** 새 런을 시작한다. 앤티 1, 스몰 블라인드 선택 화면으로. */
  function initRun() {
    currentAnte.value = 1
    currentBlind.value = 'small'
    gamePhase.value = 'blind_select'
    roundScore.value = 0
    targetScore.value = 0
    lastHandResult.value = null
    roundReward.value = 0
    money.value = 4
    lastEarnings.value = null
    jokers.value = []
    currentBoss.value = null
    usedBossIds.value = []
    selectBossForAnte()
    runStats.value = emptyStats()
    lastSkipTag.value = null
    freeRerolls.value = 0
    consumables.value = []
    consumableSlots.value = 2
    handLevels.value = createInitialHandLevels()
    handSizeModifier.value = 0
    shopJokers.value = []
    shopPacks.value = []
    openPack.value = null
    rerollCost.value = BASE_REROLL_COST

    // 덱 초기화
    const deck = shuffle(createDeck())
    drawPile.value = deck
    hand.value = []
    discardPile.value = []

    clearSave()
  }

  /** 앤티에 대해 보스를 미리 선택한다 (블라인드 선택 화면에서 미리보기용). */
  function selectBossForAnte() {
    const available = BOSS_BLINDS.filter((b) => !usedBossIds.value.includes(b.id))
    if (available.length === 0) {
      // 모든 보스 사용 시 리셋
      usedBossIds.value = []
      currentBoss.value = BOSS_BLINDS[Math.floor(Math.random() * BOSS_BLINDS.length)]
    } else {
      currentBoss.value = available[Math.floor(Math.random() * available.length)]
    }
  }

  /** 현재 블라인드를 시작한다. 덱 리셔플 + 핸드/디스카드 초기화 + 카드 드로우. */
  function startBlind() {
    // 목표 점수 계산
    let base = getTargetScore(currentAnte.value, currentBlind.value)

    // 보스 수정자: base_multiplied
    if (currentBlind.value === 'boss' && currentBoss.value?.modifier.type === 'base_multiplied') {
      base = Math.round(base * currentBoss.value.modifier.factor)
    }
    targetScore.value = base
    roundScore.value = 0
    lastHandResult.value = null
    lastSkipTag.value = null

    // 핸드/디스카드 초기화
    handsRemaining.value = DEFAULT_HANDS
    discardsRemaining.value =
      currentBlind.value === 'boss' && currentBoss.value?.modifier.type === 'no_discards' ? 0 : DEFAULT_DISCARDS

    // 모든 카드를 draw pile로 모아서 리셔플
    drawPile.value = shuffle([...drawPile.value, ...hand.value, ...discardPile.value])
    hand.value = []
    discardPile.value = []

    // 카드 드로우
    const { drawn, remaining } = draw(drawPile.value, effectiveHandSize.value)
    hand.value = drawn
    drawPile.value = remaining

    gamePhase.value = 'playing'
    autoSave()
  }

  /** 스몰/빅 블라인드를 스킵한다. 태그 보상을 받고 다음 블라인드로 이동. */
  function skipBlind() {
    if (currentBlind.value === 'boss') return
    if (gamePhase.value !== 'blind_select') return

    const tag = TAGS[Math.floor(Math.random() * TAGS.length)]
    lastSkipTag.value = tag

    if (tag.reward.type === 'money') {
      money.value += tag.reward.amount
    } else if (tag.reward.type === 'free_reroll') {
      freeRerolls.value += tag.reward.count
    }

    advanceBlind()
  }

  /** 블라인드 클리어 후 다음 블라인드로 이동한다. */
  function advanceBlind() {
    const blindIndex = BLIND_ORDER.indexOf(currentBlind.value)

    // 보스 클리어 시 사용 기록
    if (currentBlind.value === 'boss' && currentBoss.value) {
      usedBossIds.value = [...usedBossIds.value, currentBoss.value.id]
    }

    if (blindIndex < BLIND_ORDER.length - 1) {
      currentBlind.value = BLIND_ORDER[blindIndex + 1]
      gamePhase.value = 'blind_select'
    } else if (currentAnte.value < MAX_ANTE) {
      currentAnte.value += 1
      currentBlind.value = BLIND_ORDER[0]
      selectBossForAnte()
      gamePhase.value = 'blind_select'
    } else {
      gamePhase.value = 'won'
    }
  }

  // --- F10: Economy Actions ---

  function spendMoney(amount: number): boolean {
    if (money.value < amount) return false
    money.value -= amount
    return true
  }

  function sellJoker(jokerId: string) {
    const joker = jokers.value.find((j) => j.id === jokerId)
    if (!joker || joker.eternal) return
    money.value += joker.sellPrice
    removeJoker(jokerId)
  }

  // --- F15: Consumable Actions ---

  function addConsumable(card: ConsumableCard): boolean {
    if (consumables.value.length >= consumableSlots.value) return false
    consumables.value = [...consumables.value, card]
    return true
  }

  function removeConsumable(cardId: string) {
    consumables.value = consumables.value.filter((c) => c.id !== cardId)
  }

  function sellConsumable(cardId: string) {
    const card = consumables.value.find((c) => c.id === cardId)
    if (!card) return
    money.value += card.sellPrice
    removeConsumable(cardId)
  }

  function useConsumable(cardId: string): boolean {
    if (gamePhase.value !== 'playing') return false
    const card = consumables.value.find((c) => c.id === cardId)
    if (!card) return false

    if (card.type === 'planet' && card.effect.type === 'planet') {
      const targetHand = (card.effect as { type: string; targetHand: string }).targetHand
      handLevels.value = applyPlanetEffect(targetHand as PokerHandType, handLevels.value)
      removeConsumable(cardId)
      return true
    }

    if (card.type === 'spectral') {
      const result = applySpectralEffect(card)
      if (result) removeConsumable(cardId)
      return result
    }

    if (card.type === 'tarot') {
      const result = applyTarotEffect(card)
      if (result) removeConsumable(cardId)
      return result
    }

    return false
  }

  // --- F18: Spectral Effect Application ---

  function generateCardId(): string {
    return `card-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  }

  function randomEnhancement(): Enhancement {
    const enhancements: Enhancement[] = ['bonus', 'mult', 'wild', 'glass', 'steel', 'stone', 'gold', 'lucky']
    return enhancements[Math.floor(Math.random() * enhancements.length)]
  }

  function destroyRandomHandCards(count: number) {
    const toDestroy = Math.min(count, hand.value.length)
    const indices = [...Array(hand.value.length).keys()]
    // Fisher-Yates partial shuffle to pick random indices
    for (let i = indices.length - 1; i > indices.length - 1 - toDestroy && i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[indices[i], indices[j]] = [indices[j], indices[i]]
    }
    const destroyIndices = new Set(indices.slice(-toDestroy))
    hand.value = hand.value.filter((_, i) => !destroyIndices.has(i))
  }

  function createRandomPlayingCard(rankFilter: 'face' | 'ace' | 'number'): import('~/types/card').PlayingCard {
    const suit = SUITS[Math.floor(Math.random() * SUITS.length)]
    let rank: Rank
    if (rankFilter === 'face') {
      const faceRanks: Rank[] = ['J', 'Q', 'K']
      rank = faceRanks[Math.floor(Math.random() * faceRanks.length)]
    } else if (rankFilter === 'ace') {
      rank = 'A'
    } else {
      const numberRanks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10']
      rank = numberRanks[Math.floor(Math.random() * numberRanks.length)]
    }
    return { id: generateCardId(), rank, suit, enhancement: randomEnhancement() }
  }

  function applySpectralEffect(card: ConsumableCard): boolean {
    const effectType = (card.effect as { type: string; effectType?: string }).effectType
    if (!effectType) return false

    switch (effectType) {
      case 'add_face_cards': {
        destroyRandomHandCards(1)
        for (let i = 0; i < 3; i++) {
          drawPile.value = [...drawPile.value, createRandomPlayingCard('face')]
        }
        return true
      }
      case 'add_aces': {
        destroyRandomHandCards(1)
        for (let i = 0; i < 3; i++) {
          drawPile.value = [...drawPile.value, createRandomPlayingCard('ace')]
        }
        return true
      }
      case 'add_number_cards': {
        destroyRandomHandCards(1)
        for (let i = 0; i < 4; i++) {
          drawPile.value = [...drawPile.value, createRandomPlayingCard('number')]
        }
        return true
      }
      case 'copy_card': {
        // Auto-select: copy a random card from hand
        if (hand.value.length === 0) return false
        const target = hand.value[Math.floor(Math.random() * hand.value.length)]
        for (let i = 0; i < 2; i++) {
          drawPile.value = [...drawPile.value, { ...target, id: generateCardId() }]
        }
        return true
      }
      case 'add_gold_seal': {
        if (hand.value.length === 0) return false
        const idx = Math.floor(Math.random() * hand.value.length)
        const updated = [...hand.value]
        updated[idx] = { ...updated[idx], seal: 'gold' }
        hand.value = updated
        return true
      }
      case 'add_random_edition': {
        if (hand.value.length === 0) return false
        const editions: import('~/types/card').Edition[] = ['foil', 'holographic', 'polychrome']
        const edition = editions[Math.floor(Math.random() * editions.length)]
        const idx2 = Math.floor(Math.random() * hand.value.length)
        const updated2 = [...hand.value]
        updated2[idx2] = { ...updated2[idx2], edition }
        hand.value = updated2
        return true
      }
      case 'create_rare_joker': {
        if (jokers.value.length >= maxJokerSlots.value) return false
        const rarePool = JOKER_DEFINITIONS.filter((d) => d.rarity === 'rare')
        const def = rarePool[Math.floor(Math.random() * rarePool.length)]
        const newJoker: Joker = { ...def, id: `joker-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }
        jokers.value = [...jokers.value, newJoker]
        money.value = 0
        return true
      }
      case 'add_negative_to_joker': {
        if (jokers.value.length === 0) return false
        const jIdx = Math.floor(Math.random() * jokers.value.length)
        const updatedJokers = [...jokers.value]
        updatedJokers[jIdx] = { ...updatedJokers[jIdx], edition: 'negative' }
        jokers.value = updatedJokers
        handSizeModifier.value = Math.max(handSizeModifier.value - 1, -(DEFAULT_HAND_SIZE - 1))
        return true
      }
      case 'copy_joker': {
        if (jokers.value.length === 0) return false
        const source = jokers.value[Math.floor(Math.random() * jokers.value.length)]
        const copy: Joker = { ...source, id: `joker-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }
        // Destroy all other non-eternal jokers
        jokers.value = [copy, ...jokers.value.filter((j) => j.id === source.id || j.eternal)]
        return true
      }
      case 'add_polychrome_to_joker': {
        if (jokers.value.length === 0) return false
        const targetIdx = Math.floor(Math.random() * jokers.value.length)
        const targetJoker = jokers.value[targetIdx]
        const updated3 = { ...targetJoker, edition: 'polychrome' as const }
        // Destroy all other non-eternal jokers
        jokers.value = [updated3, ...jokers.value.filter((j, i) => i !== targetIdx && j.eternal)]
        return true
      }
      case 'unify_suit': {
        if (hand.value.length === 0) return false
        const suit = SUITS[Math.floor(Math.random() * SUITS.length)]
        hand.value = hand.value.map((c) => ({ ...c, suit }))
        return true
      }
      case 'unify_rank': {
        if (hand.value.length === 0) return false
        const rank = RANKS[Math.floor(Math.random() * RANKS.length)]
        hand.value = hand.value.map((c) => ({ ...c, rank }))
        handSizeModifier.value = Math.max(handSizeModifier.value - 1, -(DEFAULT_HAND_SIZE - 1))
        return true
      }
      case 'gain_money': {
        money.value += 20
        destroyRandomHandCards(5)
        return true
      }
      case 'level_all_hands': {
        const handTypes: PokerHandType[] = [
          'HIGH_CARD',
          'ONE_PAIR',
          'TWO_PAIR',
          'THREE_OF_A_KIND',
          'STRAIGHT',
          'FLUSH',
          'FULL_HOUSE',
          'FOUR_OF_A_KIND',
          'STRAIGHT_FLUSH',
          'ROYAL_FLUSH',
        ]
        let levels = { ...handLevels.value }
        for (const ht of handTypes) {
          levels = applyPlanetEffect(ht, levels)
        }
        handLevels.value = levels
        return true
      }
      case 'create_legendary_joker': {
        // Phase 3에서 legendary 조커 구현 예정. 현재는 rare 조커로 대체
        if (jokers.value.length >= maxJokerSlots.value) return false
        const pool = JOKER_DEFINITIONS.filter((d) => d.rarity === 'rare')
        const def2 = pool[Math.floor(Math.random() * pool.length)]
        const newJ: Joker = { ...def2, id: `joker-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }
        jokers.value = [...jokers.value, newJ]
        return true
      }
      default:
        return false
    }
  }

  // --- F16: Tarot Effect Application ---

  const NEXT_RANK: Record<Rank, Rank> = {
    '2': '3',
    '3': '4',
    '4': '5',
    '5': '6',
    '6': '7',
    '7': '8',
    '8': '9',
    '9': '10',
    '10': 'J',
    J: 'Q',
    Q: 'K',
    K: 'A',
    A: 'A',
  }

  function pickRandomHandIndices(count: number): number[] {
    const max = Math.min(count, hand.value.length)
    const indices = [...Array(hand.value.length).keys()]
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[indices[i], indices[j]] = [indices[j], indices[i]]
    }
    return indices.slice(0, max)
  }

  function applyTarotEffect(card: ConsumableCard): boolean {
    const effectType = (card.effect as { type: string; effectType?: string }).effectType
    if (!effectType) return false

    const def = TAROT_DEFINITIONS.find((t) => t.effectType === effectType && t.name === card.name)

    switch (effectType) {
      case 'add_enhancement': {
        if (hand.value.length === 0) return false
        const enhancement = def?.enhancement
        if (!enhancement) return false
        const count = def?.targetCount ?? 1
        const indices = pickRandomHandIndices(count)
        const updated = [...hand.value]
        for (const idx of indices) {
          updated[idx] = { ...updated[idx], enhancement }
        }
        hand.value = updated
        return true
      }
      case 'add_seal': {
        if (hand.value.length === 0) return false
        const idx = pickRandomHandIndices(1)[0]
        const updated = [...hand.value]
        updated[idx] = { ...updated[idx], seal: 'gold' }
        hand.value = updated
        return true
      }
      case 'convert_suit': {
        if (hand.value.length === 0) return false
        const suit = def?.suit
        if (!suit) return false
        const count = def?.targetCount ?? 3
        const indices = pickRandomHandIndices(count)
        const updated = [...hand.value]
        for (const idx of indices) {
          updated[idx] = { ...updated[idx], suit }
        }
        hand.value = updated
        return true
      }
      case 'destroy_cards': {
        if (hand.value.length === 0) return false
        const count = Math.min(def?.targetCount ?? 2, hand.value.length)
        destroyRandomHandCards(count)
        return true
      }
      case 'copy_card_to_card': {
        if (hand.value.length < 2) return false
        const indices = pickRandomHandIndices(2)
        const updated = [...hand.value]
        const source = updated[indices[1]]
        updated[indices[0]] = { ...source, id: updated[indices[0]].id }
        hand.value = updated
        return true
      }
      case 'increase_rank': {
        if (hand.value.length === 0) return false
        const count = def?.targetCount ?? 2
        const indices = pickRandomHandIndices(count)
        const updated = [...hand.value]
        for (const idx of indices) {
          updated[idx] = { ...updated[idx], rank: NEXT_RANK[updated[idx].rank] }
        }
        hand.value = updated
        return true
      }
      case 'double_money': {
        money.value += Math.min(money.value, 20)
        return true
      }
      case 'random_joker_edition': {
        if (jokers.value.length === 0) return false
        if (Math.random() < 0.25) {
          const editions: import('~/types/card').Edition[] = ['foil', 'holographic', 'polychrome']
          const edition = editions[Math.floor(Math.random() * editions.length)]
          const jIdx = Math.floor(Math.random() * jokers.value.length)
          const updatedJokers = [...jokers.value]
          updatedJokers[jIdx] = { ...updatedJokers[jIdx], edition }
          jokers.value = updatedJokers
        }
        return true
      }
      case 'generate_planet': {
        const slotsAvailable = consumableSlots.value - consumables.value.length
        const count = Math.min(2, slotsAvailable)
        for (let i = 0; i < count; i++) {
          consumables.value = [...consumables.value, createRandomPlanetConsumable()]
        }
        return true
      }
      case 'generate_planet_single': {
        if (consumables.value.length >= consumableSlots.value) return true
        consumables.value = [...consumables.value, createRandomPlanetConsumable()]
        return true
      }
      case 'generate_joker': {
        if (jokers.value.length >= maxJokerSlots.value) return false
        const pool = JOKER_DEFINITIONS.filter((d) => !getOwnedJokerNames().has(d.name))
        const defs = pool.length > 0 ? pool : JOKER_DEFINITIONS
        const jDef = defs[Math.floor(Math.random() * defs.length)]
        const newJoker: Joker = {
          ...jDef,
          id: `joker-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        }
        jokers.value = [...jokers.value, newJoker]
        return true
      }
      default:
        return false
    }
  }

  // --- F9: Shop Actions ---

  function pickRarity(): JokerRarity {
    const roll = Math.random()
    if (roll < 0.05) return 'rare'
    if (roll < 0.3) return 'uncommon'
    return 'common'
  }

  function getOwnedJokerNames(): Set<string> {
    const names = new Set<string>()
    for (const j of jokers.value) names.add(j.name)
    for (const j of shopJokers.value) names.add(j.name)
    return names
  }

  function generateShopJoker(): Joker {
    const rarity = pickRarity()
    const owned = getOwnedJokerNames()
    const pool = JOKER_DEFINITIONS.filter((d) => d.rarity === rarity && !owned.has(d.name))
    const fallbackPool = pool.length > 0 ? pool : JOKER_DEFINITIONS.filter((d) => !owned.has(d.name))
    const def =
      fallbackPool.length > 0
        ? fallbackPool[Math.floor(Math.random() * fallbackPool.length)]
        : JOKER_DEFINITIONS[Math.floor(Math.random() * JOKER_DEFINITIONS.length)]
    return { ...def, id: `joker-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }
  }

  function generateShop() {
    shopJokers.value = [generateShopJoker(), generateShopJoker()]
    shopPacks.value = [rollShopPack(), rollShopPack()]
    rerollCost.value = BASE_REROLL_COST
  }

  function openShop() {
    generateShop()
    gamePhase.value = 'shop'
    autoSave()
  }

  function buyJoker(index: number): boolean {
    const joker = shopJokers.value[index]
    if (!joker) return false
    if (jokers.value.length >= maxJokerSlots.value) return false
    const price = joker.sellPrice * 2
    if (!spendMoney(price)) return false
    jokers.value = [...jokers.value, joker]
    shopJokers.value = shopJokers.value.filter((_, i) => i !== index)
    return true
  }

  function rerollShop(): boolean {
    if (freeRerolls.value > 0) {
      freeRerolls.value -= 1
    } else {
      if (!spendMoney(rerollCost.value)) return false
      rerollCost.value += 1
    }
    shopJokers.value = [generateShopJoker(), generateShopJoker()]
    return true
  }

  function leaveShop() {
    shopJokers.value = []
    shopPacks.value = []
    openPack.value = null
    advanceBlind()
    autoSave()
  }

  // --- F20: Booster Pack Actions ---

  function buyPack(index: number): boolean {
    const pack = shopPacks.value[index]
    if (!pack) return false
    if (!spendMoney(pack.cost)) return false
    const cards = generatePackContents(pack)
    openPack.value = {
      pack,
      cards,
      selectedIds: [],
      selectionsRemaining: pack.selectCount,
    }
    shopPacks.value = shopPacks.value.filter((_, i) => i !== index)
    return true
  }

  function selectPackCard(cardId: string): boolean {
    if (!openPack.value || openPack.value.selectionsRemaining <= 0) return false
    const card = openPack.value.cards.find((c) => c.id === cardId)
    if (!card) return false
    if (openPack.value.selectedIds.includes(cardId)) return false

    // Try to add to consumable slots
    const added = addConsumable(card)
    if (!added) return false

    openPack.value = {
      ...openPack.value,
      selectedIds: [...openPack.value.selectedIds, cardId],
      selectionsRemaining: openPack.value.selectionsRemaining - 1,
    }

    // Auto-close pack when no selections remaining
    if (openPack.value.selectionsRemaining <= 0) {
      openPack.value = null
    }
    return true
  }

  function skipPack() {
    openPack.value = null
  }

  // --- F6: Joker Actions ---

  function addJoker(joker: Joker): boolean {
    if (jokers.value.length >= maxJokerSlots.value) return false
    jokers.value = [...jokers.value, joker]
    return true
  }

  function removeJoker(jokerId: string) {
    jokers.value = jokers.value.filter((j) => j.id !== jokerId)
  }

  function reorderJokers(fromIndex: number, toIndex: number) {
    if (fromIndex < 0 || fromIndex >= jokers.value.length) return
    if (toIndex < 0 || toIndex >= jokers.value.length) return
    const arr = [...jokers.value]
    const [moved] = arr.splice(fromIndex, 1)
    arr.splice(toIndex, 0, moved)
    jokers.value = arr
  }

  // --- F1: Deck Actions ---

  function drawCards(count: number) {
    if (count <= 0) return
    if (drawPile.value.length < count && discardPile.value.length > 0) {
      reshuffleDeck()
    }
    const toDraw = Math.min(count, drawPile.value.length)
    const { drawn, remaining } = draw(drawPile.value, toDraw)
    hand.value = [...hand.value, ...drawn]
    drawPile.value = remaining
  }

  function reshuffleDeck() {
    drawPile.value = shuffle([...drawPile.value, ...discardPile.value])
    discardPile.value = []
  }

  function discardFromHand(cardIds: string[]) {
    const toDiscard = hand.value.filter((c) => cardIds.includes(c.id))
    hand.value = hand.value.filter((c) => !cardIds.includes(c.id))
    discardPile.value = [...discardPile.value, ...toDiscard]
  }

  // --- F2: Play Actions ---

  function playHand(cardIds: string[]) {
    if (gamePhase.value !== 'playing') return
    if (handsRemaining.value <= 0) return
    if (cardIds.length < 1 || cardIds.length > 5) return

    // force_hand_size 체크
    const bossModifier = currentBlind.value === 'boss' ? (currentBoss.value?.modifier ?? null) : null
    if (bossModifier?.type === 'force_hand_size' && cardIds.length !== bossModifier.size) return

    const playedCards = hand.value.filter((c) => cardIds.includes(c.id))
    if (playedCards.length === 0) return

    const remainingHandCards = hand.value.filter((c) => !cardIds.includes(c.id))
    const result = evaluateHand(playedCards, handLevels.value)
    const breakdown = calculateScore(result, jokers.value, bossModifier, remainingHandCards)

    lastHandResult.value = { ...result, ...breakdown }
    roundScore.value += breakdown.finalScore
    handsRemaining.value -= 1

    // F21: 카드 수정자 부가 효과
    if (breakdown.moneyEarned > 0) {
      money.value += breakdown.moneyEarned
    }
    if (breakdown.destroyedCardIds.length > 0) {
      for (const id of breakdown.destroyedCardIds) {
        const idx = hand.value.findIndex((c) => c.id === id)
        if (idx !== -1) hand.value.splice(idx, 1)
      }
    }

    // F12: 최고 핸드 갱신
    if (breakdown.finalScore > runStats.value.bestHand) {
      runStats.value = {
        ...runStats.value,
        bestHand: breakdown.finalScore,
        bestHandName: result.name,
      }
    }

    discardFromHand(cardIds)

    const deficit = effectiveHandSize.value - hand.value.length
    if (deficit > 0) {
      drawCards(deficit)
    }

    // 블라인드 클리어 판정
    if (roundScore.value >= targetScore.value) {
      const reward = BLIND_REWARDS[currentBlind.value]
      const earnings = calculateRoundEarnings(reward, handsRemaining.value, money.value)
      roundReward.value = earnings.total
      lastEarnings.value = earnings
      money.value += earnings.total

      // F12: 블라인드 클리어 통계
      runStats.value = {
        ...runStats.value,
        blindsCleared: runStats.value.blindsCleared + 1,
        totalMoneyEarned: runStats.value.totalMoneyEarned + earnings.total,
      }

      // 앤티 8 보스 클리어 시 바로 승리
      if (currentAnte.value >= MAX_ANTE && currentBlind.value === 'boss') {
        gamePhase.value = 'won'
        clearSave()
      } else {
        gamePhase.value = 'round_end'
        autoSave()
      }
    } else if (handsRemaining.value <= 0) {
      gamePhase.value = 'lost'
      clearSave()
    }
  }

  function discardCards(cardIds: string[]) {
    if (gamePhase.value !== 'playing') return
    if (discardsRemaining.value <= 0) return
    if (cardIds.length < 1 || cardIds.length > 5) return

    const count = cardIds.length
    discardFromHand(cardIds)
    discardsRemaining.value -= 1
    drawCards(count)
  }

  // --- F13: Save/Load ---

  function getSerializableState(): Record<string, unknown> {
    return {
      drawPile: drawPile.value,
      hand: hand.value,
      discardPile: discardPile.value,
      currentAnte: currentAnte.value,
      currentBlind: currentBlind.value,
      gamePhase: gamePhase.value,
      currentBoss: currentBoss.value,
      usedBossIds: usedBossIds.value,
      handsRemaining: handsRemaining.value,
      discardsRemaining: discardsRemaining.value,
      roundScore: roundScore.value,
      targetScore: targetScore.value,
      roundReward: roundReward.value,
      jokers: jokers.value,
      consumables: consumables.value,
      consumableSlots: consumableSlots.value,
      handLevels: handLevels.value,
      handSizeModifier: handSizeModifier.value,
      money: money.value,
      freeRerolls: freeRerolls.value,
      runStats: runStats.value,
      shopJokers: shopJokers.value,
      rerollCost: rerollCost.value,
    }
  }

  function autoSave() {
    saveGame(getSerializableState())
  }

  function continueRun(): boolean {
    const state = loadGame()
    if (!state) return false

    try {
      drawPile.value = (state.drawPile as PlayingCard[]) ?? []
      hand.value = (state.hand as PlayingCard[]) ?? []
      discardPile.value = (state.discardPile as PlayingCard[]) ?? []
      currentAnte.value = (state.currentAnte as number) ?? 1
      currentBlind.value = (state.currentBlind as BlindType) ?? 'small'
      gamePhase.value = (state.gamePhase as GamePhase) ?? 'blind_select'
      currentBoss.value = (state.currentBoss as BossBlind | null) ?? null
      usedBossIds.value = (state.usedBossIds as string[]) ?? []
      handsRemaining.value = (state.handsRemaining as number) ?? DEFAULT_HANDS
      discardsRemaining.value = (state.discardsRemaining as number) ?? DEFAULT_DISCARDS
      roundScore.value = (state.roundScore as number) ?? 0
      targetScore.value = (state.targetScore as number) ?? 0
      roundReward.value = (state.roundReward as number) ?? 0
      jokers.value = (state.jokers as Joker[]) ?? []
      consumables.value = (state.consumables as ConsumableCard[]) ?? []
      consumableSlots.value = (state.consumableSlots as number) ?? 2
      handLevels.value = (state.handLevels as HandLevelMap) ?? createInitialHandLevels()
      handSizeModifier.value = (state.handSizeModifier as number) ?? 0
      money.value = (state.money as number) ?? 4
      freeRerolls.value = (state.freeRerolls as number) ?? 0
      runStats.value = (state.runStats as RunStats) ?? emptyStats()
      shopJokers.value = (state.shopJokers as Joker[]) ?? []
      rerollCost.value = (state.rerollCost as number) ?? BASE_REROLL_COST
      lastHandResult.value = null
      lastEarnings.value = null
      lastSkipTag.value = null
      return true
    } catch {
      clearSave()
      return false
    }
  }

  function checkForSave(): boolean {
    return loadGame() !== null
  }

  return {
    // State
    drawPile,
    hand,
    discardPile,
    currentAnte,
    currentBlind,
    handsRemaining,
    discardsRemaining,
    roundScore,
    targetScore,
    lastHandResult,
    gamePhase,
    jokers,
    consumables,
    consumableSlots,
    handLevels,
    handSizeModifier,
    roundReward,
    money,
    lastEarnings,
    shopJokers,
    shopPacks,
    openPack,
    rerollCost,
    currentBoss,
    lastSkipTag,
    freeRerolls,
    runStats,
    // Getters
    drawPileSize,
    handSize,
    discardPileSize,
    totalCards,
    activeBossModifier,
    maxJokerSlots,
    effectiveHandSize,
    // Actions
    initRun,
    startBlind,
    skipBlind,
    advanceBlind,
    addJoker,
    removeJoker,
    reorderJokers,
    sellJoker,
    addConsumable,
    removeConsumable,
    sellConsumable,
    useConsumable,
    spendMoney,
    openShop,
    buyJoker,
    rerollShop,
    leaveShop,
    buyPack,
    selectPackCard,
    skipPack,
    drawCards,
    reshuffleDeck,
    discardFromHand,
    playHand,
    discardCards,
    continueRun,
    checkForSave,
  }
})
