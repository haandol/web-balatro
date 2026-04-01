# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

프로젝트 구조, 아키텍처, 코딩 규칙 등 모든 상세 가이드는 AGENTS.md 파일을 참조하세요.

- [AGENTS.md](./AGENTS.md) — Project overview, tech stack, architecture, conventions
- [docs/specs/](./docs/specs/) — Game rules, mechanics specification, PRD documents
  - [research.md](./docs/specs/research.md) — Full Balatro game rules and mechanics research
  - [web-balatro.alps.md](./docs/specs/web-balatro.alps.md) — ALPS (MVP feature specification)
  - [phase1-prd.md](./docs/specs/phase1-prd.md) — Phase 1 PRD (core gameplay loop)
  - [phase2-prd.md](./docs/specs/phase2-prd.md) — Phase 2 PRD (card modifiers, consumables, vouchers)
- [CONTRIBUTING.md](./CONTRIBUTING.md) — Commit, branch, PR rules

## ALPS Feature 구현 규칙

ALPS Feature(F1~F13) 구현 시 반드시 아래 순서를 따릅니다:

1. `specs/web-balatro.alps.md`에서 해당 Feature 요구사항 확인
2. `docs/adr/`에 ADR을 **먼저 작성** (status: `Proposed`)
3. ADR 커밋 후 구현 코드 작성
4. 구현 완료 후 ADR status를 `Accepted`로 갱신

**ADR 없이 Feature 구현 코드를 작성하지 않습니다.** 상세 규칙은 [AGENTS.md](./AGENTS.md)의 "Architecture Decision Records" 섹션을 참조하세요.
