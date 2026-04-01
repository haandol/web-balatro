# ADR-016: 플래닛 카드 (F17)

- **Status**: Accepted
- **Date**: 2026-04-01
- **ALPS Feature**: F17 — 플래닛 카드 (`specs/web-balatro-phase2.alps.md` Section 7.4)

## Context

Phase 1에서 포커 핸드의 기본 칩/승수는 고정값(Lv.1)이었다. 플래닛 카드를 도입하여 핸드 레벨을 영구적으로 업그레이드할 수 있게 하고, 플레이어가 선호 핸드를 강화하는 빌드 전략을 구사할 수 있도록 한다. F15(소모품 슬롯)에 의존하며, 점수 계산에 핸드 레벨을 반영해야 한다.

## Decision

### 핸드 레벨 시스템

- `types/poker.ts`에 `HandLevel`, `HandLevelMap` 타입 추가
- `HandLevel = { level, baseChips, baseMult }` — 레벨업 시 chips/mult가 설정값만큼 증가
- `data/planets.ts`에 10종 플래닛 카드 정적 데이터 + 초기 핸드 레벨 생성 함수

### 플래닛 카드 데이터 (`data/planets.ts`)

| 카드 | 대상 핸드 | Lv.1 칩/승수 | 레벨당 칩/승수 증가 |
|---|---|---|---|
| Pluto | HIGH_CARD | 5/1 | +10/+1 |
| Mercury | ONE_PAIR | 10/2 | +15/+1 |
| Uranus | TWO_PAIR | 20/2 | +20/+1 |
| Venus | THREE_OF_A_KIND | 30/3 | +20/+2 |
| Earth | STRAIGHT | 30/4 | +30/+3 |
| Jupiter | FLUSH | 35/4 | +15/+2 |
| Saturn | FULL_HOUSE | 40/4 | +25/+2 |
| Mars | FOUR_OF_A_KIND | 60/7 | +30/+3 |
| Neptune | STRAIGHT_FLUSH | 100/8 | +40/+4 |
| Planet X | ROYAL_FLUSH | 100/8 | +40/+4 |

### 유틸리티 (`utils/planet.ts`)

- `applyPlanetEffect(handType, handLevels)` → 새 HandLevelMap (level+1, chips/mult 증가)
- `createInitialHandLevels()` → 초기 Lv.1 HandLevelMap

### 스토어 (`stores/game.ts`)

- `handLevels: ref<HandLevelMap>(createInitialHandLevels())` — 런 상태
- `usePlanetCard(cardId)` — 소모품에서 플래닛 카드 찾기 → handLevels 업데이트 → 소모품 제거
- `initRun()`에서 handLevels 초기화
- 직렬화(getSerializableState/continueRun)에 handLevels 포함

### 점수 계산 연동

- `utils/poker.ts`의 `evaluateHand()`와 `calculateScore()`에 handLevels 파라미터 추가
- `makeResult()`에서 HAND_BASE 대신 handLevels의 baseChips/baseMult 사용
- 모든 호출처(stores/game.ts, pages/index.vue)에서 handLevels 전달

### 소모품 연동

- 플래닛 카드는 `ConsumableCard`로 소모품 슬롯에 보관
- `effect: { type: 'planet', targetHand: PokerHandType }` 형태
- 사용 시 대상 카드 선택 불필요 (즉시 사용)

## 현재 구현 상태

| 항목 | 상태 |
|---|---|
| 10종 플래닛 카드가 모두 정의되고 사용 가능하다 | ✅ 완료 (data/planets.ts + utils/planet.ts) |
| 플래닛 카드 사용 시 대상 핸드의 레벨이 1 증가한다 | ✅ 완료 (stores/game.ts useConsumable) |
| 레벨 증가에 따라 기본 칩/승수가 정확한 수치만큼 증가한다 | ✅ 완료 (applyPlanetEffect) |
| 핸드 레벨이 점수 계산에 정확히 반영된다 | ✅ 완료 (utils/poker.ts makeResult handLevels 파라미터) |
| 핸드 레벨이 런 상태 저장(F13)에 포함된다 | ✅ 완료 (getSerializableState/continueRun) |
| 대상 카드 선택 없이 즉시 사용된다 | ✅ 완료 (useConsumable에서 즉시 적용) |
| 사용 후 소모품 슬롯에서 제거된다 | ✅ 완료 (removeConsumable 호출) |

## Consequences

**긍정적:**
- 포커 핸드 레벨이 동적으로 바뀌면서 빌드 전략의 깊이가 크게 증가
- 순수 함수 기반으로 테스트 용이
- Phase 1 호환: handLevels 없으면 Lv.1 기본값 사용

**부정적:**
- evaluateHand/calculateScore 시그니처 변경으로 모든 호출처 수정 필요
- 핸드 레벨 상한이 없어 이론적으로 무한 스케일링 가능 (원작 동일)

## Alternatives Considered

1. **핸드 레벨을 전역 상수 배열로 관리** — 기각: 런마다 독립적인 레벨이 필요하므로 스토어 상태가 적합
2. **점수 계산 함수를 수정하지 않고 후처리로 레벨 보정** — 기각: baseChips/baseMult가 정확히 반영되려면 계산 입력 단계에서 적용해야 함
