# ADR-009: 상점 시스템 (F9)

- **Status**: Proposed
- **Date**: 2026-03-31
- **ALPS Feature**: F9 — 상점 시스템 (`specs/web-balatro.alps.md` Section 7.9)

## Context

블라인드 클리어 후 상점에서 조커를 구매하고 리롤하여 덱을 강화할 수 있어야 한다. F10(경제 시스템)이 선행 구현되어 자금 관리가 가능한 상태.

ALPS 요구사항:
- 상점 구성: 조커 2개 + 부스터 팩 2개 (부스터 팩은 후순위)
- 희귀도 가중치: 일반 70%, 희귀 25%, 매우 희귀 5%
- 리롤: 초기 $5, 동일 상점 내 리롤마다 +$1
- 가격: 희귀도별 기본 가격
- "Next Round" 버튼으로 상점 종료

## Decision

### 게임 페이즈 확장

`GamePhase`에 `'shop'` 추가: `round_end` → `shop` → `blind_select`

### 상점 상태 (stores/game.ts)

- `shopJokers: ref<Joker[]>([])` — 상점에 진열된 조커 (최대 2개)
- `rerollCost: ref(5)` — 현재 리롤 비용
- `generateShop()`: 희귀도 가중치 기반으로 조커 2개 생성
- `buyJoker(index)`: 자금 차감 + 조커 슬롯에 추가 + 상점에서 제거
- `rerollShop()`: 리롤 비용 차감 + 새 조커 생성 + 비용 +$1

### 조커 가격 체계

`data/jokers.ts`에 이미 `sellPrice`가 있으므로, 구매 가격은 `sellPrice * 2`로 계산 (판매가의 2배).

### 희귀도 가중치 생성

```typescript
function pickRarity(): JokerRarity {
  const roll = Math.random()
  if (roll < 0.05) return 'rare'
  if (roll < 0.30) return 'uncommon'
  return 'common'
}
```

### UI (pages/index.vue 내 shop 템플릿)

- 상점 화면: 조커 2개 (가격 표시), Buy 버튼, Reroll 버튼 (비용 표시), Next Round 버튼
- 자금 부족 시 Buy/Reroll 버튼 비활성화
- 조커 슬롯 가득 시 Buy 버튼 비활성화

## 현재 구현 상태

| 항목 | 상태 |
|---|---|
| 블라인드 클리어 후 상점이 표시된다 | ❌ 미구현 |
| 자금이 충분할 때만 아이템을 구매할 수 있다 | ❌ 미구현 |
| 리롤 시 새 아이템으로 교체되고 비용이 차감된다 | ❌ 미구현 |
| 리롤 비용이 동일 상점 내에서 점진적으로 증가한다 | ❌ 미구현 |
| 부스터 팩 구매 시 카드 선택 화면이 표시된다 | ❌ 미구현 (후순위) |
| "Next Round" 버튼으로 다음 블라인드 선택 화면으로 이동한다 | ❌ 미구현 |

## Consequences

### 긍정적
- 조커 획득 경로가 생겨 F6 조커 시스템이 완전히 활용 가능
- 리롤로 전략적 선택 요소 추가

### 부정적
- 부스터 팩은 후순위 — 조커 구매만 우선 구현
- Chaos the Clown 무료 리롤 미구현

## Alternatives Considered

- **부스터 팩 동시 구현**: 범위가 커지므로 조커 상점만 우선, 부스터 팩은 별도 피쳐로
