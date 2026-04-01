# ADR-020: 타로 카드 (F16)

- **Status**: Accepted
- **Date**: 2026-04-01
- **ALPS Feature**: F16 — 타로 카드 22종 (`specs/web-balatro-phase2.alps.md`)

## Context

타로 카드는 핸드의 카드를 수정(Enhancement/Seal/Edition 부여, 수트 변환, 파괴)하거나 자원을 생성(돈, 플래닛 카드, 조커)하는 일회성 소모품이다. F14(카드 수정자), F15(소모품 슬롯), F20(부스터 팩)이 이미 구현되어 있으므로 타로 카드 데이터 + 효과 로직 + 아르카나 팩 연동만 추가하면 된다.

## Decision

### 데이터 모델 (`data/tarots.ts`)

22종 타로 카드를 정의한다. 각 카드는 `effectType`으로 효과를 분류하고, 대상 카드가 필요한 경우 현재 핸드에서 자동 랜덤 선택한다 (타겟 선택 UI는 Phase 3).

### 타로 카드 효과 분류

| effectType | 카드 | 효과 |
|---|---|---|
| add_enhancement | Magician(Lucky), Empress(Mult), Emperor(Wild), Hierophant(Bonus), Lovers(Wild), Chariot(Steel), Justice(Glass), Devil(Gold), Tower(Stone) | 랜덤 핸드 카드에 Enhancement 부여 |
| add_seal | Temperance | 랜덤 핸드 카드에 Gold Seal 부여 |
| convert_suit | Star(Diamond), Moon(Club), Sun(Heart), World(Spade) | 랜덤 핸드 카드의 수트 변환 |
| destroy_cards | Hanged Man | 랜덤 핸드 카드 2장 파괴 |
| copy_card_to_card | Death | 핸드 카드 1장을 다른 카드로 복사 변환 |
| add_rank | Strength | 랜덤 핸드 카드 2장의 랭크를 1단계 올림 |
| double_money | Hermit | 소지금 2배 (최대 $20) |
| random_joker_edition | Wheel of Fortune | 1/4 확률로 랜덤 조커에 Foil/Holo/Polychrome 부여 |
| generate_planet | High Priestess | 플래닛 카드 2장 생성 (소모품 슬롯에 추가) |
| generate_joker | Judgment | 랜덤 조커 1장 생성 |
| copy_last_tarot | Fool | 마지막 사용한 타로/플래닛 효과 복사 (현재는 랜덤 플래닛 생성으로 대체) |

### 유틸리티 (`utils/tarot.ts`)

- `createTarotConsumable(id)` — 특정 타로 카드 ConsumableCard 생성
- `createRandomTarotConsumable()` — 랜덤 타로 카드 생성

### 스토어 (`stores/game.ts`)

- `useConsumable()`에 `card.type === 'tarot'` 분기 추가
- `applyTarotEffect(card)` — 스위치 문으로 22종 효과 처리
- 대상 카드가 필요한 효과는 핸드에서 자동 랜덤 선택

### 아르카나 팩 연동 (`utils/boosterPack.ts`)

- `generatePackContents()`의 arcana case에서 `createRandomTarotConsumable()` 호출

## 현재 구현 상태

| 항목 | 상태 |
|---|---|
| 22종 타로 카드 데이터 정의 | ✅ 구현 완료 |
| 타로 효과 로직 (store) | ✅ 구현 완료 |
| 아르카나 팩에서 타로 카드 생성 | ✅ 구현 완료 |
| useConsumable에 타로 분기 | ✅ 구현 완료 |

## Consequences

**긍정적:**
- 덱 빌딩의 핵심 도구 추가, F14 수정자가 게임 전략에 실질적으로 참여
- 아르카나 팩이 본래 목적대로 타로 카드를 제공

**부정적:**
- 대상 카드 자동 선택으로 전략적 깊이 일부 제한 (Phase 3에서 UI 보강 예정)

## Alternatives Considered

1. **대상 선택 UI 동시 구현** — 기각: UI 복잡도가 높아 Phase 3으로 분리
2. **타로 효과를 utils 순수 함수로** — 기각: 스펙트럴과 동일하게 store에서 다중 상태 변경
