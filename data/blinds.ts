export type BlindType = 'small' | 'big' | 'boss'

export const BLIND_ORDER: BlindType[] = ['small', 'big', 'boss']

export const BLIND_LABELS: Record<BlindType, string> = {
  small: 'Small Blind',
  big: 'Big Blind',
  boss: 'Boss Blind',
}

export const BLIND_MULTIPLIERS: Record<BlindType, number> = {
  small: 1,
  big: 1.5,
  boss: 2,
}

/** 앤티별 기본 점수 (앤티 1~8) */
export const ANTE_BASE_SCORES = [300, 800, 2000, 5000, 11000, 20000, 35000, 50000]

/** 앤티별 블라인드 클리어 보상 (간략화) */
export const BLIND_REWARDS: Record<BlindType, number> = {
  small: 3,
  big: 4,
  boss: 5,
}

export const MAX_ANTE = 8

/** 앤티와 블라인드 타입으로 목표 점수를 계산한다. */
export function getTargetScore(ante: number, blind: BlindType): number {
  const base = ANTE_BASE_SCORES[ante - 1] ?? ANTE_BASE_SCORES[ANTE_BASE_SCORES.length - 1]
  return Math.round(base * BLIND_MULTIPLIERS[blind])
}
