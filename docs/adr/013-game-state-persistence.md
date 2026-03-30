# ADR-013: 게임 상태 저장 (F13)

- **Status**: Accepted
- **Date**: 2026-03-31
- **ALPS Feature**: F13 — 게임 상태 저장 (`specs/web-balatro.alps.md` Section 7.13)

## Context

플레이어가 브라우저를 닫아도 다음 방문 시 런을 이어서 플레이할 수 있어야 한다.

ALPS 요구사항:
- Browser LocalStorage에 자동 저장
- 저장 시점: 블라인드 시작, 블라인드 클리어, 상점 진입, 상점 퇴장
- 저장 데이터: 앤티/블라인드, 덱 상태, 조커, 자금, 핸드/디스카드 수, 런 통계
- "Continue" 버튼으로 이어하기
- 데이터 손상 시 새 런으로 시작

## Decision

### 저장 전략

Pinia store의 `$state`를 JSON으로 직렬화하여 localStorage에 저장. `composables/useSaveGame.ts`에서 save/load 로직 관리.

### 저장 키

- `web-balatro-save` — 런 상태 전체

### 저장 시점

store action 내에서 자동 호출:
- `startBlind()` — 블라인드 시작 직후
- `playHand()` — 블라인드 클리어 시 (round_end 진입)
- `openShop()` — 상점 진입 시
- `leaveShop()` — 상점 퇴장 시

### 게임 시작 흐름

1. `onMounted()` → localStorage에서 저장 데이터 확인
2. 저장 데이터 있음 → "Continue" + "New Run" 버튼 표시
3. 저장 데이터 없음 또는 손상 → 자동으로 새 런 시작
4. "New Run" 시 기존 저장 삭제

### GamePhase 확장

기존 phase에 `'menu'` 추가 — 시작 화면용.

## 현재 구현 상태

| 항목 | 상태 |
|---|---|
| 게임 진행 중 상태가 자동으로 저장된다 | ✅ 완료 (startBlind, round_end, openShop, leaveShop) |
| 브라우저 재방문 시 "Continue" 버튼이 활성화된다 | ✅ 완료 (menu phase) |
| 이어하기 시 마지막 저장 시점의 상태가 정확히 복원된다 | ✅ 완료 (continueRun) |
| 새 런 시작 시 기존 저장 데이터가 초기화된다 | ✅ 완료 (clearSave in initRun) |
| 저장 데이터가 손상된 경우 새 런으로 시작된다 | ✅ 완료 (try/catch + clearSave) |

## Consequences

### 긍정적
- 브라우저 닫아도 진행 보존
- localStorage는 추가 인프라 불필요

### 부정적
- playing 중간 저장은 하지 않음 (핸드 플레이 중 닫으면 블라인드 시작으로 복원)
- localStorage 5MB 제한 내에서 충분하지만, 대량 데이터 저장에는 부적합

## Alternatives Considered

- **IndexedDB**: 더 큰 용량이지만 런 상태 10~50KB 수준이므로 과도
- **서버 저장**: 백엔드 불필요한 SPA 컨셉에 맞지 않음
