# Web Balatro

A mobile-friendly web clone of [Balatro](https://www.playbalatro.com/), the roguelike deck-building poker game. Recreates the addictive gameplay loop of hand evaluation, joker synergies, and blind progression in the browser.

## Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/) (SPA, CSR only)
- **Language**: TypeScript
- **Styling**: [TailwindCSS](https://tailwindcss.com/) v4
- **State Management**: [Pinia](https://pinia.vuejs.org/) (Composition API)
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 24+
- pnpm

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Static Site Generation

```bash
pnpm generate
```

### Lint & Format

```bash
pnpm lint        # ESLint check
pnpm lint:fix    # ESLint auto-fix
pnpm format      # Prettier format
```

## Project Structure

```
components/       # Vue components (PascalCase)
composables/      # Composables (use[Name])
stores/           # Pinia stores (Composition API setup)
pages/            # Page components
types/            # TypeScript interfaces
utils/            # Domain logic — pure functions
data/             # Static game data (antes, suits, ranks)
docs/adr/         # Architecture Decision Records
specs/            # ALPS product specification
```

## Features

| ID  | Feature                        |
| --- | ------------------------------ |
| F1  | Deck Initialization & Management |
| F2  | Hand Play                      |
| F3  | Card Discard                   |
| F4  | Poker Hand Recognition         |
| F5  | Score Calculation Engine        |
| F6  | Blind Progression              |
| F7  | Joker System                   |
| F8  | Boss Blind Modifiers           |
| F9  | Economy System                 |
| F10 | Shop System                    |
| F11 | Blind Skip with Tag Rewards    |
| F12 | Run Statistics Tracking        |
| F13 | Game State Persistence         |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for commit conventions, branch strategy, and PR guidelines.

## License

This project is for educational purposes only. Balatro is a trademark of [LocalThunk](https://www.playbalatro.com/).
