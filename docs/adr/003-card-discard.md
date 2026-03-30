# ADR-003: 카드 버리기 (F3)

- **Status**: Accepted
- **Date**: 2026-03-31
- **ALPS Feature**: F3 — 카드 버리기 (`specs/web-balatro.alps.md` Section 7.3)

## Context

플레이어가 손에 든 카드 중 최대 5장을 버리고 새 카드를 드로우하여 더 좋은 포커 핸드를 만들 수 있는 기능이 필요하다.

ALPS 요구사항:
- 1~5장 선택 후 버리기
- 버린 수만큼 draw pile에서 새 카드 드로우
- 라운드당 디스카드 기본 3회
- 디스카드 0일 때는 버튼 비활성화

## Decision

F3은 F2(핸드 플레이) 구현 시 함께 구현되었다. 별도 파일 추가 없이 기존 구조에 포함:

- **stores/game.ts**:
  - `discardsRemaining: ref(3)` — 라운드당 남은 디스카드 횟수
  - `discardCards(cardIds)`: 선택된 카드를 discard pile로 이동 → 같은 수만큼 draw pile에서 드로우 → discardsRemaining 감소
  - `initDeck()`에서 `discardsRemaining = 3`으로 초기화

- **pages/index.vue**:
  - `canDiscard` computed: `selectionCount >= 1 && selectionCount <= 5 && discardsRemaining > 0 && gamePhase === 'playing'`
  - Discard 버튼에 `:disabled="!canDiscard"` 바인딩
  - 디스카드 잔여 횟수 UI 표시

## 현재 구현 상태

| 항목 | 상태 |
|---|---|
| 1~5장 카드 선택하여 버리기 | ✅ 완료 |
| 버린 수만큼 새 카드 드로우 | ✅ 완료 |
| 디스카드 후 남은 수 1 감소 | ✅ 완료 |
| 디스카드 0이면 Discard 버튼 비활성화 | ✅ 완료 |
| 0장 선택 시 Discard 버튼 비활성화 | ✅ 완료 |
| 카드 버리기 애니메이션 | ❌ 미구현 |

## Consequences

### 긍정적
- F2와 동일 커밋에서 구현되어 코드 중복 없음
- 디스카드 전략(나쁜 핸드 순환)이 즉시 가능

### 부정적
- 조커/바우처에 의한 디스카드 횟수 변동 미구현 (F6/Phase 2)

## Alternatives Considered

- **F3을 별도 PR로 분리**: F2와 밀접하게 결합되어 있어 분리 시 오히려 불필요한 중간 상태 발생. 함께 구현이 적절
