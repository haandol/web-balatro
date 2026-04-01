# ADR-014: 카드 수정자 시스템 (F14)

- **Status**: Accepted
- **Date**: 2026-04-01
- **ALPS Feature**: F14 — 카드 수정자 시스템 (`specs/web-balatro-phase2.alps.md` Section 7.1)

## Context

Phase 2의 모든 기능(F15~F21)이 의존하는 기반 인프라. 플레이 카드에 Enhancement(8종)/Edition(5종)/Seal(4종) 수정자를 부여하여 점수 계산, 덱 조작, 자원 생성 등 다양한 효과를 제공한다. 조커에도 Edition과 Eternal 속성을 추가한다.

## Decision

### 데이터 모델

- `PlayingCard`에 `enhancement?`, `edition?`, `seal?` optional 필드 추가 (하위 호환)
- `Joker`에 `edition?`, `eternal?` optional 필드 추가
- Eternal은 Edition이 아닌 별도 boolean (Foil + Eternal 동시 가능)

### 파일 구조

- `types/card.ts` — Enhancement, Edition, Seal 타입 정의 + PlayingCard 확장
- `types/joker.ts` — edition, eternal 필드 추가
- `data/cardModifiers.ts` — 수정자별 정의 객체 (이름, 설명, 효과)
- `utils/cardModifiers.ts` — 순수 유틸리티 함수 (set/remove/query)
- `utils/boss.ts` — isDebuffed() 확장 (Stone 면역, Wild 전체 수트)
- `stores/game.ts` — maxJokerSlots computed (Negative 반영), eternal 판매 방어
- `components/card/Playing.vue` — Enhancement 배경색, Edition 이펙트, Seal 아이콘
- `components/joker/Card.vue` — Edition 이펙트

### 점수 계산

F14는 데이터 모델과 시각 표시만 담당. 점수 계산 통합은 F21에서 수행.

## 현재 구현 상태

| 항목 | 상태 |
|---|---|
| 카드에 강화/에디션/인장을 각각 하나씩 부여할 수 있다 | ✅ 완료 (types/card.ts + utils/cardModifiers.ts) |
| 강화/에디션/인장이 동시에 한 카드에 공존할 수 있다 | ✅ 완료 (optional 필드 독립) |
| 각 수정자의 효과가 정확한 트리거 시점에 발동한다 | ❌ 미구현 (F21) |
| Wild Card가 모든 슈트 조건을 만족시킨다 | ✅ 완료 (utils/boss.ts + utils/cardModifiers.ts getEffectiveSuits) |
| Glass Card가 점수 획득 후 1/4 확률로 파괴된다 | ❌ 미구현 (F21) |
| Steel Card가 손에 있는 동안 점수에 기여한다 | ❌ 미구현 (F21) |
| Stone Card가 랭크/슈트 없이 +50 칩만 기여한다 | ❌ 미구현 (F21) |
| Red Seal이 카드 효과를 재트리거한다 | ❌ 미구현 (F21) |
| Gold/Blue/Purple Seal이 정확한 시점에 발동한다 | ❌ 미구현 (F21) |
| 카드 수정자가 시각적으로 구분된다 | ✅ 완료 (Playing.vue, joker/Card.vue, main.css) |
| Negative 조커가 슬롯 +1을 제공하고 판매 시 -1된다 | ✅ 완료 (stores/game.ts maxJokerSlots) |
| Eternal 조커가 판매/파괴 불가하다 | ✅ 완료 (stores/game.ts sellJoker) |

## Consequences

**긍정적:**
- Phase 2 전체(F15~F21)가 이 인프라 위에 구축됨
- Optional 필드로 Phase 1 하위 호환 완벽 보장
- 순수 함수 기반 유틸리티로 테스트 용이

**부정적:**
- CSS 애니메이션(Edition 이펙트)이 저사양 모바일에서 성능 이슈 가능 → prefers-reduced-motion 대응 필요

## Alternatives Considered

1. **Eternal을 Edition 타입에 포함** — 기각: Foil+Eternal 같은 조합 불가능
2. **수정자를 별도 Map으로 관리** — 기각: PlayingCard에 직접 optional 필드가 더 단순하고 직렬화 용이
