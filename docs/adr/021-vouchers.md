# ADR-021: 바우처 시스템 (F19)

- **Status**: Accepted
- **Date**: 2026-04-01
- **ALPS Feature**: F19 — 바우처 시스템 (`specs/web-balatro-phase2.alps.md`)

## Context

바우처는 런 전체에 영구적으로 적용되는 특전으로, 상점에서 $10에 구매한다. 16쌍(32종) 중 Phase 2에서는 게임플레이에 직접 영향을 주는 핵심 바우처를 구현한다.

## Decision

### Phase 2 구현 범위 (16종 = 8쌍)

| Base | Upgrade | 효과 |
|---|---|---|
| Grabber | Nacho Tong | +1/+1 핸드 per round |
| Wasteful | Recyclomancy | +1/+1 디스카드 per round |
| Seed Money | Money Tree | 이자 상한 $10/$20 |
| Paintbrush | Palette | 핸드 크기 +1/+1 |
| Crystal Ball | — | 소모품 슬롯 +1 |
| Reroll Surplus | Reroll Glut | 리롤 비용 -$2/-$2 |
| Clearance Sale | Liquidation | 상점 할인 25%/50% |
| Overstock | Overstock Plus | 상점 조커 슬롯 +1/+1 |

### 데이터 모델 (`data/vouchers.ts`)

```typescript
interface VoucherDefinition {
  id: string; name: string; description: string; cost: number;
  tier: 'base' | 'upgrade'; upgradeOf?: string;
  effect: { type: string; value: number }
}
```

### 스토어 (`stores/game.ts`)

- `purchasedVouchers: ref<string[]>([])` — 구매된 바우처 ID 목록
- `shopVoucher: ref<VoucherDefinition | null>(null)` — 현재 상점 바우처
- `buyVoucher()` — 구매 및 효과 즉시 적용
- `generateShopVoucher()` — 미구매/잠금해제 바우처 중 랜덤 선택
- 효과 적용: computed로 바우처 기반 보너스를 반영
  - `bonusHands/bonusDiscards` — startBlind에서 적용
  - `interestCap` — economy 계산에 적용
  - `shopDiscount` — 가격 표시에 적용

### UI (`pages/index.vue`)

- 상점에 바우처 슬롯 1개 추가 ($10 고정)

## 현재 구현 상태

| 항목 | 상태 |
|---|---|
| 바우처 데이터 정의 | ✅ 구현 완료 |
| 바우처 구매/효과 로직 | ✅ 구현 완료 |
| 상점 바우처 슬롯 UI | ✅ 구현 완료 |
| 이자 상한 적용 | ✅ 구현 완료 |
| 할인/리롤비용 적용 | ✅ 구현 완료 |

## Consequences

**긍정적:**
- 런 분화: 바우처 선택에 따라 서로 다른 전략 가능
- 경제 시스템 깊이 증가

**부정적:**
- 상점 UI 복잡도 증가
- 밸런스 조정 필요 (특히 이자 상한, 할인)
