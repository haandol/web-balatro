/** 이자 계산: 보유 $5당 $1, 최대 interestCap (기본 $5) */
export function calculateInterest(money: number, interestCap: number = 5): number {
  return Math.min(Math.floor(money / 5), interestCap)
}

export interface RoundEarnings {
  blindReward: number
  handBonus: number
  interest: number
  total: number
}

/** 라운드 종료 시 총 수입 계산 */
export function calculateRoundEarnings(
  blindReward: number,
  handsRemaining: number,
  money: number,
  interestCap: number = 5
): RoundEarnings {
  const handBonus = handsRemaining
  const interest = calculateInterest(money, interestCap)
  return {
    blindReward,
    handBonus,
    interest,
    total: blindReward + handBonus + interest,
  }
}
