# ADR-007: 조커 시스템 (F6)

- **Status**: Proposed
- **Date**: 2026-03-31
- **ALPS Feature**: F6 — 조커 시스템 (`specs/web-balatro.alps.md` Section 7.6)

## Context

플레이어가 조커를 획득·배치하여 패시브 보너스와 시너지를 구축하고, 점수를 극대화하는 전략을 수립할 수 있어야 한다. 현재 `types/joker.ts`에 기본 인터페이스(`add_chips`/`add_mult`/`x_mult`)가 정의되어 있고, `calculateScore()`에서 단순 3종 효과를 순차 적용한다. 하지만 조커 데이터 풀, 조건부 효과, 슬롯 관리, UI가 없다.

ALPS 요구사항:
- MVP 조커 풀 20~30종 (일반/희귀/매우 희귀)
- 효과 유형: 패시브 보너스, 조건부 보너스, 곱셈 보너스, 유틸리티
- 최대 5슬롯, 드래그 재배열, 판매 가능
- 조커 탭 시 능력 설명 툴팁

## Decision

### 1단계: 조커 효과 시스템 확장

**기존 JokerEffect 단일 구조를 트리거 + 효과로 분리:**

```typescript
// types/joker.ts
type JokerTrigger =
  | { type: 'always' }                              // 매 핸드 적용
  | { type: 'if_hand'; handType: PokerHandType }    // 특정 핸드일 때
  | { type: 'per_suit'; suit: Suit }                 // 특정 슈트 카드당
  | { type: 'per_rank'; rank: Rank }                 // 특정 랭크 카드당
  | { type: 'if_hand_size_lte'; size: number }       // 핸드 크기 N 이하
  | { type: 'per_face_card' }                        // 페이스 카드(J/Q/K)당
  | { type: 'on_round_end' }                         // 라운드 종료 시 (경제 효과용)

type JokerEffectType = 'add_chips' | 'add_mult' | 'x_mult' | 'add_discard' | 'add_hand_size'

interface JokerEffect {
  trigger: JokerTrigger
  type: JokerEffectType
  value: number
}
```

### 2단계: 조커 데이터 풀 (data/jokers.ts)

MVP 15종으로 시작 (확장 용이한 구조):

| 이름 | 레어리티 | 트리거 | 효과 |
|---|---|---|---|
| Joker | common | always | +4 Mult |
| Greedy Joker | common | per_suit(diamonds) | +3 Mult |
| Lusty Joker | common | per_suit(hearts) | +3 Mult |
| Wrathful Joker | common | per_suit(spades) | +3 Mult |
| Gluttonous Joker | common | per_suit(clubs) | +3 Mult |
| Half Joker | common | if_hand_size_lte(3) | +20 Mult |
| Scary Face | common | per_face_card | +30 Chips |
| Banner | common | always (per discard remaining) | +30 Chips per discard |
| Mystic Summit | common | if_discards_zero | +15 Mult |
| Jolly Joker | common | if_hand(ONE_PAIR) | +8 Mult |
| Zany Joker | common | if_hand(THREE_OF_A_KIND) | +12 Mult |
| Mad Joker | common | if_hand(TWO_PAIR) | +10 Mult |
| Sly Joker | common | if_hand(ONE_PAIR) | +50 Chips |
| Steel Joker | uncommon | always (per steel card — 스틸 카드 미구현이므로 단순 xMult) | x0.2 per steel card |
| The Duo | rare | if_hand(ONE_PAIR) | x2 Mult |

### 3단계: 점수 계산 확장 (utils/poker.ts)

`calculateScore()`를 확장하여 트리거 조건을 평가:

```typescript
function evaluateTrigger(trigger: JokerTrigger, context: ScoreContext): number
// 반환값: 효과 적용 횟수 (0이면 미적용, per_suit 등은 해당 카드 수)
```

`ScoreContext`: `{ handResult, playedCards, hand, discardsRemaining }`

### 4단계: 슬롯 관리 (stores/game.ts)

- `jokers: ref<Joker[]>([])` — 기존 사용
- `MAX_JOKER_SLOTS = 5`
- `addJoker(joker)`: 슬롯 여유 시 추가
- `removeJoker(jokerId)`: 제거 (판매)
- `reorderJokers(fromIndex, toIndex)`: 위치 변경

### 5단계: UI (components/JokerSlot.vue, pages/index.vue)

- 게임 화면 상단에 조커 슬롯 5칸 표시
- 조커 카드: 이름 + 효과 요약 + 레어리티 색상
- 클릭 시 툴팁으로 상세 설명
- 슬롯 간 드래그 재배열은 F6 범위 외로 후순위 처리 (클릭 기반 이동으로 대체)
- 판매는 F10(경제 시스템) 구현 후 연동

### 테스트용 초기 조커 부여

상점(F9) 미구현이므로, `initRun()` 시 랜덤 조커 2개를 부여하여 시스템 동작을 확인할 수 있게 한다.

## 현재 구현 상태

| 항목 | 상태 |
|---|---|
| 최대 5개의 조커를 슬롯에 장착할 수 있다 | ❌ 미구현 |
| 조커의 패시브/조건부/xMult 효과가 정확히 적용된다 | ❌ 미구현 (단순 3종만 지원) |
| 드래그로 조커 위치를 재배열할 수 있다 | ❌ 미구현 |
| 조커를 판매하여 자금을 획득할 수 있다 | ❌ 미구현 (F10 연동 필요) |
| 슬롯이 가득 찬 경우 새 조커를 획득할 수 없다 | ❌ 미구현 |
| 조커 탭 시 능력 설명이 표시된다 | ❌ 미구현 |

## Consequences

### 긍정적
- 트리거+효과 분리로 조건부 조커를 유연하게 확장 가능
- MVP 15종으로 핵심 조커 카테고리(패시브/조건부/곱셈) 모두 커버
- 테스트용 랜덤 조커 부여로 F9(상점) 없이도 시스템 검증 가능

### 부정적
- 드래그 재배열 미구현 — 클릭 기반 이동으로 대체
- 판매 기능은 F10(경제 시스템) 연동 필요
- `ScoreContext` 확장으로 `calculateScore` 시그니처 변경 — 기존 호출부 수정 필요

## Alternatives Considered

- **단순 효과만 유지 (트리거 없이)**: 조건부 조커를 표현할 수 없어 게임의 전략적 깊이가 부족
- **전체 30종 한번에 구현**: 범위가 커지므로 MVP 15종으로 시작하고 점진적 확장
