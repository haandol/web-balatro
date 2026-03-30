# Web Balatro Project Guidelines

<project-overview>
  <description>
    Web Balatro is a mobile-friendly web clone of Balatro, the roguelike deck-building poker game. It recreates the addictive gameplay loop of hand evaluation, joker synergies, blind progression, and strategic deck customization in the browser.
  </description>

  <key-features>
    - **Poker Hand Play**: Play up to 5 cards to form poker hands and beat blind score thresholds
    - **Joker System**: Collect and manage jokers with passive/active bonuses and synergies
    - **Shop & Economy**: Purchase jokers, tarot/planet/spectral cards, vouchers, and booster packs
    - **Blind Progression**: Progress through Small, Big, and Boss Blinds across 8 antes
    - **Deck Building**: Enhance, destroy, and copy playing cards with tarot and spectral cards
    - **Score Calculation**: Chips x Mult system with left-to-right joker evaluation order
    - **Endless Mode**: Continue beyond Ante 8 for higher scores and rare rewards
  </key-features>

  <tech-stack>
    - **Framework**: Nuxt 4 (SPA, CSR only — no SSR/server interactions)
    - **Language**: TypeScript
    - **Package Manager**: pnpm
    - **Styling**: TailwindCSS (utility-first)
    - **State Management**: Pinia (Composition API setup store)
    - **Icons**: PrimeIcons
    - **Theme**: Dark green (#2d5a3a) + Gold accents (#ffd700), "Press_Start_2P" pixel font
  </tech-stack>

  <core-principles>
    - **Write clean, maintainable TypeScript code** with clear intent
    - **Use functional and declarative patterns** over imperative ones
    - **Follow DRY principles** through modularization
    - **Extract reusable logic** into composables
    - **Prioritize code clarity** over premature optimization
    - **Ensure complete implementation** (no TODOs or placeholders)
    - **Seek clarification** when requirements are unclear
    - **Follow consistent naming conventions** across the codebase
  </core-principles>
</project-overview>

<nuxt4-implementation>
  - **Use Composition API**: `<script lang="ts" setup>` for all components
  - **Leverage auto-imports** for Vue/Nuxt composables and components
  - **SPA mode**: SSR disabled (`ssr: false`) for client-side rendering only
  - **No server interactions**: All game logic runs client-side
  - **Use runtime config properly**: Client-side only via `useRuntimeConfig().public`
  - **Manage state** with Pinia (use `storeToRefs` for reactivity)
</nuxt4-implementation>

<components>
  <core-principles>
    - **Component files** must use PascalCase (e.g., `GameCard.vue`)
    - **Directory names** become part of the component name (see nested structure)
    - **Components are auto-imported** without explicit import statements
    - **Use either PascalCase or kebab-case** in templates (`<GameCard>` or `<game-card>`)
    - **Follow single responsibility principle** for component design
  </core-principles>

  <directory-structure>
    ```
    components/
      ├── card/              # Playing card components
      ├── game/              # Core game UI (board, hand area, score display)
      ├── joker/             # Joker card display and management
      ├── shop/              # Shop interface components
      ├── blind/             # Blind selection and boss blind display
      ├── consumable/        # Tarot, Planet, Spectral card components
      ├── deck/              # Deck viewer and management
      └── ui/                # Shared UI components (buttons, modals, etc.)
    ```
  </directory-structure>

  <naming-examples>
    ```
    components/
      ├── card/
      │   └── PlayingCard.vue        -> <CardPlayingCard/>
      ├── game/
      │   └── ScoreDisplay.vue       -> <GameScoreDisplay/>
      ├── joker/
      │   └── Slot.vue               -> <JokerSlot/>
      ├── shop/
      │   └── ItemCard.vue           -> <ShopItemCard/>
      ├── blind/
      │   └── BossInfo.vue           -> <BlindBossInfo/>
      └── consumable/
          └── TarotCard.vue          -> <ConsumableTarotCard/>
    ```
  </naming-examples>
</components>

<data-management>
  - **No server-side data fetching**: All data is client-side
  - **Static game data** (antes, suits, ranks, joker definitions) lives in `data/` directory
  - **Game state** managed entirely through Pinia stores
  - **Use proper TypeScript types** for all game entities
</data-management>

<state-management>
  - **Use Pinia** for global state management
  - **Maintain reactivity** with `storeToRefs`
  - **Use Composition API setup pattern** (`defineStore('name', () => {...})`)
  - **Follow modular store pattern** (one file per domain)
  - **Handle game state transitions** properly (blind → shop → blind)
</state-management>

<performance>
  - **Optimize component rendering** with proper key usage
  - **Minimize bundle size** through code splitting
  - **Follow Vue 3 and Nuxt 4 best practices**
  - **Optimize card animations** for mobile devices
  - **Use efficient card shuffling and dealing algorithms**
</performance>

<security>
  - **Validate game state transitions** to prevent illegal moves
  - **Use environment variables** for sensitive configuration
  - **No external API calls** — all game logic is self-contained
</security>

<design-consistency>
  - **Follow design system** from `design-system.md`
  - **Follow styling guidelines** from `styling.md`
  - **Use TailwindCSS `dark:` directives** for dark mode (never use `[data-theme="dark"]` or `:global(.dark)`)
  - **Dark green + gold accent** color scheme for casino/poker atmosphere
  - **Use Tailwind responsive classes** for simple show/hide; mobile-first approach
  - **Keep motion subtle** (120-200ms, ease-out) except for score celebration animations
  - **Prefer thin borders and light elevation** over heavy shadows
  - **Maintain consistent spacing** using Tailwind's spacing scale
</design-consistency>

<accessibility>
  - **Ensure proper color contrast** in both light and dark modes (WCAG AA)
  - **Implement keyboard navigation** for card selection and actions
  - **Use semantic HTML elements** appropriately
  - **Provide clear visual feedback** for card states (selected, debuffed, face-down)
  - **Maintain focus management** in modals and shop overlay
</accessibility>

<testing-and-quality>
  - **Write unit tests** for score calculation and hand evaluation logic
  - **Test responsive behavior** at mobile and desktop breakpoints
  - **Validate TypeScript types** are properly defined
  - **Test game state transitions** (blind progression, shop flow)
  - **Verify joker interaction ordering** (left-to-right evaluation)
</testing-and-quality>
