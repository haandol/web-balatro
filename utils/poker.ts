import type { PlayingCard, Rank } from '~/types/card'
import type { PokerHandType, HandResult } from '~/types/poker'
import { RANK_CHIPS } from '~/data/cards'

const HAND_BASE: Record<PokerHandType, { name: string; chips: number; mult: number }> = {
  HIGH_CARD: { name: 'High Card', chips: 5, mult: 1 },
  ONE_PAIR: { name: 'One Pair', chips: 10, mult: 2 },
  TWO_PAIR: { name: 'Two Pair', chips: 20, mult: 2 },
  THREE_OF_A_KIND: { name: 'Three of a Kind', chips: 30, mult: 3 },
  STRAIGHT: { name: 'Straight', chips: 30, mult: 4 },
  FLUSH: { name: 'Flush', chips: 35, mult: 4 },
  FULL_HOUSE: { name: 'Full House', chips: 40, mult: 4 },
  FOUR_OF_A_KIND: { name: 'Four of a Kind', chips: 60, mult: 7 },
  STRAIGHT_FLUSH: { name: 'Straight Flush', chips: 100, mult: 8 },
  ROYAL_FLUSH: { name: 'Royal Flush', chips: 100, mult: 8 },
}

const RANK_ORDER: Record<Rank, number> = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
}

function rankCounts(cards: PlayingCard[]): Map<Rank, PlayingCard[]> {
  const map = new Map<Rank, PlayingCard[]>()
  for (const card of cards) {
    const group = map.get(card.rank) ?? []
    group.push(card)
    map.set(card.rank, group)
  }
  return map
}

function isFlush(cards: PlayingCard[]): boolean {
  if (cards.length < 5) return false
  return cards.every((c) => c.suit === cards[0].suit)
}

function getStraightCards(cards: PlayingCard[]): PlayingCard[] | null {
  if (cards.length < 5) return null

  const sorted = [...cards].sort((a, b) => RANK_ORDER[b.rank] - RANK_ORDER[a.rank])

  // A-high straight check (일반 연속)
  let consecutive = true
  for (let i = 0; i < sorted.length - 1; i++) {
    if (RANK_ORDER[sorted[i].rank] - RANK_ORDER[sorted[i + 1].rank] !== 1) {
      consecutive = false
      break
    }
  }
  if (consecutive) return sorted

  // A-low straight check (A-2-3-4-5)
  const hasAce = sorted.some((c) => c.rank === 'A')
  if (!hasAce) return null

  const lowSorted = [...cards].sort((a, b) => {
    const aVal = a.rank === 'A' ? 1 : RANK_ORDER[a.rank]
    const bVal = b.rank === 'A' ? 1 : RANK_ORDER[b.rank]
    return bVal - aVal
  })

  let lowConsecutive = true
  for (let i = 0; i < lowSorted.length - 1; i++) {
    const currVal = lowSorted[i].rank === 'A' ? 1 : RANK_ORDER[lowSorted[i].rank]
    const nextVal = lowSorted[i + 1].rank === 'A' ? 1 : RANK_ORDER[lowSorted[i + 1].rank]
    if (currVal - nextVal !== 1) {
      lowConsecutive = false
      break
    }
  }
  if (lowConsecutive) return lowSorted

  return null
}

/** 플레이된 카드에서 가장 높은 랭크의 포커 핸드를 판별한다. */
export function evaluateHand(cards: PlayingCard[]): HandResult {
  if (cards.length === 0) {
    return { type: 'HIGH_CARD', name: 'High Card', baseChips: 5, baseMult: 1, scoringCards: [] }
  }

  const counts = rankCounts(cards)
  const flush = isFlush(cards)
  const straightCards = getStraightCards(cards)
  const isStraight = straightCards !== null

  // 그룹 크기별 분류
  const groups = [...counts.entries()].sort(
    (a, b) => b[1].length - a[1].length || RANK_ORDER[b[0]] - RANK_ORDER[a[0]]
  )

  const groupSizes = groups.map(([, g]) => g.length)

  // Royal Flush: A-K-Q-J-10 + flush
  if (flush && isStraight) {
    const ranks = cards.map((c) => c.rank)
    const isRoyal = ['A', 'K', 'Q', 'J', '10'].every((r) => ranks.includes(r as Rank))
    if (isRoyal) {
      return makeResult('ROYAL_FLUSH', cards)
    }
    return makeResult('STRAIGHT_FLUSH', cards)
  }

  // Four of a Kind
  if (groupSizes[0] === 4) {
    return makeResult('FOUR_OF_A_KIND', groups[0][1])
  }

  // Full House: 3 + 2
  if (groupSizes[0] === 3 && groupSizes[1] === 2) {
    return makeResult('FULL_HOUSE', [...groups[0][1], ...groups[1][1]])
  }

  // Flush
  if (flush) {
    return makeResult('FLUSH', cards)
  }

  // Straight
  if (isStraight) {
    return makeResult('STRAIGHT', straightCards)
  }

  // Three of a Kind
  if (groupSizes[0] === 3) {
    return makeResult('THREE_OF_A_KIND', groups[0][1])
  }

  // Two Pair
  if (groupSizes[0] === 2 && groupSizes[1] === 2) {
    return makeResult('TWO_PAIR', [...groups[0][1], ...groups[1][1]])
  }

  // One Pair
  if (groupSizes[0] === 2) {
    return makeResult('ONE_PAIR', groups[0][1])
  }

  // High Card: 가장 높은 카드 1장만 scoring
  const highestCard = [...cards].sort((a, b) => RANK_ORDER[b.rank] - RANK_ORDER[a.rank])[0]
  return makeResult('HIGH_CARD', [highestCard])
}

function makeResult(type: PokerHandType, scoringCards: PlayingCard[]): HandResult {
  const base = HAND_BASE[type]
  return {
    type,
    name: base.name,
    baseChips: base.chips,
    baseMult: base.mult,
    scoringCards,
  }
}

/** 기본 점수 계산: (baseChips + scoring cards chips) × baseMult */
export function calculateHandScore(result: HandResult): number {
  const cardChips = result.scoringCards.reduce((sum, card) => sum + RANK_CHIPS[card.rank], 0)
  const totalChips = result.baseChips + cardChips
  return Math.round(totalChips * result.baseMult)
}
