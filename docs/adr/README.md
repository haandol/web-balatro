# Architecture Decision Records

이 디렉토리는 프로젝트의 주요 아키텍처 결정을 기록합니다.

## ADR 목록

| # | 제목 | 상태 | 날짜 |
|---|------|------|------|
| [001](./001-deck-initialization-and-management.md) | 덱 초기화 및 관리 (F1) | Accepted | 2026-03-31 |
| [002](./002-hand-play.md) | 핸드 플레이 (F2) | Accepted | 2026-03-31 |
| [003](./003-card-discard.md) | 카드 버리기 (F3) | Accepted | 2026-03-31 |
| [004](./004-poker-hand-recognition.md) | 표준 포커 핸드 인식 (F4) | Accepted | 2026-03-31 |
| [005](./005-score-calculation-engine.md) | 점수 계산 엔진 (F5) | Accepted | 2026-03-31 |
| [006](./006-blind-progression.md) | 블라인드 진행 (F7) | Accepted | 2026-03-31 |
| [007](./007-joker-system.md) | 조커 시스템 (F6) | Accepted | 2026-03-31 |
| [008](./008-economy-system.md) | 경제 시스템 (F10) | Accepted | 2026-03-31 |
| [009](./009-shop-system.md) | 상점 시스템 (F9) | Accepted | 2026-03-31 |
| [010](./010-boss-blind.md) | 보스 블라인드 (F8) | Accepted | 2026-03-31 |
| [011](./011-blind-skip.md) | 블라인드 스킵 (F11) | Accepted | 2026-03-31 |
| [012](./012-run-management.md) | 런 관리 (F12) | Accepted | 2026-03-31 |
| [013](./013-game-state-persistence.md) | 게임 상태 저장 (F13) | Accepted | 2026-03-31 |
| [014](./014-card-modifier-system.md) | 카드 수정자 시스템 (F14) | Accepted | 2026-04-01 |
| [015](./015-consumable-slot-management.md) | 소모품 슬롯 관리 (F15) | Accepted | 2026-04-01 |
| [016](./016-planet-cards.md) | 플래닛 카드 (F17) | Accepted | 2026-04-01 |
| [017](./017-spectral-cards.md) | 스펙트럴 카드 (F18) | Accepted | 2026-04-01 |
| [018](./018-booster-packs.md) | 확장 부스터 팩 (F20) | Accepted | 2026-04-01 |
| [019](./019-score-calculation-expansion.md) | 점수 계산 엔진 확장 (F21) | Accepted | 2026-04-01 |
| [020](./020-tarot-cards.md) | 타로 카드 (F16) | Accepted | 2026-04-01 |
| [021](./021-vouchers.md) | 바우처 시스템 (F19) | Accepted | 2026-04-01 |
| [022](./022-joker-sell-confirmation.md) | 상점 조커 판매 확인 UI | Accepted | 2026-04-01 |

## 작성 규칙

- **ALPS Feature(F1~F13) 구현 시 ADR을 먼저 작성한 뒤 코드를 작성한다**
- 1 Feature = 1 ADR (ALPS Feature ID를 제목에 포함)
- 파일명: `NNN-short-title.md` (예: `001-deck-initialization-and-management.md`)
- 제목: `ADR-NNN: 한글 제목 (Feature ID)` (예: `ADR-001: 덱 초기화 및 관리 (F1)`)
- 템플릿: [TEMPLATE.md](./TEMPLATE.md)
- 상태: `Proposed` → `Accepted` → `Deprecated` / `Superseded`
- ALPS 사양: [`specs/web-balatro.alps.md`](../../specs/web-balatro.alps.md)
