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

## 작성 규칙

- **ALPS Feature(F1~F13) 구현 시 ADR을 먼저 작성한 뒤 코드를 작성한다**
- 1 Feature = 1 ADR (ALPS Feature ID를 제목에 포함)
- 파일명: `NNN-short-title.md` (예: `001-deck-initialization-and-management.md`)
- 제목: `ADR-NNN: 한글 제목 (Feature ID)` (예: `ADR-001: 덱 초기화 및 관리 (F1)`)
- 템플릿: [TEMPLATE.md](./TEMPLATE.md)
- 상태: `Proposed` → `Accepted` → `Deprecated` / `Superseded`
- ALPS 사양: [`specs/web-balatro.alps.md`](../../specs/web-balatro.alps.md)
