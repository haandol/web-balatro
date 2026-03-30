# ADR-012: 런 관리 (F12)

- **Status**: Accepted
- **Date**: 2026-03-31
- **ALPS Feature**: F12 — 런 관리 (`specs/web-balatro.alps.md` Section 7.12)

## Context

현재 게임 시작/종료/승리 로직은 구현되어 있지만 런 통계 추적이 없다. 플레이어가 런 결과를 확인할 수 있도록 통계를 수집하고 결과 화면을 개선해야 한다.

ALPS 요구사항:
- 새 런 시작 시 모든 상태 초기화 (이미 구현됨: initRun)
- 게임 오버/승리 조건 (이미 구현됨: playHand에서 판정)
- 런 통계 추적: 도달 앤티, 클리어한 블라인드 수, 최고 단일 핸드 점수, 총 획득 자금, 보유 조커
- 런 결과 화면에 통계 표시

## Decision

### 런 통계 (stores/game.ts)

```typescript
interface RunStats {
  blindsCleared: number
  bestHand: number
  bestHandName: string
  totalMoneyEarned: number
}
```

- `runStats: ref<RunStats>` — 런 진행 중 누적
- `initRun()`: stats 초기화
- `playHand()`: bestHand 갱신
- 블라인드 클리어 시: blindsCleared++, totalMoneyEarned += earnings

### UI 변경

- won/lost 화면에 통계 표시 (도달 앤티, 클리어 블라인드, 최고 핸드, 총 수입, 보유 조커)
- 메인 메뉴 없이 즉시 게임 시작 (SPA 단일 페이지 유지)

## 현재 구현 상태

| 항목 | 상태 |
|---|---|
| 새 런 시작 시 모든 상태가 초기화된다 | ✅ 완료 (initRun) |
| 핸드 소진 + 목표 미달 시 게임 오버가 발생한다 | ✅ 완료 |
| 앤티 8 클리어 시 승리 화면이 표시된다 | ✅ 완료 |
| 런 결과 화면에 통계가 정확히 표시된다 | ✅ 완료 (blindsCleared, bestHand, totalMoneyEarned, jokers) |
| 런 결과 화면에서 새 런을 시작할 수 있다 | ✅ 완료 |

## Consequences

### 긍정적
- 런 결과에 대한 명확한 피드백
- 최고 핸드 등 통계로 성취감 제공

### 부정적
- 런 간 영속적 통계(전체 기록)는 F13에서 별도 구현 필요

## Alternatives Considered

- **전체 기록 시스템**: F13(저장)과 함께 구현 가능하나, 런 단위 통계만 먼저 구현
