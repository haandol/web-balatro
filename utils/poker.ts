import type { PlayingCard, Rank, Suit } from '~/types/card'
import type { PokerHandType, HandResult, ScoreBreakdown, HandLevelMap } from '~/types/poker'
import type { Joker, JokerTrigger } from '~/types/joker'
import type { BossModifier } from '~/data/bossBlinds'
import { RANK_CHIPS, SUITS } from '~/data/cards'
import { ENHANCEMENTS, EDITIONS, SEALS } from '~/data/cardModifiers'
import { isDebuffed } from '~/utils/boss'

const FACE_RANKS: Set<Rank> = new Set(['J', 'Q', 'K'])

/** 핸드 타입 포함 관계: Full House는 ONE_PAIR + THREE_OF_A_KIND를 "포함" */
const HAND_CONTAINS: Record<PokerHandType, PokerHandType[]> = {
  HIGH_CARD: ['HIGH_CARD'],
  ONE_PAIR: ['ONE_PAIR'],
  TWO_PAIR: ['TWO_PAIR', 'ONE_PAIR'],
  THREE_OF_A_KIND: ['THREE_OF_A_KIND'],
  STRAIGHT: ['STRAIGHT'],
  FLUSH: ['FLUSH'],
  FULL_HOUSE: ['FULL_HOUSE', 'ONE_PAIR', 'THREE_OF_A_KIND'],
  FOUR_OF_A_KIND: ['FOUR_OF_A_KIND', 'ONE_PAIR'],
  STRAIGHT_FLUSH: ['STRAIGHT_FLUSH', 'STRAIGHT', 'FLUSH'],
  ROYAL_FLUSH: ['ROYAL_FLUSH', 'STRAIGHT_FLUSH', 'STRAIGHT', 'FLUSH'],
}

function evaluateTrigger(trigger: JokerTrigger, scoringCards: PlayingCard[], handType: PokerHandType): number {
  switch (trigger.type) {
    case 'always':
      return 1
    case 'if_hand':
      return HAND_CONTAINS[handType].includes(trigger.handType) ? 1 : 0
    case 'per_suit':
      return scoringCards.filter((c) => getEffectiveSuits(c).includes(trigger.suit)).length
    case 'per_face_card':
      return scoringCards.filter((c) => FACE_RANKS.has(c.rank)).length
    case 'if_hand_size_lte':
      return scoringCards.length <= trigger.size ? 1 : 0
  }
}

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

/** Wild Card는 모든 수트를 가진 것으로 간주 */
function getEffectiveSuits(card: PlayingCard): Suit[] {
  if (card.enhancement === 'wild') return [...SUITS]
  return [card.suit]
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

/** Flush 판별 — Wild Card는 모든 수트로 간주 */
function isFlush(cards: PlayingCard[]): boolean {
  if (cards.length < 5) return false
  // 어떤 수트든 모든 카드가 해당 수트를 가지고 있으면 Flush
  return SUITS.some((suit) => cards.every((c) => getEffectiveSuits(c).includes(suit)))
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

/** 플레이된 카드에서 가장 높은 랭크의 포커 핸드를 판별한다. Stone Card는 핸드 평가에서 제외. */
export function evaluateHand(cards: PlayingCard[], handLevels?: HandLevelMap): HandResult {
  if (cards.length === 0) {
    return makeResult('HIGH_CARD', [], cards, handLevels)
  }

  // Stone Card는 핸드 평가에서 제외 (rank/suit 없음)
  const evalCards = cards.filter((c) => c.enhancement !== 'stone')

  if (evalCards.length === 0) {
    // 모든 카드가 Stone인 경우 — High Card, 하지만 Stone 카드들은 항상 scoring
    return makeResult('HIGH_CARD', [], cards, handLevels)
  }

  const counts = rankCounts(evalCards)
  const flush = isFlush(evalCards)
  const straightCards = getStraightCards(evalCards)
  const isStraight = straightCards !== null

  const groups = [...counts.entries()].sort((a, b) => b[1].length - a[1].length || RANK_ORDER[b[0]] - RANK_ORDER[a[0]])

  const groupSizes = groups.map(([, g]) => g.length)

  // Royal Flush: A-K-Q-J-10 + flush
  if (flush && isStraight) {
    const ranks = evalCards.map((c) => c.rank)
    const isRoyal = ['A', 'K', 'Q', 'J', '10'].every((r) => ranks.includes(r as Rank))
    if (isRoyal) {
      return makeResult('ROYAL_FLUSH', evalCards, cards, handLevels)
    }
    return makeResult('STRAIGHT_FLUSH', evalCards, cards, handLevels)
  }

  // Four of a Kind
  if (groupSizes[0] === 4) {
    return makeResult('FOUR_OF_A_KIND', groups[0][1], cards, handLevels)
  }

  // Full House: 3 + 2
  if (groupSizes[0] === 3 && groupSizes[1] === 2) {
    return makeResult('FULL_HOUSE', [...groups[0][1], ...groups[1][1]], cards, handLevels)
  }

  // Flush
  if (flush) {
    return makeResult('FLUSH', evalCards, cards, handLevels)
  }

  // Straight
  if (isStraight) {
    return makeResult('STRAIGHT', straightCards, cards, handLevels)
  }

  // Three of a Kind
  if (groupSizes[0] === 3) {
    return makeResult('THREE_OF_A_KIND', groups[0][1], cards, handLevels)
  }

  // Two Pair
  if (groupSizes[0] === 2 && groupSizes[1] === 2) {
    return makeResult('TWO_PAIR', [...groups[0][1], ...groups[1][1]], cards, handLevels)
  }

  // One Pair
  if (groupSizes[0] === 2) {
    return makeResult('ONE_PAIR', groups[0][1], cards, handLevels)
  }

  // High Card: 가장 높은 카드 1장만 scoring
  const highestCard = [...evalCards].sort((a, b) => RANK_ORDER[b.rank] - RANK_ORDER[a.rank])[0]
  return makeResult('HIGH_CARD', [highestCard], cards, handLevels)
}

function makeResult(
  type: PokerHandType,
  scoringCards: PlayingCard[],
  allPlayedCards: PlayingCard[],
  handLevels?: HandLevelMap
): HandResult {
  const base = HAND_BASE[type]
  const level = handLevels?.[type]

  // Stone 카드는 항상 scoring card에 포함 (독립적으로 +50 chips 제공)
  const stoneCards = allPlayedCards.filter((c) => c.enhancement === 'stone' && !scoringCards.includes(c))
  const finalScoringCards = [...scoringCards, ...stoneCards]

  return {
    type,
    name: base.name,
    baseChips: level?.baseChips ?? base.chips,
    baseMult: level?.baseMult ?? base.mult,
    scoringCards: finalScoringCards,
  }
}

/** 기본 점수 계산: (baseChips + scoring cards chips) × baseMult (조커 미적용) */
export function calculateHandScore(result: HandResult): number {
  const cardChips = result.scoringCards.reduce((sum, card) => {
    if (card.enhancement === 'stone') return sum + 50
    return sum + RANK_CHIPS[card.rank]
  }, 0)
  const totalChips = result.baseChips + cardChips
  return Math.round(totalChips * result.baseMult)
}

/**
 * 조커 + 카드 수정자 포함 점수 계산 (F21 확장).
 *
 * 6단계 파이프라인:
 * 1. 핸드 타입 판별 (evaluateHand에서 처리)
 * 2. 기본 Chips/Mult (handLevels 반영, evaluateHand에서 처리)
 * 3. 스코어링 카드 처리 (Enhancement/Edition/Seal, 왼→오)
 * 4. 핸드 내 카드 처리 (Steel Card in-hand)
 * 5. 조커 효과 (기본 + 에디션)
 * 6. 최종 = floor(totalChips × totalMult)
 *
 * @param allHandCards 현재 핸드에 남아있는 전체 카드 (Steel Card in-hand 계산용)
 */
export function calculateScore(
  result: HandResult,
  jokers: Joker[] = [],
  bossModifier: BossModifier | null = null,
  allHandCards: PlayingCard[] = []
): ScoreBreakdown {
  const activeCards = result.scoringCards.filter((c) => !isDebuffed(c, bossModifier))
  let totalChips = result.baseChips
  let totalMult = result.baseMult
  let moneyEarned = 0
  const destroyedCardIds: string[] = []

  // --- Step 3: 스코어링 카드 처리 (왼→오) ---
  for (const card of activeCards) {
    const retriggers = card.seal === 'red' ? 2 : 1

    for (let t = 0; t < retriggers; t++) {
      // a) 랭크 칩 (Stone Card는 랭크 칩 대신 +50)
      if (card.enhancement === 'stone') {
        totalChips += 50
      } else {
        totalChips += RANK_CHIPS[card.rank]
      }

      // b) Enhancement 효과
      if (card.enhancement && card.enhancement !== 'wild' && card.enhancement !== 'stone') {
        const enhDef = ENHANCEMENTS[card.enhancement]
        const eff = enhDef.effect
        if (eff.trigger === 'on_score') {
          switch (eff.type) {
            case 'add_chips':
              totalChips += eff.value
              break
            case 'add_mult':
              totalMult += eff.value
              break
            case 'x_mult':
              totalMult *= eff.value
              break
            case 'lucky':
              if (Math.random() < eff.multChance) {
                totalMult += eff.multValue
              }
              if (Math.random() < eff.moneyChance) {
                moneyEarned += eff.moneyValue
              }
              break
          }
        }
      }

      // c) Edition 효과
      if (card.edition && card.edition !== 'base') {
        const edDef = EDITIONS[card.edition]
        const eff = edDef.effect
        switch (eff.type) {
          case 'add_chips':
            totalChips += eff.value
            break
          case 'add_mult':
            totalMult += eff.value
            break
          case 'x_mult':
            totalMult *= eff.value
            break
        }
      }

      // d) Seal 효과 (Gold Seal = money)
      if (card.seal === 'gold') {
        const sealDef = SEALS.gold
        if (sealDef.effect.type === 'earn_money') {
          moneyEarned += sealDef.effect.value
        }
      }
    }

    // Glass Card 파괴 판정 (retrigger와 별개, 1회만 판정)
    if (card.enhancement === 'glass') {
      const glassEff = ENHANCEMENTS.glass.effect
      if (glassEff.type === 'x_mult' && glassEff.destroyChance && Math.random() < glassEff.destroyChance) {
        destroyedCardIds.push(card.id)
      }
    }
  }

  // --- Step 4: 핸드 내 카드 (Steel Card in-hand) ---
  const inHandCards = allHandCards.filter(
    (c) => !result.scoringCards.some((sc) => sc.id === c.id) && !isDebuffed(c, bossModifier)
  )
  for (const card of inHandCards) {
    if (card.enhancement === 'steel') {
      const retriggers = card.seal === 'red' ? 2 : 1
      for (let t = 0; t < retriggers; t++) {
        totalMult *= 1.5
      }
    }
  }

  // --- Step 5: 조커 효과 (기본 + 에디션) ---
  for (const joker of jokers) {
    const times = evaluateTrigger(joker.effect.trigger, activeCards, result.type)
    if (times > 0) {
      const effectValue = joker.effect.value * times
      switch (joker.effect.type) {
        case 'add_chips':
          totalChips += effectValue
          break
        case 'add_mult':
          totalMult += effectValue
          break
        case 'x_mult':
          for (let i = 0; i < times; i++) {
            totalMult *= joker.effect.value
          }
          break
      }
    }

    // 조커 에디션 효과
    if (joker.edition && joker.edition !== 'base') {
      const edDef = EDITIONS[joker.edition]
      const eff = edDef.effect
      switch (eff.type) {
        case 'add_chips':
          totalChips += eff.value
          break
        case 'add_mult':
          totalMult += eff.value
          break
        case 'x_mult':
          totalMult *= eff.value
          break
      }
    }
  }

  return {
    totalChips,
    totalMult,
    finalScore: Math.floor(totalChips * totalMult),
    moneyEarned,
    destroyedCardIds,
  }
}
