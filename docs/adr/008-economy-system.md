# ADR-008: 경제 시스템 (F10)

- **Status**: Proposed
- **Date**: 2026-03-31
- **ALPS Feature**: F10 — 경제 시스템 (`specs/web-balatro.alps.md` Section 7.10)

## Context

블라인드 보상, 이자, 아이템 판매 등 다양한 수입원을 통해 자금을 관리하고, 상점(F9)에서 전략적 구매를 할 수 있어야 한다. 현재 `roundReward`가 표시만 되고 실제 자금 관리가 없다.

ALPS 요구사항:
- 수입원: 블라인드 보상($3/4/5), 남은 핸드 보너스(핸드당 $1), 이자($5당 $1, 최대 $5), 아이템 판매
- 지출: 상점 구매, 리롤
- 이자 계산: `Math.min(Math.floor(money / 5), 5)`
- 정산 순서: 기본 보상 → 남은 핸드 보너스 → 이자

## Decision

### 상태 추가 (stores/game.ts)

- `money: ref(4)` — 시작 자금 $4
- 블라인드 클리어 시 정산: 기본 보상 + 남은 핸드 × $1 + 이자
- `earnMoney(amount)`, `spendMoney(amount): boolean` 액션

### 이자 계산 (utils/economy.ts)

```typescript
function calculateInterest(money: number): number {
  return Math.min(Math.floor(money / 5), 5)
}

function calculateRoundEarnings(blindReward: number, handsRemaining: number, money: number) {
  return { blindReward, handBonus: handsRemaining, interest: calculateInterest(money) }
}
```

### 조커 판매

- `sellJoker(jokerId)`: 조커 제거 + 판매가 추가

### UI

- 헤더에 보유 자금 표시
- 라운드 종료 화면에 보상 내역 분해 표시

## 현재 구현 상태

| 항목 | 상태 |
|---|---|
| 블라인드 클리어 시 기본 보상이 정확히 지급된다 | ❌ 미구현 |
| 남은 핸드당 $1 보너스가 정확히 계산된다 | ❌ 미구현 |
| 이자가 $5당 $1, 최대 $5로 정확히 계산된다 | ❌ 미구현 |
| 아이템 구매 시 자금이 정확히 차감된다 | ❌ 미구현 |
| 아이템 판매 시 판매가가 정확히 추가된다 | ❌ 미구현 |
| 현재 보유 자금이 UI에 항상 표시된다 | ❌ 미구현 |

## Consequences

### 긍정적
- F9(상점) 구현의 전제 조건 충족
- 이자 시스템으로 자금 관리 전략 요소 추가

### 부정적
- Golden Joker 등 라운드 종료 시 경제 효과 조커는 후순위

## Alternatives Considered

- **F9와 동시 구현**: 범위가 커지므로 F10을 먼저 독립적으로 구현
