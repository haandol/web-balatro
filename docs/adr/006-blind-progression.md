# ADR-006: 블라인드 진행 (F7)

- **Status**: Proposed
- **Date**: 2026-03-31
- **ALPS Feature**: F7 — 블라인드 진행 (`specs/web-balatro.alps.md` Section 7.7)

## Context

앤티 1~8까지 스몰/빅/보스 블라인드를 순차적으로 진행하며, 점수 임계값이 점진적으로 상승하는 게임 루프가 필요하다. 현재는 targetScore가 300 고정이고, 블라인드 클리어 후 다음 라운드로 이어지지 않는다.

ALPS 요구사항:
- 8개 앤티, 각 앤티에 스몰/빅/보스 블라인드 = 총 24 블라인드
- 앤티별 기본 점수에 블라인드 배수 적용 (스몰 1x, 빅 1.5x, 보스 2x)
- 앤티 1(300) → 앤티 8(지수적 증가)
- 블라인드 시작 시 핸드/디스카드 수 초기화, 덱 리셔플, 카드 드로우
- 블라인드 클리어 시 보상 지급 (F10 경제 시스템 연동 전까지 간략화)

## Decision

### 앤티/블라인드 데이터 (data/blinds.ts)

```typescript
ANTE_BASE_SCORES = [300, 800, 2000, 5000, 11000, 20000, 35000, 50000]
BLIND_MULTIPLIERS = { small: 1, big: 1.5, boss: 2 }
BlindType = 'small' | 'big' | 'boss'
```

### 게임 상태 확장 (stores/game.ts)

- **State 추가**:
  - `currentAnte: ref(1)` — 현재 앤티 (1~8)
  - `currentBlind: ref<BlindType>('small')` — 현재 블라인드
  - `gamePhase` 확장: `'blind_select' | 'playing' | 'round_end' | 'won' | 'lost'`
    - `blind_select`: 블라인드 선택 화면 (스몰/빅 스킵 가능 — F11에서 구현)
    - `playing`: 핸드 플레이 중
    - `round_end`: 블라인드 클리어 후 보상 표시 (상점 전환 전)
    - `won`: 앤티 8 보스 블라인드 클리어
    - `lost`: 핸드 소진 + 목표 미달

- **Actions 추가**:
  - `startBlind()`: 현재 앤티/블라인드의 targetScore 계산, 핸드/디스카드 초기화, 덱 리셔플+드로우, gamePhase='playing'
  - `advanceBlind()`: round_end → 다음 블라인드로 이동 (small→big→boss→다음 앤티 small). 앤티 8 보스 클리어 시 'won'

- **playHand 수정**: 블라인드 클리어 시 gamePhase='round_end' (바로 'won'이 아님, 앤티 8 보스만 'won')

### UI 변경 (pages/index.vue)

- 블라인드 선택 화면: 현재 앤티 + 3개 블라인드 목표 점수 표시, "Play" 버튼으로 블라인드 시작
- 라운드 종료 화면: 클리어 보상 표시, "Continue" 버튼으로 다음 블라인드로 이동
- 헤더에 현재 앤티/블라인드 표시

## 현재 구현 상태

| 항목 | 상태 |
|---|---|
| 앤티 1~8 24개 블라인드 순차 진행 | ❌ 미구현 |
| 각 블라인드 목표 점수 정확히 표시 | ❌ 미구현 (300 고정) |
| 앤티 증가에 따라 목표 점수 상승 | ❌ 미구현 |
| 블라인드 시작 시 핸드/디스카드 초기화 | ❌ 미구현 |
| 블라인드 클리어 시 보상 지급 | ❌ 미구현 |

## Consequences

### 긍정적
- 게임 루프 완성 (블라인드 선택 → 플레이 → 보상 → 다음 블라인드)
- 앤티 8 클리어 시 승리 조건 구현으로 완전한 런 플레이 가능

### 부정적
- 보스 블라인드 수정자(F8) 미구현 — 보스도 일반 블라인드처럼 동작
- 상점(F9)/경제(F10) 미연동 — 보상은 표시만, 실제 자금 관리 없음

## Alternatives Considered

- **F10(경제 시스템) 동시 구현**: 보상/자금 관리까지 함께 구현. 범위가 커지므로 F7에서는 블라인드 루프만, 보상은 간략화
