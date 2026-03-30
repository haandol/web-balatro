# ADR-004: 표준 포커 핸드 인식 (F4)

- **Status**: Accepted
- **Date**: 2026-03-31
- **ALPS Feature**: F4 — 표준 포커 핸드 인식 (`specs/web-balatro.alps.md` Section 7.4)

## Context

플레이한 카드가 어떤 포커 핸드인지 자동으로 판별하여 정확한 기본 점수를 적용하는 기능이 필요하다. F2(핸드 플레이) 구현 시 함께 구현되었다.

ALPS 요구사항:
- 10종 포커 핸드 판별 (하이 카드 ~ 로얄 플러시)
- 복수 핸드 가능 시 가장 높은 랭크 선택
- A-high/A-low 스트레이트 지원, 랩어라운드 불가
- 핸드 레벨 시스템 (MVP에서는 Lv.1 고정, Phase 2에서 플래닛 카드로 업그레이드)

## Decision

`utils/poker.ts`에 순수 함수로 구현:

- **`evaluateHand(cards: PlayingCard[]): HandResult`**
  - 판별 순서: Royal Flush → Straight Flush → Four of a Kind → Full House → Flush → Straight → Three of a Kind → Two Pair → One Pair → High Card
  - 내부 헬퍼: `rankCounts()` (랭크별 그룹), `isFlush()` (5장 동일 슈트), `getStraightCards()` (연속 랭크 검사)
  - `scoringCards`: 핸드 유형에 기여하는 카드만 포함 (예: One Pair → 페어 2장만)

- **`HAND_BASE` 상수**: ALPS 점수 테이블과 일치하는 기본 칩/승수 매핑

- **`types/poker.ts`**: `PokerHandType` (10종 union type), `HandResult` 인터페이스

## 현재 구현 상태

| 항목 | 상태 |
|---|---|
| 10종 포커 핸드 정확히 판별 | ✅ 완료 |
| 복수 핸드 시 최고 랭크 선택 | ✅ 완료 |
| A-high/A-low 스트레이트 | ✅ 완료 |
| 핸드 유형에 맞는 기본 칩/승수 적용 | ✅ 완료 |
| 판별된 핸드 유형 UI 표시 | ✅ 완료 (실시간 프리뷰 + 플레이 결과) |
| 핸드 레벨 시스템 | ❌ 미구현 (Phase 2) |

## Consequences

### 긍정적
- 순수 함수로 테스트 용이
- scoringCards 분리로 F5 점수 계산에서 정확한 카드별 칩 합산 가능

### 부정적
- 핸드 레벨 시스템 미구현 — Phase 2에서 플래닛 카드 연동 시 HAND_BASE를 동적으로 변경해야 함

## Alternatives Considered

- **F4를 F2와 별도 ADR/커밋으로 분리**: F2가 F4 없이는 점수 표시 불가하므로 함께 구현이 적절
