# ADR-001: 덱 초기화 및 관리 (F1)

- **Status**: Accepted
- **Date**: 2026-03-31

## Context

Web Balatro의 핵심 기반인 표준 52장 덱의 생성, 셔플, 드로우, 상태 관리 시스템이 필요하다. 모든 상위 기능(핸드 플레이 F2, 카드 버리기 F3, 점수 계산 F5 등)이 이 시스템에 의존한다.

ALPS 요구사항:
- 4슈트 × 13랭크 = 52장 표준 덱 생성
- Fisher-Yates 셔플 알고리즘
- draw pile / hand / discard pile 상태 추적
- Pinia store 기반 중앙 상태 관리

## Decision

### 데이터 모델

- `types/card.ts`: `Suit`, `Rank`, `PlayingCard` 타입 정의
  - 카드 ID 형식: `{suit}-{rank}` (예: `hearts-A`)
  - MVP에서는 강화/에디션/인장 없이 기본 카드만 (`{ id, rank, suit }`)
- `data/cards.ts`: `SUITS`, `RANKS` 배열 및 `RANK_CHIPS` 매핑 (A=11, K/Q/J=10, 나머지=숫자값)

### 순수 함수 (utils/deck.ts)

- `createDeck()`: 52장 덱 생성
- `shuffle<T>()`: Fisher-Yates 알고리즘, 비파괴적 (새 배열 반환)
- `draw()`: 덱에서 카드 드로우, `{ drawn, remaining }` 반환 (불변 패턴)

### 상태 관리 (stores/game.ts)

- **State**: `drawPile`, `hand`, `discardPile` (모두 `PlayingCard[]`)
- **Getters**: `drawPileSize`, `handSize`, `discardPileSize`, `totalCards`
- **Actions**:
  - `initDeck()`: 52장 생성 → 셔플 → 8장 드로우
  - `drawCards(count)`: draw pile에서 hand로 이동
  - `reshuffleDeck()`: discard pile → draw pile로 이동 후 재셔플
  - `discardFromHand(cardIds)`: hand에서 discard pile로 이동
- 기본 핸드 크기: 8장 (`DEFAULT_HAND_SIZE`)

### 컴포넌트 (components/card/PlayingCard.vue)

- 카드 렌더링: 랭크 + 슈트 심볼 (♥♦♣♠)
- 선택 상태: 노란 테두리 + 리프트 애니메이션
- 색상: hearts/diamonds → 빨강, clubs/spades → 회색
- 반응형: 모바일/데스크톱 크기 분리
- 접근성: aria-label 지원

## 현재 구현 상태

| 항목 | 상태 |
|---|---|
| 52장 덱 생성 | ✅ 완료 |
| Fisher-Yates 셔플 | ✅ 완료 |
| draw pile / hand / discard pile 추적 | ✅ 완료 |
| 카드 드로우/디스카드 | ✅ 완료 |
| 리셔플 (discard → draw) | ✅ 완료 |
| 카드 선택 (최대 5장) | ✅ 완료 (pages/index.vue) |
| 카드 컴포넌트 렌더링 | ✅ 완료 |
| draw pile 소진 시 자동 리셔플 | ❌ 미구현 |
| played cards 별도 추적 | ❌ 미구현 |
| hands remaining / discards remaining 추적 | ❌ 미구현 (F2/F3 영역) |
| 카드 이동 애니메이션 | ❌ 미구현 |
| 카드 뒷면 렌더링 | ❌ 미구현 |

## Consequences

### 긍정적
- 순수 함수 기반으로 테스트 용이
- 불변 패턴으로 상태 추적이 명확
- 타입 안전성 확보 (TypeScript strict)
- F2(핸드 플레이), F3(카드 버리기), F4(핸드 인식), F5(점수 계산) 구현을 위한 기반 완성

### 부정적
- draw pile 소진 시 자동 리셔플 미구현으로, 호출부에서 별도 처리 필요
- 카드 강화/에디션/인장 확장 시 `PlayingCard` 인터페이스 변경 필요 (Phase 2)

## Alternatives Considered

- **Phaser.js 기반 카드 렌더링**: ALPS에서 Phaser.js를 언급했으나, MVP에서는 Vue 컴포넌트로 충분하다고 판단. 애니메이션이 필요해지면 재검토
- **클래스 기반 Deck 모델**: OOP 패턴 대신 순수 함수 + Pinia store 패턴 채택. 프로젝트 컨벤션(utils/ 순수함수, stores/ 상태)에 부합
