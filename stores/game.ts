import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PlayingCard } from '~/types/card'
import type { HandResult, ScoreBreakdown } from '~/types/poker'
import type { Joker } from '~/types/joker'
import { createDeck, shuffle, draw } from '~/utils/deck'
import { evaluateHand, calculateScore } from '~/utils/poker'
import { type BlindType, BLIND_ORDER, MAX_ANTE, getTargetScore, BLIND_REWARDS } from '~/data/blinds'
import { JOKER_DEFINITIONS, MAX_JOKER_SLOTS } from '~/data/jokers'
import type { JokerRarity } from '~/types/joker'
import { calculateRoundEarnings, type RoundEarnings } from '~/utils/economy'
import { BOSS_BLINDS, type BossBlind } from '~/data/bossBlinds'
import { TAGS, type Tag } from '~/data/tags'
import { saveGame, loadGame, clearSave } from '~/utils/saveGame'

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

  // --- F9: Shop ---
  const shopJokers = ref<Joker[]>([])
  const rerollCost = ref(5)
  const BASE_REROLL_COST = 5

  // --- Getters ---
  const drawPileSize = computed(() => drawPile.value.length)
  const handSize = computed(() => hand.value.length)
  const discardPileSize = computed(() => discardPile.value.length)
  const totalCards = computed(() => drawPile.value.length + hand.value.length + discardPile.value.length)
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
    shopJokers.value = []
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
    const { drawn, remaining } = draw(drawPile.value, DEFAULT_HAND_SIZE)
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
    if (!joker) return
    money.value += joker.sellPrice
    removeJoker(jokerId)
  }

  // --- F9: Shop Actions ---

  function pickRarity(): JokerRarity {
    const roll = Math.random()
    if (roll < 0.05) return 'rare'
    if (roll < 0.3) return 'uncommon'
    return 'common'
  }

  function generateShopJoker(): Joker {
    const rarity = pickRarity()
    const pool = JOKER_DEFINITIONS.filter((d) => d.rarity === rarity)
    const def = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : JOKER_DEFINITIONS[0]
    return { ...def, id: `joker-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }
  }

  function generateShop() {
    shopJokers.value = [generateShopJoker(), generateShopJoker()]
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
    if (jokers.value.length >= MAX_JOKER_SLOTS) return false
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
    advanceBlind()
    autoSave()
  }

  // --- F6: Joker Actions ---

  function addJoker(joker: Joker): boolean {
    if (jokers.value.length >= MAX_JOKER_SLOTS) return false
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

    const result = evaluateHand(playedCards)
    const breakdown = calculateScore(result, jokers.value, bossModifier)

    lastHandResult.value = { ...result, ...breakdown }
    roundScore.value += breakdown.finalScore
    handsRemaining.value -= 1

    // F12: 최고 핸드 갱신
    if (breakdown.finalScore > runStats.value.bestHand) {
      runStats.value = {
        ...runStats.value,
        bestHand: breakdown.finalScore,
        bestHandName: result.name,
      }
    }

    discardFromHand(cardIds)

    const deficit = DEFAULT_HAND_SIZE - hand.value.length
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
    roundReward,
    money,
    lastEarnings,
    shopJokers,
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
    // Actions
    initRun,
    startBlind,
    skipBlind,
    advanceBlind,
    addJoker,
    removeJoker,
    reorderJokers,
    sellJoker,
    spendMoney,
    openShop,
    buyJoker,
    rerollShop,
    leaveShop,
    drawCards,
    reshuffleDeck,
    discardFromHand,
    playHand,
    discardCards,
    continueRun,
    checkForSave,
  }
})
