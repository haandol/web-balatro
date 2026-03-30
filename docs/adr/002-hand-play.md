# ADR-002: 핸드 플레이 (F2)

- **Status**: Accepted
- **Date**: 2026-03-31
- **ALPS Feature**: F2 — 핸드 플레이 (`specs/web-balatro.alps.md` Section 7.2)

## Context

플레이어가 손에 든 카드 중 1~5장을 선택하여 포커 핸드를 구성하고 플레이하여 블라인드 목표 점수 달성을 시도하는 핵심 게임 액션이 필요하다.

ALPS 요구사항:
- 최소 1장, 최대 5장 선택 후 플레이
- 라운드당 핸드 4회, 디스카드 3회 (기본값)
- 플레이된 카드는 discard pile로 이동, draw pile에서 핸드 크기(8장)까지 보충
- 핸드 0 + 목표 점수 미달 시 게임 오버

F2는 F4(포커 핸드 인식)와 F5(점수 계산)에 의존하지만, 이번 구현에서는 F4의 기본 핸드 판별을 함께 포함하여 플레이 시 결과를 표시한다. 점수 계산(F5)은 기본 칩×승수만 적용하고 조커는 미적용.

## Decision

### 게임 스토어 확장 (stores/game.ts)

기존 F1 상태에 다음을 추가:

- **State 추가**:
  - `handsRemaining: ref(4)` — 라운드당 남은 플레이 횟수
  - `discardsRemaining: ref(3)` — 라운드당 남은 디스카드 횟수
  - `roundScore: ref(0)` — 현재 라운드 누적 점수
  - `targetScore: ref(300)` — 현재 블라인드 목표 점수 (임시 고정값)
  - `lastHandResult: ref(null)` — 마지막 플레이 결과 (핸드 유형, 점수)
  - `gamePhase: ref('playing')` — 게임 상태 ('playing' | 'won' | 'lost')

- **Actions 추가**:
  - `playHand(cardIds)`: 선택된 카드로 포커 핸드 평가 → 점수 계산 → discard pile 이동 → 카드 보충 → handsRemaining 감소 → 승/패 판정
  - `discardCards(cardIds)`: 기존 discardFromHand + discardsRemaining 감소 + 카드 보충
  - `initRound()`: handsRemaining/discardsRemaining/roundScore 초기화, 덱 리셔플, 카드 드로우

- **상수**:
  - `DEFAULT_HANDS = 4`
  - `DEFAULT_DISCARDS = 3`
  - `DEFAULT_HAND_SIZE = 8`

### 포커 핸드 판별 (utils/poker.ts)

F4의 핵심 로직을 함께 구현:

- `evaluateHand(cards: PlayingCard[]): HandResult` — 10종 포커 핸드 판별 (하이 카드 ~ 로얄 플러시)
- `HandResult`: `{ type, name, baseChips, baseMult, scoringCards }` — 점수에 기여하는 카드 식별
- 판별 우선순위: 로얄 플러시 → 스트레이트 플러시 → 포 오브 어 카인드 → ... → 하이 카드
- 스트레이트 규칙: A-high(A-K-Q-J-10)와 A-low(A-2-3-4-5) 허용, 랩어라운드(K-A-2-3-4) 불가
- `calculateHandScore(result: HandResult): number` — (baseChips + scoring cards chips) × baseMult

### UI 업데이트 (pages/index.vue)

- "Play Hand" 버튼 추가 (Discard 버튼과 분리)
- Play Hand: selectedCardIds.size가 1~5일 때만 활성화, handsRemaining > 0일 때만 활성화
- Discard: selectedCardIds.size가 1~5일 때만 활성화, discardsRemaining > 0일 때만 활성화
- 상단에 Hands/Discards 잔여 횟수 표시
- 라운드 점수 / 목표 점수 표시
- 마지막 핸드 결과 (핸드 유형 + 점수) 표시
- 게임 오버/승리 시 결과 표시 및 New Run 버튼

## 현재 구현 상태

| 항목 | 상태 |
|---|---|
| 1~5장 카드 선택하여 플레이 | ✅ 완료 (playHand 액션 + Play Hand 버튼) |
| 0장/6장+ 선택 시 Play 버튼 비활성화 | ✅ 완료 (canPlay computed) |
| 플레이 후 handsRemaining 1 감소 | ✅ 완료 |
| 핸드 0 + 목표 미달 시 게임 오버 | ✅ 완료 (gamePhase 상태 관리) |
| 플레이 후 핸드 크기만큼 카드 보충 | ✅ 완료 (자동 리셔플 포함) |
| 포커 핸드 판별 (10종) | ✅ 완료 (utils/poker.ts) |
| 기본 점수 계산 (칩 × 승수) | ✅ 완료 (조커 미적용) |
| Discard 버튼 + discardsRemaining 추적 | ✅ 완료 (F3 기본 지원) |
| 점수 / 목표 표시 + 프로그레스 바 | ✅ 완료 |
| 점수 계산 애니메이션 | ❌ 미구현 |
| 카드 이동 애니메이션 | ❌ 미구현 |

## Consequences

### 긍정적
- 핵심 게임 루프(카드 선택 → 플레이 → 점수 → 보충)가 완성됨
- F4(핸드 인식)의 기본 로직이 함께 구현되어 즉시 결과 확인 가능
- 라운드 상태 관리(hands/discards remaining)가 추가되어 F3(카드 버리기)도 자연스럽게 지원

### 부정적
- 조커 효과 미적용 (F5/F6 구현 후 통합 필요)
- 블라인드 진행(F7) 미연동으로 targetScore가 임시 고정값
- 점수 계산 애니메이션 미구현

## Alternatives Considered

- **composable 분리 (useBalatroGame.ts)**: 게임 오케스트레이션을 composable로 분리하는 방안. 현재는 store에 직접 구현하고 복잡도가 증가하면 추후 리팩토링
- **F4를 별도 ADR로 분리**: 포커 핸드 판별만 별도 구현. 그러나 F2가 F4 없이는 의미 없으므로 함께 구현
