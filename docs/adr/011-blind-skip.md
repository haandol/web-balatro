# ADR-011: 블라인드 스킵 (F11)

- **Status**: Accepted
- **Date**: 2026-03-31
- **ALPS Feature**: F11 — 블라인드 스킵 (`specs/web-balatro.alps.md` Section 7.11)

## Context

플레이어가 스몰/빅 블라인드를 스킵하여 태그 보상을 얻는 대신 블라인드 클리어 보상을 포기하는 전략적 선택을 제공해야 한다. 보스 블라인드는 스킵 불가.

ALPS 요구사항:
- 스몰/빅 블라인드만 스킵 가능 (보스 불가)
- 스킵 시 무작위 태그 보상 (MVP: 자금 태그 위주)
- 트레이드오프: 블라인드 보상($3~$4) + 남은 핸드 보너스 포기

## Decision

### 태그 데이터 (data/tags.ts)

MVP에서는 간단한 자금 보상 태그로 구현:

```typescript
interface Tag {
  id: string
  name: string
  description: string
  reward: TagReward
}

type TagReward =
  | { type: 'money'; amount: number }
  | { type: 'free_reroll'; count: number }
```

| 이름 | 보상 | 설명 |
|---|---|---|
| Economy Tag | money(5) | $5 획득 |
| Handy Tag | money(8) | $8 획득 |
| Speed Tag | free_reroll(1) | 다음 상점 무료 리롤 1회 |
| Investment Tag | money(10) | $10 획득 |

### 스킵 로직 (stores/game.ts)

- `skipBlind()`: 스몰/빅 블라인드에서만 호출 가능
- 무작위 태그 선택 → 보상 적용 → `advanceBlind()` 호출
- `lastSkipTag: ref<Tag | null>` — UI에서 스킵 보상 표시용

### UI 변경

- 블라인드 선택 화면: 스몰/빅 블라인드일 때 "Skip" 버튼 표시
- 보스 블라인드에서는 Skip 버튼 숨김
- 스킵 시 태그 이름 + 보상 잠시 표시 후 다음 블라인드로 전환

## 현재 구현 상태

| 항목 | 상태 |
|---|---|
| 스몰/빅 블라인드에서 스킵 옵션이 표시된다 | ✅ 완료 |
| 보스 블라인드에서는 스킵이 불가능하다 | ✅ 완료 (Skip 버튼 숨김 + guard) |
| 스킵 시 태그 보상이 지급된다 | ✅ 완료 (4종 태그) |
| 스킵 시 블라인드 클리어 보상은 지급되지 않는다 | ✅ 완료 |
| 스킵 후 다음 블라인드로 정상 진행된다 | ✅ 완료 (advanceBlind 호출) |

## Consequences

### 긍정적
- 전략적 선택 추가: 보상 포기 vs 태그 보상
- 경제 시스템에 변동성 부여

### 부정적
- MVP 태그 종류가 제한적 (자금 위주)
- free_reroll 태그는 상점 시스템과 연동 필요

## Alternatives Considered

- **태그 없이 단순 스킵**: 전략적 의미 없음
- **복잡한 태그 시스템**: MVP 범위 초과, 자금 보상 위주로 시작
