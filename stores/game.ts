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

export type GamePhase = 'blind_select' | 'playing' | 'round_end' | 'shop' | 'won' | 'lost'

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
  const gamePhase = ref<GamePhase>('blind_select')

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
    shopJokers.value = []
    rerollCost.value = BASE_REROLL_COST

    // 덱 초기화
    const deck = shuffle(createDeck())
    drawPile.value = deck
    hand.value = []
    discardPile.value = []
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
    if (!spendMoney(rerollCost.value)) return false
    shopJokers.value = [generateShopJoker(), generateShopJoker()]
    rerollCost.value += 1
    return true
  }

  function leaveShop() {
    shopJokers.value = []
    advanceBlind()
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

      // 앤티 8 보스 클리어 시 바로 승리
      if (currentAnte.value >= MAX_ANTE && currentBlind.value === 'boss') {
        gamePhase.value = 'won'
      } else {
        gamePhase.value = 'round_end'
      }
    } else if (handsRemaining.value <= 0) {
      gamePhase.value = 'lost'
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
    // Getters
    drawPileSize,
    handSize,
    discardPileSize,
    totalCards,
    activeBossModifier,
    // Actions
    initRun,
    startBlind,
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
  }
})
