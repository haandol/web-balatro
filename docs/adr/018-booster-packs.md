# ADR-018: 확장 부스터 팩 (F20)

- **Status**: Accepted
- **Date**: 2026-04-01
- **ALPS Feature**: F20 — 확장 부스터 팩 (`specs/web-balatro-phase2.alps.md` Section 7.7)

## Context

Phase 1에는 부스터 팩이 없었다. 상점에 아르카나(타로)/셀레스티얼(플래닛)/스펙트럴 팩을 추가하여 F16(타로)/F17(플래닛)/F18(스펙트럴) 카드의 주요 획득 경로를 제공한다. 팩은 구매 후 열기 UI에서 카드를 선택하여 소모품 슬롯에 추가하거나 즉시 사용할 수 있다.

## Decision

### 데이터 모델

- `types/boosterPack.ts` — PackType, PackSize, BoosterPack, OpenPackState 타입
- `data/boosterPacks.ts` — 3종(아르카나/셀레스티얼/스펙트럴) x 3크기 = 9개 팩 정의

### 팩 종류 (Phase 2 범위)

| 팩 | Normal ($4) | Jumbo ($6) | Mega ($8) |
|---|---|---|---|
| 아르카나 (타로) | 3장 중 1선택 | 5장 중 1선택 | 5장 중 2선택 |
| 셀레스티얼 (플래닛) | 3장 중 1선택 | 5장 중 1선택 | 5장 중 2선택 |
| 스펙트럴 | 2장 중 1선택 | 4장 중 1선택 | 4장 중 2선택 |

> 스탠다드/버푼 팩은 Phase 2에서는 구현하지 않음 (F16 타로 카드 미구현으로 인해 카드 수정 효과가 제한적)

### 내용물 생성 (`utils/boosterPack.ts`)

- `generatePackContents(pack)` — 팩 유형에 따라 ConsumableCard[] 생성
  - 아르카나: 22종 타로 → 현재 타로 미구현이므로 랜덤 플래닛/스펙트럴 fallback
  - 셀레스티얼: `createRandomPlanetConsumable()` 사용
  - 스펙트럴: `createRandomSpectralConsumable()` 사용
- `rollShopPack()` — 가중치 기반 팩 유형/크기 선택

### 스토어 (`stores/game.ts`)

- `shopPacks: ref<BoosterPack[]>([])` — 상점에 진열된 팩 (2슬롯)
- `openPack: ref<OpenPackState | null>(null)` — 현재 열린 팩 상태
- `OpenPackState = { pack, cards, selectedIds, selectionsRemaining }`
- `generateShop()`에 팩 생성 추가
- `buyPack(index)` — 구매 → openPack 상태 설정
- `selectPackCard(cardId)` — 소모품 슬롯에 추가 (Take)
- `skipPack()` — 남은 카드 포기, 팩 닫기

### UI

- 상점에 팩 슬롯 2개 추가 (조커 아래)
- 팩 구매 시 팩 열기 오버레이 표시
- 카드 탭 → Take(슬롯 추가) / Skip(포기)

## 현재 구현 상태

| 항목 | 상태 |
|---|---|
| 아르카나/셀레스티얼/스펙트럴 팩이 상점에 출현한다 | ✅ 구현 완료 |
| 팩 열기 UI에서 카드를 선택할 수 있다 | ✅ 구현 완료 |
| 셀레스티얼 팩에서 플래닛 카드를 획득할 수 있다 | ✅ 구현 완료 |
| 스펙트럴 팩에서 스펙트럴 카드를 선택할 수 있다 | ✅ 구현 완료 |
| Mega 팩에서 2장을 순차 선택할 수 있다 | ✅ 구현 완료 |
| Skip으로 남은 카드를 포기할 수 있다 | ✅ 구현 완료 |

## Consequences

**긍정적:**
- 소모품 카드의 주요 획득 경로 제공으로 F17/F18이 실질적으로 게임에 참여
- 상점의 선택지가 다양해져 전략적 깊이 증가

**부정적:**
- 팩 열기 UI가 별도 오버레이로 필요하여 UI 복잡도 증가
- 타로 카드(F16) 미구현 상태에서 아르카나 팩은 플래닛으로 대체

## Alternatives Considered

1. **팩 없이 상점에 소모품 직접 판매** — 기각: 원작의 팩 메커닉(여러 장 중 선택)이 전략적 재미의 핵심
2. **팩 열기를 별도 페이지로** — 기각: 오버레이가 컨텍스트 전환 비용이 적고 구현이 단순
