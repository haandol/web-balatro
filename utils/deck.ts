import type { PlayingCard } from '~/types/card'
import { SUITS, RANKS } from '~/data/cards'

/**
 * 표준 52장 덱을 생성한다.
 * 각 카드는 suit-rank 형식의 고유 id를 가진다.
 */
export function createDeck(): PlayingCard[] {
  const deck: PlayingCard[] = []
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        id: `${suit}-${rank}`,
        rank,
        suit,
      })
    }
  }
  return deck
}

/**
 * Fisher-Yates 알고리즘으로 배열을 셔플한다.
 * 원본 배열을 변경하지 않고 새 배열을 반환한다.
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * 덱에서 count만큼 카드를 드로우한다.
 * 덱 잔여량이 부족하면 가능한 만큼만 드로우한다.
 * 원본 배열을 변경하지 않고 { drawn, remaining } 을 반환한다.
 */
export function draw(deck: PlayingCard[], count: number): { drawn: PlayingCard[]; remaining: PlayingCard[] } {
  const actual = Math.min(count, deck.length)
  return {
    drawn: deck.slice(0, actual),
    remaining: deck.slice(actual),
  }
}
