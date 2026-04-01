# ADR-019: 점수 계산 엔진 확장 (F21)

- **Status**: Accepted
- **Date**: 2026-04-01
- **ALPS Feature**: F21 — 점수 계산 엔진 확장 (`specs/web-balatro-phase2.alps.md` Section 7.8)

## Context

Phase 1의 점수 계산은 baseChips/baseMult + 카드 랭크칩 + 조커 효과만 적용했다. F14(카드 수정자), F17(핸드 레벨)이 구현되었으므로 Enhancement/Edition/Seal 효과와 핸드 레벨을 점수 계산에 반영해야 한다.

## Decision

### 6단계 점수 계산 파이프라인 (`utils/poker.ts`)

1. **핸드 타입 판별** — Wild Card는 모든 수트, Stone Card는 평가에서 제외
2. **기본 Chips/Mult** — `handLevels`에서 동적으로 (이미 구현됨)
3. **스코어링 카드 처리** (왼→오, 각 카드):
   - a) 랭크 칩 (Stone Card 제외)
   - b) Enhancement: Bonus(+30칩), Mult(+4), Glass(x2, 파괴확률), Lucky(1/5 +20mult, 1/15 +$20), Stone(+50칩)
   - c) Edition: Foil(+50칩), Holographic(+10mult), Polychrome(x1.5mult)
   - d) Seal: Gold($3 money), Red(리트리거 1회)
4. **핸드 내 카드** — Steel Card: x1.5 mult (Red Seal시 2회)
5. **조커 효과** — 조커 기본 효과 + 조커 에디션 효과
6. **최종 = floor(totalChips × totalMult)**

### ScoreBreakdown 타입 확장

- `moneyEarned`: Gold Seal/Lucky Card 수익
- `destroyedCardIds`: Glass Card 파괴 결과

### evaluateHand 확장

- Wild Card: `isFlush`/`rankCounts` 시 모든 수트로 간주
- Stone Card: 핸드 평가에서 제외 (단, Stone 카드도 항상 scoring card에 포함)

### calculateScore 확장

기존 함수를 확장하여 `allHandCards` 파라미터 추가 (Steel Card in-hand 계산용).

## 현재 구현 상태

| 항목 | 상태 |
|---|---|
| Wild Card 수트 처리 | ✅ 구현 완료 |
| Stone Card 핸드 평가 제외 | ✅ 구현 완료 |
| Enhancement 점수 효과 (Bonus/Mult/Glass/Lucky/Stone) | ✅ 구현 완료 |
| Edition 점수 효과 (Foil/Holographic/Polychrome) | ✅ 구현 완료 |
| Seal 효과 (Gold/$, Red/retrigger) | ✅ 구현 완료 |
| Steel Card in-hand mult | ✅ 구현 완료 |
| Joker edition 효과 | ✅ 구현 완료 |
| Glass Card 파괴 처리 | ✅ 구현 완료 |

## Consequences

**긍정적:**
- 카드 수정자(F14)가 실질적으로 게임에 영향을 미침
- 핸드 레벨(F17)과의 통합으로 덱 빌딩 전략이 점수에 반영

**부정적:**
- 점수 계산 로직이 복잡해져 디버깅 난이도 증가
- Glass Card 파괴/Lucky Card 확률은 게임에 불확실성 추가

## Alternatives Considered

1. **별도 calculateScoreV2 함수** — 기각: 기존 함수를 확장하는 것이 호출부 변경이 적음
2. **Enhancement 효과를 스토어에서 처리** — 기각: 순수 함수로 유지하여 테스트 용이성 확보
