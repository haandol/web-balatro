# ADR-017: 스펙트럴 카드 (F18)

- **Status**: Accepted
- **Date**: 2026-04-01
- **ALPS Feature**: F18 — 스펙트럴 카드 (`specs/web-balatro-phase2.alps.md` Section 7.5)

## Context

고위험-고보상 소모품 카드 시스템. 15종의 스펙트럴 카드는 강력한 효과(희귀 조커 생성, 에디션 부여, 대량 덱 수정)를 제공하되, 대부분 돌이킬 수 없는 대가(자금 소실, 카드 파괴, 핸드 크기 감소)를 수반한다. F14(카드 수정자)와 F15(소모품 슬롯)에 의존한다.

## Decision

### 데이터 모델 (`data/spectrals.ts`)

- 15종 SpectralDefinition: id, name, description, effectType, penalty 정보
- 각 카드의 targetType: 'auto' (즉시 사용) 또는 'select_cards' (대상 선택 필요)
- requiresConfirmation: 대가가 있는 카드는 true

### 유틸리티 (`utils/spectral.ts`)

순수 함수 기반 효과 적용:
- `createSpectralConsumable(id)` — SpectralDefinition으로부터 ConsumableCard 생성
- `createRandomSpectralConsumable()` — 랜덤 스펙트럴 카드 생성

### 스토어 확장 (`stores/game.ts`)

- `handSizeModifier: ref(0)` — Ectoplasm/Ouija에 의한 영구 핸드 크기 감소
- `effectiveHandSize` computed — `DEFAULT_HAND_SIZE + handSizeModifier` (최소 1)
- `useConsumable`에 spectral 분기 추가 — 각 효과별 로직 구현
- 직렬화에 handSizeModifier 포함

### 스펙트럴 효과 구현 (스토어 내부)

| 효과 | 구현 |
|---|---|
| Familiar/Grim/Incantation | 손에서 랜덤 카드 파괴 + 새 카드 생성하여 덱에 추가 |
| Cryptid | 선택 카드 복사본 2장을 덱에 추가 |
| Talisman | 선택 카드에 Gold Seal 설정 |
| Aura | 선택 카드에 랜덤 에디션(Foil/Holo/Poly) 설정 |
| Wraith | 랜덤 rare 조커 생성, money = 0 |
| Ectoplasm | 랜덤 조커에 Negative 에디션, handSizeModifier -= 1 |
| Ankh | 랜덤 조커 복사, 다른 조커 파괴 (Eternal 제외) |
| Hex | 랜덤 조커에 Polychrome 에디션, 다른 조커 파괴 (Eternal 제외) |
| Sigil | 손의 모든 카드 수트를 랜덤 1개로 통일 |
| Ouija | 손의 모든 카드 랭크를 랜덤 1개로 통일, handSizeModifier -= 1 |
| Immolate | $20 획득, 손에서 랜덤 5장 파괴 |
| Black Hole | 모든 핸드 레벨 +1 |
| Soul | rare 조커 생성 (legendary는 Phase 3) |

### 핸드 크기 영구 감소

- `handSizeModifier` 별도 상태로 관리
- `startBlind()`에서 `DEFAULT_HAND_SIZE + handSizeModifier` 사용 (최소 1)
- `playHand()`의 카드 보충 시에도 동일 적용

## 현재 구현 상태

| 항목 | 상태 |
|---|---|
| 15종 스펙트럴 카드가 모두 정의되고 고유 효과가 동작한다 | ✅ 완료 (data/spectrals.ts + stores/game.ts applySpectralEffect) |
| 카드 파괴 효과가 덱에서 영구 제거로 동작한다 | ✅ 완료 (destroyRandomHandCards) |
| Wraith가 보유 자금을 $0으로 만들고 희귀 조커를 생성한다 | ✅ 완료 |
| Ankh/Hex의 "모든 조커 파괴"가 Eternal 조커를 제외한다 | ✅ 완료 (j.eternal 필터) |
| Ectoplasm/Ouija의 핸드 크기 감소가 영구 적용된다 | ✅ 완료 (handSizeModifier) |
| 핸드 크기 최소값(1)이 보장된다 | ✅ 완료 (effectiveHandSize = Math.max(1, ...)) |
| Black Hole이 모든 핸드 레벨을 +1한다 | ✅ 완료 (level_all_hands) |
| Cryptid가 선택 카드의 모든 수정자를 포함하여 복사한다 | ✅ 완료 (spread로 전체 복사) |
| 대가가 있는 카드 사용 시 확인 다이얼로그가 표시된다 | ❌ 미구현 (UI 추후 개선) |

## Consequences

**긍정적:**
- 고위험-고보상 전략적 결단 제공으로 게임 깊이 증가
- F14/F15/F17 인프라 위에 구축되어 기존 시스템과 자연스럽게 통합

**부정적:**
- 대가 카드 확인 다이얼로그 UI는 별도 구현 필요 (이번 구현에서는 즉시 적용으로 처리, UI는 추후 개선)
- 카드 파괴가 덱 크기를 줄여 극단적 상황(덱 0장)이 발생할 수 있음

## Alternatives Considered

1. **스펙트럴 효과를 모두 utils 순수 함수로 분리** — 기각: 대부분의 효과가 여러 스토어 상태(jokers, hand, money, handLevels)를 동시에 변경하므로 스토어 내에서 직접 처리가 더 단순
2. **대상 선택이 필요한 카드(Cryptid, Talisman, Aura)를 별도 플로우로 구현** — 채택 예정: F18 기본 구현에서는 auto 카드만 구현, 대상 선택 카드는 auto(랜덤 선택)로 대체
