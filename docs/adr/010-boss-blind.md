# ADR-010: 보스 블라인드 (F8)

- **Status**: Accepted
- **Date**: 2026-03-31
- **ALPS Feature**: F8 — 보스 블라인드 (`specs/web-balatro.alps.md` Section 7.8)

## Context

각 앤티의 보스 블라인드에서 고유 수정자 효과를 적용하여 전략적 도전을 제공해야 한다. 현재 보스 블라인드는 일반 블라인드와 동일하게 2x 배수만 적용되며 특수 효과가 없다.

ALPS 요구사항:
- MVP 보스 풀 10~15종 (카드 디버프, 핸드 제한, 점수 수정 등)
- 디버프된 카드: 점수 기여 없음 + 시각적 구분 (반투명)
- 앤티별 무작위 보스 선택 (런 내 중복 방지)
- 블라인드 선택 화면에서 보스 수정자 미리 표시
- 라운드 시작 시 활성화, 종료 시 해제

## Decision

### 보스 블라인드 데이터 (data/bossBlinds.ts)

MVP 8종으로 시작:

```typescript
interface BossBlind {
  id: string
  name: string
  description: string
  modifier: BossModifier
}

type BossModifier =
  | { type: 'debuff_suit'; suit: Suit }       // 해당 슈트 카드 디버프
  | { type: 'debuff_face' }                    // 페이스 카드(J/Q/K) 디버프
  | { type: 'force_hand_size'; size: number }  // N장 필수 플레이
  | { type: 'no_discards' }                    // 디스카드 0으로 시작
  | { type: 'base_multiplied'; factor: number }// 기본 목표 점수 N배
```

| 이름 | 수정자 | 설명 |
|---|---|---|
| The Club | debuff_suit(clubs) | 클럽 카드 디버프 |
| The Goad | debuff_suit(spades) | 스페이드 카드 디버프 |
| The Window | debuff_suit(diamonds) | 다이아몬드 카드 디버프 |
| The Head | debuff_suit(hearts) | 하트 카드 디버프 |
| The Plant | debuff_face | 페이스 카드 디버프 |
| The Psychic | force_hand_size(5) | 5장 필수 |
| The Water | no_discards | 디스카드 0 |
| The Wall | base_multiplied(2) | 기본 점수 2배 |

### 보스 선택 로직 (stores/game.ts)

- `currentBoss: ref<BossBlind | null>(null)` — 현재 보스 (boss 블라인드 시에만 설정)
- `usedBosses: ref<string[]>([])` — 런 내 사용된 보스 ID (중복 방지)
- 앤티 시작 시 보스 풀에서 미사용 보스 무작위 선택
- `initRun()` 시 usedBosses 초기화

### 디버프 적용 (utils/poker.ts)

- `calculateScore()` 확장: scoringCards에서 디버프 카드를 제외하여 칩 기여 차단
- 디버프 판정 함수: `isDebuffed(card, modifier): boolean`

### UI 변경

- 블라인드 선택 화면: 보스 블라인드일 때 보스 이름 + 수정자 설명 표시
- 플레이 화면: 디버프된 카드 반투명(opacity-40) 처리
- `force_hand_size`: 해당 장수가 아니면 Play Hand 비활성화
- `no_discards`: 디스카드 0으로 시작
- `base_multiplied`: targetScore에 factor 추가 곱

## 현재 구현 상태

| 항목 | 상태 |
|---|---|
| 보스 블라인드마다 고유 수정자가 적용된다 | ✅ 완료 |
| 디버프된 카드가 시각적으로 구분된다 | ✅ 완료 (opacity-40 + grayscale) |
| 디버프된 카드는 점수에 기여하지 않는다 | ✅ 완료 (calculateScore에서 필터링) |
| 보스 블라인드 수정자가 블라인드 선택 화면에서 미리 표시된다 | ✅ 완료 |
| 보스 블라인드 클리어 시 $5 보상이 지급된다 | ✅ 완료 (BLIND_REWARDS.boss = 5) |
| 앤티별 무작위 보스 선택 (런 내 중복 방지) | ✅ 완료 (usedBossIds) |

## Consequences

### 긍정적
- 보스별 고유 수정자로 매 앤티마다 다른 전략 요구
- 디버프 시스템으로 카드 구성의 중요성 증가
- 런 내 중복 방지로 다양한 보스 경험 보장

### 부정적
- The Arm(핸드 레벨 -1)은 핸드 레벨 시스템 미구현으로 제외
- The Flint(칩/승수 절반)은 halve_score로 간략화
- The Needle(1핸드만)은 MVP에서 제외 — 너무 극단적

## Alternatives Considered

- **전체 15종 한번에**: 범위가 커지므로 8종으로 시작
- **보스 없이 배수만 적용**: 전략적 깊이 부족, 원작의 핵심 요소 누락
