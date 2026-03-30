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
1. Review/Create ADR → 2. Implement feature → 3. Build verification → 4. Debug if needed → 5. Sync ADR → 6. Commit
```

- **New feature**: You MUST read the relevant ADR first or create a new one before starting implementation. (See "ADR Workflow" section for details.)
- **Bug fix**: Identify root cause, fix, and verify build. No ADR update needed if there is no architectural change.
- **Before commit**: If implementation diverges from an ADR, you MUST update the ADR and the `docs/adr/README.md` index.
- **Rollback**: If build fails, `git stash` or `git checkout -- <file>` and retry in smaller increments. Never `git reset --hard` or force push without user confirmation.

## Architecture Decision Records

`docs/adr/` — Creating or updating ADRs is mandatory for new features and major changes.

### ADR Workflow

#### Before Implementation (Required)

1. **Check existing ADRs** — Read the `docs/adr/README.md` index and check if a related ADR exists
2. **Create or review ADR**
   - If no related ADR exists → Create a new ADR based on `docs/adr/TEMPLATE.md` (status: `Proposed`)
   - If a related ADR exists → Read it and verify the current implementation direction aligns
3. **Scope implementation to ADR** — Follow the Decision described in the ADR

#### After Implementation (Required)

1. **Sync ADR** — If implementation differs from the ADR, update it (change status to `Accepted`)
2. **Update README index** — Keep the `docs/adr/README.md` ADR list up to date
3. **Cascade updates** — If changes affect other ADRs, update those as well

#### When ADR is Not Required

The following changes can skip ADR creation/update:
- Simple bug fixes (no architectural change)
- Style/formatting changes
- Documentation typo fixes
- Dependency patch version updates

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
components/       # Vue components (PascalCase, e.g. GameCard.vue)
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
- **Components:** PascalCase (e.g. `GameCard.vue`)
- **Other files:** camelCase (e.g. `gameData.ts`)
- **Functions:** Prefer named exports

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
