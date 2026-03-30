import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PlayingCard } from '~/types/card'
import type { HandResult } from '~/types/poker'
import { createDeck, shuffle, draw } from '~/utils/deck'
import { evaluateHand, calculateHandScore } from '~/utils/poker'

export const useGameStore = defineStore('game', () => {
  const DEFAULT_HAND_SIZE = 8
  const DEFAULT_HANDS = 4
  const DEFAULT_DISCARDS = 3
  const DEFAULT_TARGET_SCORE = 300

  // --- F1: Deck State ---
  const drawPile = ref<PlayingCard[]>([])
  const hand = ref<PlayingCard[]>([])
  const discardPile = ref<PlayingCard[]>([])

  // --- F2: Round State ---
  const handsRemaining = ref(DEFAULT_HANDS)
  const discardsRemaining = ref(DEFAULT_DISCARDS)
  const roundScore = ref(0)
  const targetScore = ref(DEFAULT_TARGET_SCORE)
  const lastHandResult = ref<(HandResult & { score: number }) | null>(null)
  const gamePhase = ref<'playing' | 'won' | 'lost'>('playing')

  // --- Getters ---
  const drawPileSize = computed(() => drawPile.value.length)
  const handSize = computed(() => hand.value.length)
  const discardPileSize = computed(() => discardPile.value.length)
  const totalCards = computed(() => drawPile.value.length + hand.value.length + discardPile.value.length)

  // --- F1: Deck Actions ---

  function initDeck() {
    const deck = shuffle(createDeck())
    const { drawn, remaining } = draw(deck, DEFAULT_HAND_SIZE)
    drawPile.value = remaining
    hand.value = drawn
    discardPile.value = []
    handsRemaining.value = DEFAULT_HANDS
    discardsRemaining.value = DEFAULT_DISCARDS
    roundScore.value = 0
    targetScore.value = DEFAULT_TARGET_SCORE
    lastHandResult.value = null
    gamePhase.value = 'playing'
  }

  function drawCards(count: number) {
    if (count <= 0) return
    // draw pile이 부족하면 자동 리셔플
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

  /** 선택된 카드로 핸드를 플레이한다. */
  function playHand(cardIds: string[]) {
    if (gamePhase.value !== 'playing') return
    if (handsRemaining.value <= 0) return
    if (cardIds.length < 1 || cardIds.length > 5) return

    const playedCards = hand.value.filter((c) => cardIds.includes(c.id))
    if (playedCards.length === 0) return

    // 포커 핸드 판별 및 점수 계산
    const result = evaluateHand(playedCards)
    const score = calculateHandScore(result)

    // 상태 갱신
    lastHandResult.value = { ...result, score }
    roundScore.value += score
    handsRemaining.value -= 1

    // 플레이된 카드를 discard pile로 이동
    discardFromHand(cardIds)

    // 핸드 크기까지 카드 보충
    const deficit = DEFAULT_HAND_SIZE - hand.value.length
    if (deficit > 0) {
      drawCards(deficit)
    }

    // 승/패 판정
    if (roundScore.value >= targetScore.value) {
      gamePhase.value = 'won'
    } else if (handsRemaining.value <= 0) {
      gamePhase.value = 'lost'
    }
  }

  /** 선택된 카드를 버리고 같은 수만큼 새 카드를 드로우한다. */
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
    handsRemaining,
    discardsRemaining,
    roundScore,
    targetScore,
    lastHandResult,
    gamePhase,
    // Getters
    drawPileSize,
    handSize,
    discardPileSize,
    totalCards,
    // Actions
    initDeck,
    drawCards,
    reshuffleDeck,
    discardFromHand,
    playHand,
    discardCards,
  }
})
