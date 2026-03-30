import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PlayingCard } from '~/types/card'
import type { HandResult, ScoreBreakdown } from '~/types/poker'
import type { Joker } from '~/types/joker'
import { createDeck, shuffle, draw } from '~/utils/deck'
import { evaluateHand, calculateScore } from '~/utils/poker'
import { type BlindType, BLIND_ORDER, MAX_ANTE, getTargetScore, BLIND_REWARDS } from '~/data/blinds'

export type GamePhase = 'blind_select' | 'playing' | 'round_end' | 'won' | 'lost'

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

  // --- F2: Round State ---
  const handsRemaining = ref(DEFAULT_HANDS)
  const discardsRemaining = ref(DEFAULT_DISCARDS)
  const roundScore = ref(0)
  const targetScore = ref(0)
  const lastHandResult = ref<(HandResult & ScoreBreakdown) | null>(null)
  const roundReward = ref(0)

  // --- F5/F6: Jokers ---
  const jokers = ref<Joker[]>([])

  // --- Getters ---
  const drawPileSize = computed(() => drawPile.value.length)
  const handSize = computed(() => hand.value.length)
  const discardPileSize = computed(() => discardPile.value.length)
  const totalCards = computed(() => drawPile.value.length + hand.value.length + discardPile.value.length)

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
    jokers.value = []

    // 덱 초기화
    const deck = shuffle(createDeck())
    drawPile.value = deck
    hand.value = []
    discardPile.value = []
  }

  /** 현재 블라인드를 시작한다. 덱 리셔플 + 핸드/디스카드 초기화 + 카드 드로우. */
  function startBlind() {
    // 목표 점수 계산
    targetScore.value = getTargetScore(currentAnte.value, currentBlind.value)
    roundScore.value = 0
    lastHandResult.value = null

    // 핸드/디스카드 초기화
    handsRemaining.value = DEFAULT_HANDS
    discardsRemaining.value = DEFAULT_DISCARDS

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

    if (blindIndex < BLIND_ORDER.length - 1) {
      // 같은 앤티 내 다음 블라인드
      currentBlind.value = BLIND_ORDER[blindIndex + 1]
      gamePhase.value = 'blind_select'
    } else if (currentAnte.value < MAX_ANTE) {
      // 다음 앤티로
      currentAnte.value += 1
      currentBlind.value = BLIND_ORDER[0]
      gamePhase.value = 'blind_select'
    } else {
      // 앤티 8 보스 클리어 — 승리
      gamePhase.value = 'won'
    }
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

    const playedCards = hand.value.filter((c) => cardIds.includes(c.id))
    if (playedCards.length === 0) return

    const result = evaluateHand(playedCards)
    const breakdown = calculateScore(result, jokers.value)

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
      roundReward.value = BLIND_REWARDS[currentBlind.value]
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
    // Getters
    drawPileSize,
    handSize,
    discardPileSize,
    totalCards,
    // Actions
    initRun,
    startBlind,
    advanceBlind,
    drawCards,
    reshuffleDeck,
    discardFromHand,
    playHand,
    discardCards,
  }
})
