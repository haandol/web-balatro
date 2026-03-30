# Web Balatro Composables Guide

<overview>
  <description>
    Web Balatro composables are reusable logic modules leveraging Vue 3's Composition API. They orchestrate game interactions, manage UI behavior, and bridge user input to store actions. All composables are auto-imported in Nuxt 3.
  </description>

  <location>
    - Composables are located in: `composables/`
    - Naming convention: `use[Name].ts` (e.g., `useBalatroGame.ts`)
    - Game logic (pure functions) lives in `utils/`, not composables
    - Composables handle orchestration and side effects
  </location>

  <core-composables>
    Expected composables for the game:
    - `useBalatroGame.ts` — Main game orchestration (card selection, play/discard flow)
    - `useScoreAnimation.ts` — Score counting animation and display
    - `useCardSelection.ts` — Card selection state and validation (max 5 cards)
    - `useShop.ts` — Shop interaction logic (buy, sell, reroll)
    - `useBlindProgression.ts` — Blind advancement and boss blind effects
    - `useDeckViewer.ts` — Deck inspection and card browsing
    - `useJokerSlots.ts` — Joker reordering and slot management
    - `useConsumables.ts` — Tarot/Planet/Spectral card usage
    - `useGamePhase.ts` — Phase transitions (blind selection → play → shop)
  </core-composables>
</overview>

<usage>
  - **Use TypeScript** with `<script lang="ts" setup>` and the Composition API
  - **Auto-imported in Nuxt 3**, no need for manual imports
  - **Prefix composable files** with `use` (e.g., `useBalatroGame.ts`)
  - **Keep composables focused**: one responsibility per composable
  - **Orchestrate, don't calculate**: Composables call store actions and pure util functions

  **Example composable structure:**
  ```typescript
  /**
   * Composable for card selection in the player's hand
   */
  export const useCardSelection = () => {
    const gameStore = useGameStore()
    const { hand, selectedCards } = storeToRefs(gameStore)

    const maxSelection = 5

    const toggleCard = (cardId: string) => {
      if (selectedCards.value.includes(cardId)) {
        gameStore.deselectCard(cardId)
      } else if (selectedCards.value.length < maxSelection) {
        gameStore.selectCard(cardId)
      }
    }

    const canPlay = computed(() => selectedCards.value.length > 0)
    const canDiscard = computed(() =>
      selectedCards.value.length > 0 && gameStore.discardsRemaining > 0
    )

    return {
      hand: readonly(hand),
      selectedCards: readonly(selectedCards),
      toggleCard,
      canPlay,
      canDiscard,
    }
  }
  ```

  **Example component usage:**
  ```typescript
  const { hand, selectedCards, toggleCard, canPlay, canDiscard } = useCardSelection()
  ```
</usage>

<data-flow>
  The data flow follows the pattern defined in AGENTS.md:

  1. **User input** (card selection, Play/Discard) → `useBalatroGame()` composable
  2. **Composable** → `useGameStore()` action calls
  3. **Score calculation**: `evaluateHand()` → `calculateScore()` (pure functions in `utils/poker.ts`)
  4. **Store state update** → component reactive rendering via `storeToRefs`

  ```
  Component → Composable → Store Action → Pure Util Function
                                        → State Update → Component Re-render
  ```
</data-flow>

<patterns>
  - **Return reactive state and functions** from composables
  - **Use composables for:**
    - Game interaction orchestration (play hand, discard, shop transactions)
    - UI state management (card selection, animations, modals)
    - Phase transitions (blind → play → shop)
    - Joker slot reordering
  - **Provide readonly state** when appropriate to prevent external mutations
  - **Call store actions** for state changes, not direct state mutation
  - **Call util functions** for pure calculations (hand evaluation, score math)
</patterns>

<best-practices>
  - **Keep composables pure of game math** — delegate to `utils/` functions
  - **Use TypeScript** for type safety with proper interfaces from `types/`
  - **Avoid duplicating logic** between composables and stores
  - **Handle cleanup** properly with `onUnmounted` when needed (e.g., animation timers)
  - **Follow single responsibility principle** — one composable per interaction domain
  - **Do not include Tailwind classes or CSS concerns** in composables
</best-practices>

<separation-of-concerns>
  **Composables** (orchestration + side effects):
  - User interaction handling
  - Coordinating store actions
  - Animation triggers
  - Phase/flow management

  **Stores** (state + business rules):
  - Game state (deck, hand, jokers, money, blind)
  - State mutations
  - Persistence

  **Utils** (pure functions):
  - Hand evaluation (`evaluateHand()`)
  - Score calculation (`calculateScore()`)
  - Deck operations (shuffle, draw, deal)
  - Poker hand detection logic

  ```typescript
  // Composable orchestrates the flow
  const playHand = async () => {
    const cards = selectedCards.value
    const hand = evaluateHand(cards)           // utils/poker.ts
    const score = calculateScore(hand, jokers) // utils/poker.ts
    gameStore.applyScore(score)                // stores/game.ts
    await animateScore(score)                  // composable animation
  }
  ```
</separation-of-concerns>
