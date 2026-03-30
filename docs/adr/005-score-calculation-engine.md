# ADR-005: 점수 계산 엔진 (F5)

- **Status**: Proposed
- **Date**: 2026-03-31
- **ALPS Feature**: F5 — 점수 계산 엔진 (`specs/web-balatro.alps.md` Section 7.5)

## Context

포커 핸드의 기본 점수에 조커 보너스가 순차적으로 적용되어 최종 점수가 계산되는 엔진이 필요하다. 현재 `calculateHandScore()`는 기본 칩×승수만 계산하며 조커 효과가 반영되지 않는다.

ALPS 요구사항:
1. 핸드 유형의 기본 칩/승수 결정
2. 점수에 기여하는 카드의 랭크 칩 합산
3. 조커 효과 왼쪽→오른쪽 순차 적용: +Chips → +Mult → xMult
4. 최종 점수 = 총 칩 × 총 승수 (소수점 반올림)

## Decision

### 점수 계산 함수 리팩토링 (utils/poker.ts)

기존 `calculateHandScore()`를 확장하여 조커를 받을 수 있도록 변경:

- **`calculateScore(result: HandResult, jokers?: Joker[]): ScoreBreakdown`**
  - 1단계: `totalChips = baseChips + sum(scoringCards rankChips)`
  - 2단계: `totalMult = baseMult`
  - 3단계: 조커 순차 적용 (왼→오):
    - `add_chips` → `totalChips += value`
    - `add_mult` → `totalMult += value`
    - `x_mult` → `totalMult *= value`
  - 4단계: `finalScore = Math.round(totalChips * totalMult)`
- **기존 `calculateHandScore()`는 유지** — 조커 없는 단순 계산용 (프리뷰 등)

### ScoreBreakdown 타입 (types/poker.ts)

```typescript
interface ScoreBreakdown {
  totalChips: number
  totalMult: number
  finalScore: number
}
```

### Joker 인터페이스 (types/joker.ts)

F6에서 본격 구현하지만, 점수 계산에 필요한 최소 인터페이스를 정의:

```typescript
type JokerEffectType = 'add_chips' | 'add_mult' | 'x_mult'

interface JokerEffect {
  type: JokerEffectType
  value: number
}

interface Joker {
  id: string
  name: string
  effect: JokerEffect
}
```

### UI 변경 (pages/index.vue)

- 프리뷰/결과에 chips × mult 분해 표시는 이미 구현됨
- 조커 보유 시 조커 효과 반영된 점수 표시 (F6 구현 후)

## 현재 구현 상태

| 항목 | 상태 |
|---|---|
| 기본 칩 + 카드 랭크 칩 정확히 합산 | ✅ 완료 |
| 조커 보너스 왼→오 순서 적용 | ❌ 미구현 |
| +Chips 합산, +Mult 합산, xMult 곱셈 처리 | ❌ 미구현 |
| 최종 점수 = 총 칩 × 총 승수 정확히 계산 | ✅ 완료 (조커 제외) |
| 점수 계산 과정 애니메이션 시각화 | ❌ 미구현 |
| 조커 순서 변경 시 점수 차이 | ❌ 미구현 (F6 의존) |

## Consequences

### 긍정적
- 조커 인터페이스가 정의되어 F6 구현 시 즉시 연동 가능
- ScoreBreakdown으로 chips/mult 분해 표시가 용이
- 기존 calculateHandScore 유지로 하위 호환성 확보

### 부정적
- 조건부 조커 (특정 슈트/랭크에만 적용) 미지원 — F6에서 effect 시스템 확장 필요

## Alternatives Considered

- **조커 시스템(F6) 완성 후 일괄 구현**: F5만 먼저 인터페이스를 정의하면 F6 구현이 수월해지므로 선행 구현
