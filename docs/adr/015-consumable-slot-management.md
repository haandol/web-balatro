# ADR-015: 소모품 슬롯 관리 (F15)

- **Status**: Accepted
- **Date**: 2026-04-01
- **ALPS Feature**: F15 — 소모품 슬롯 관리 (`specs/web-balatro-phase2.alps.md` Section 7.2)

## Context

Phase 2에서 타로(F16), 플래닛(F17), 스펙트럴(F18) 카드를 도입하기 위해, 소모품을 보관하고 관리하는 인벤토리 시스템이 필요하다. 플레이어는 기본 2개의 소모품 슬롯에 카드를 보관하고, 블라인드 플레이 중 원하는 시점에 사용할 수 있어야 한다. F15는 F16/F17/F18의 전제 조건이며, 슬롯 관리/보관/제거/판매의 공통 인프라를 제공한다.

## Decision

### 데이터 모델

- `types/consumable.ts` — `ConsumableType`, `ConsumableCard` 인터페이스 정의
- `ConsumableCard`: `{ id, type: 'tarot' | 'planet' | 'spectral', name, description, effect, edition?, sellPrice }`
- `effect`는 F16/F17/F18에서 각각 정의할 discriminated union — F15에서는 `{ type: string }` 기본 형태만 제공

### Pinia Store 확장 (`stores/game.ts`)

- `consumables: ref<ConsumableCard[]>([])` — 현재 보유 소모품 배열
- `consumableSlots: ref(2)` — 기본 2슬롯, Crystal Ball 바우처로 +1 (F19에서 구현)
- `addConsumable(card)` — 슬롯 여유 확인 후 추가, 가득 차면 false 반환
- `removeConsumable(id)` — ID로 소모품 제거 (사용 후 호출)
- `sellConsumable(id)` — 판매: 타로/플래닛 $1, 스펙트럴 $2 후 제거
- `initRun()`에서 `consumables = []`, `consumableSlots = 2` 초기화
- `getSerializableState()`/`continueRun()`에 consumables, consumableSlots 포함

### 사용 시점 규칙

- 블라인드 플레이 중(`gamePhase === 'playing'`)에만 사용 가능
- 사용 시 핸드/디스카드 횟수 미소모
- 실제 효과 적용은 F16/F17/F18에서 각 타입별로 구현

### 컴포넌트

- `components/consumable/Card.vue` — 소모품 카드 표시 (타입별 색상, 툴팁, 판매 버튼)
- `components/consumable/Slots.vue` — 소모품 슬롯 영역 (보유 카드 + 빈 슬롯)
- `pages/index.vue` — 조커 슬롯 아래에 소모품 슬롯 배치

### 판매 가격

| 타입 | 판매가 |
|---|---|
| Tarot | $1 |
| Planet | $1 |
| Spectral | $2 |

## 현재 구현 상태

| 항목 | 상태 |
|---|---|
| 기본 2개 소모품 슬롯이 제공된다 | ✅ 완료 (stores/game.ts consumableSlots=2) |
| 소모품을 슬롯에 보관하고 원하는 시점에 사용할 수 있다 | ✅ 완료 (addConsumable + removeConsumable, USE 버튼은 playing 중만 활성) |
| 슬롯이 가득 차면 새 소모품을 획득할 수 없다 | ✅ 완료 (addConsumable 슬롯 체크) |
| 소모품 사용 시 핸드/디스카드 횟수가 소모되지 않는다 | ✅ 완료 (removeConsumable은 hands/discards 미변경) |
| 소모품을 판매하여 자금을 얻을 수 있다 | ✅ 완료 (sellConsumable: tarot/planet $1, spectral $2) |
| 소모품 슬롯이 시각적으로 표시된다 | ✅ 완료 (ConsumableSlots.vue, ConsumableCard.vue) |

## Consequences

**긍정적:**
- F16(타로), F17(플래닛), F18(스펙트럴)이 이 인프라 위에 독립적으로 구현 가능
- Optional 필드와 기본 타입으로 Phase 1 하위 호환 보장
- 직렬화에 포함하여 세이브/로드 지원

**부정적:**
- 소모품 사용 효과가 아직 없어 F15만으로는 "빈 슬롯" 상태 — F16~F18 구현 전까지 실질적 게임플레이 변화 없음

## Alternatives Considered

1. **소모품을 조커와 같은 배열로 통합 관리** — 기각: 소모품과 조커는 사용 방식, 슬롯 수, 판매가가 모두 다름
2. **소모품 슬롯을 고정 배열(fixed-size array)로 구현** — 기각: 바우처로 슬롯 수가 변동하므로 동적 배열 + 별도 슬롯 수 관리가 유연함
