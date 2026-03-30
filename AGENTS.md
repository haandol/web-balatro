# AGENTS.md

## Sub-Agent Bootstrap

> **Read this section first when delegated a task from the main orchestrator agent.**

You are working on the **web-balatro** project — a Balatro web game clone.

### Context Setup

1. This is a **Nuxt 4 SPA** (CSR only, no SSR/server interactions) with **TypeScript**, **TailwindCSS**, and **Pinia**.
2. Game rules and mechanics are documented in [SPEC.md](./SPEC.md) — read it before implementing game logic.

### Verification (run before reporting back)

```bash
npx eslint --fix <changed-files>     # lint + auto-fix
npx prettier --write <changed-files> # format
pnpm build                           # verify build
```

### Constraints

- Use Vue 3 Composition API with `<script setup lang="ts">`.
- Pinia stores must use Composition API setup pattern (`defineStore('name', () => {...})`).
- Separate game logic (pure functions) in `utils/`, orchestration in `composables/`, state in `stores/`.
- Mobile-first responsive design with `md:` breakpoint (768px) for layout transitions.
- Use `dark:` directive for dark mode. Never use `[data-theme="dark"]` or `:global(.dark)`.
- Always run lint and format on changed files before committing.

---

## Project Overview

A mobile-friendly web clone of Balatro, the roguelike deck-building poker game. Recreates the addictive gameplay loop of hand evaluation, joker synergies, and blind progression in the browser.

### Tech Stack

- **Framework**: Nuxt 4 (SPA, CSR only) | **Language**: TypeScript
- **Styling**: TailwindCSS (utility-first) | **Theme**: Dark green (#2d5a3a) + Gold accents (#ffd700), "Press_Start_2P" pixel font
- **State**: Pinia (Composition API setup store) | **Package Manager**: pnpm
- **Icons**: PrimeIcons

## Quick Start

```bash
pnpm install      # Install dependencies
pnpm dev          # Development server
pnpm build        # Production build
pnpm generate     # Static site generation
```

## Agent Work Protocol

### Development Cycle

```
1. ALPS Feature 확인 → 2. ADR 작성 (Proposed) → 3. Implement → 4. Verify (lint/format/build) → 5. ADR 갱신 (Accepted) → 6. Commit
```

- **ALPS Feature 구현 시 (F1~F13)**: 반드시 `specs/web-balatro.alps.md`에서 해당 Feature의 요구사항을 읽고, ADR을 **먼저** 작성한 뒤 구현을 시작한다. ADR 없이 Feature 구현 코드를 작성하지 않는다.
- **ADR 작성**: ALPS Feature ID를 ADR 제목과 파일명에 포함한다 (예: `002-hand-play.md`, 제목: `ADR-002: 핸드 플레이 (F2)`). ALPS의 User Story, Technical Description, Acceptance Criteria를 ADR의 Context와 Decision에 반영한다.
- **Bug fix**: 근본 원인 파악 → 수정 → 빌드 검증. 아키텍처 변경이 없으면 ADR 불필요.
- **Before commit**: 구현이 ADR과 다르면 반드시 ADR을 갱신하고 `docs/adr/README.md` 인덱스를 업데이트한다.
- **Rollback**: 빌드 실패 시 `git stash` 또는 `git checkout -- <file>`로 되돌리고 작은 단위로 재시도. 사용자 확인 없이 `git reset --hard`나 force push 금지.

## Architecture Decision Records

`docs/adr/` — ALPS Feature(F1~F13) 구현 시 ADR 선행 작성이 **필수**이다.

### ALPS Feature → ADR 매핑 규칙

1. **1 Feature = 1 ADR**: ALPS의 각 Feature ID(F1~F13)는 하나의 ADR에 대응한다.
2. **파일명**: `NNN-short-title.md` (예: `001-deck-initialization-and-management.md`)
3. **제목**: `ADR-NNN: 한글 제목 (Feature ID)` (예: `ADR-001: 덱 초기화 및 관리 (F1)`)
4. **ALPS 연동**: ADR의 Context 섹션에 ALPS Feature의 User Story와 Technical Description을 요약하고, Acceptance Criteria를 "현재 구현 상태" 표에 포함한다.

### ADR Workflow

#### Before Implementation (Required — 코드 작성 전 반드시 완료)

1. **ALPS Feature 확인** — `specs/web-balatro.alps.md`에서 구현할 Feature의 요구사항, Acceptance Criteria를 읽는다
2. **기존 ADR 확인** — `docs/adr/README.md` 인덱스에서 관련 ADR이 이미 있는지 확인
3. **ADR 작성/갱신**
   - ADR이 없으면 → `docs/adr/TEMPLATE.md` 기반으로 새 ADR 작성 (status: `Proposed`)
   - ADR이 있으면 → 현재 구현 방향이 ADR과 일치하는지 검토
4. **ADR 커밋** — ADR을 먼저 커밋한 뒤 구현 코드를 작성한다 (별도 커밋 권장)

#### After Implementation (Required)

1. **ADR 갱신** — 구현이 완료되면 status를 `Accepted`로 변경하고, "현재 구현 상태" 표를 업데이트
2. **README 인덱스 갱신** — `docs/adr/README.md` 목록을 최신 상태로 유지
3. **연쇄 갱신** — 다른 ADR에 영향을 미치면 해당 ADR도 함께 업데이트

#### When ADR is Not Required

- 단순 버그 수정 (아키텍처 변경 없음)
- 스타일/포매팅 변경
- 문서 오탈자 수정
- 의존성 패치 버전 업데이트

## Code Style & Architecture

### Core Principles

- Focus on one feature/bug at a time
- Break large changes into atomic commits (see [CONTRIBUTING.md](./CONTRIBUTING.md))
- Code must be buildable and pass lint at session end
- Write descriptive commit messages so the next session can understand progress from `git log` alone
- Prefer early return: handle errors and edge cases first, then proceed with the main logic at minimal indentation depth
- Write clean, maintainable TypeScript code with clear intent
- Prefer functional and declarative patterns over imperative ones
- Follow the DRY principle through modularization
- Extract reusable logic into composables
- Prioritize code clarity over premature optimization
- Prefer interfaces for object shapes; use type aliases for unions and utility types

### Directory Structure

```
components/       # Vue components (PascalCase, e.g. card/Playing.vue → <CardPlaying>)
composables/      # Composables (use[Name], e.g. useBalatroGame.ts)
stores/           # Pinia stores (camelCase, e.g. game.ts)
pages/            # Page components
layouts/          # Layout components
types/            # TypeScript interfaces
utils/            # Domain logic — pure functions
data/             # Static game data (antes, suits, ranks)
```

### Naming Standards

- **Composables:** `use[Name]` (e.g. `useBalatroGame`)
- **Components:** PascalCase (e.g. `Playing.vue`)
- **Other files:** camelCase (e.g. `gameData.ts`)
- **Functions:** Prefer named exports

### Component Auto-Import Convention (Nuxt)

Nuxt는 `components/` 하위의 폴더명 + 파일명을 결합하여 컴포넌트를 자동 등록한다. **파일명에 폴더명을 중복하지 않는다.**

```
✅ components/card/Playing.vue    → <CardPlaying>
✅ components/joker/Card.vue      → <JokerCard>
✅ components/joker/Slots.vue     → <JokerSlots>

❌ components/joker/JokerCard.vue → <JokerCard> (동작하지만 폴더명 중복)
❌ components/card/CardItem.vue   → <CardItem>  (Card 폴더가 이미 prefix)
```

**규칙:** `components/{폴더}/{파일}.vue` → `<{폴더}{파일}>`으로 사용. 폴더명이 이미 prefix 역할을 하므로 파일명에 반복하지 않는다.

### UI Development

- **Template:** Use layout-focused Tailwind classes (`flex`, `grid`, `overflow`, `position`).
- **Style:** Use visual Tailwind classes (colors, dimensions, spacing).
- **Icons:** Use PrimeIcons (e.g. `<i class="pi pi-wallet mr-1"></i>`).
- Ensure responsive design (mobile-first approach).

### State Management

- Use Pinia for global state management.
- Maintain reactivity with `storeToRefs`.
- Use Composition API setup pattern.

### Data Flow

1. User input (card selection, Play/Discard) → `useBalatroGame()` composable
2. Composable → `useGameStore()` action calls
3. Score calculation: `evaluateHand()` → `calculateScore()` (pure functions in `utils/poker.ts`)
4. Store state update → component reactive rendering via `storeToRefs`

### Score Calculation

Score = (base chips + card chips + joker chips) x (base mult + joker added mult) x (joker multiplied mult)

- Jokers are applied **left-to-right**. Place +Mult jokers to the left of xMult jokers for optimal scoring.
- See `calculateScore()` in `utils/poker.ts`.

## Common Mistakes to Avoid

- Deep nesting with if/else — prefer early return for error/edge cases to keep the main logic at minimal indentation
- Score calculation order errors — must follow: sum chips → sum mult → apply xMult, in that exact order
- Store `fetch*` that only returns without saving to state — `find*` calls after prefetch will fail

## Approach with Caution

`nuxt.config.ts`, score calculation logic in `utils/poker.ts`, game state structure in `stores/game.ts`.

## Documentation Maintenance

- ADR required for new/major features → create/update in `docs/adr/`
- Keep ADR index (`docs/adr/README.md`) in sync — always update the index table when adding/modifying ADRs
- Update this AGENTS.md when adding major features or changing project structure
