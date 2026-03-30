# Web Balatro Store (Pinia) Guide

<overview>
  <description>
    Web Balatro uses Pinia for global state management. Each game domain has its own store module for modularity. Stores are written in TypeScript using the Composition API setup pattern (`defineStore('name', () => {...})`).
  </description>

  <location>
    - Store files are located in: `stores/`
    - Naming convention: camelCase (e.g., `game.ts`)
    - Access via auto-imported composables (e.g., `useGameStore()`)
  </location>

  <core-stores>
    Expected stores for the game:
    - `game.ts` — Core game state (deck, hand, jokers, money, blind, phase)
    - `score.ts` — Score calculation state, chips/mult tracking, hand levels
    - `shop.ts` — Shop inventory, reroll state, booster packs
    - `run.ts` — Run-level state (ante progression, endless mode, run seed)
  </core-stores>
</overview>

<usage>
  - Define each store using `defineStore` with Composition API setup pattern
  - Use TypeScript with proper type definitions from `types/`
  - Access stores via auto-imported composables (e.g., `const gameStore = useGameStore()`)
  - Use `storeToRefs` for reactivity in components

  **Example store structure:**
  ```typescript
  export const useGameStore = defineStore('game', () => {
    // State
    const deck = ref<PlayingCard[]>([])
    const hand = ref<PlayingCard[]>([])
    const jokers = ref<Joker[]>([])
    const money = ref(4)
    const handsRemaining = ref(4)
    const discardsRemaining = ref(3)
    const selectedCards = ref<string[]>([])

    // Getters
    const handSize = computed(() => hand.value.length)
    const interest = computed(() => Math.min(Math.floor(money.value / 5), 5))

    // Actions
    const selectCard = (cardId: string) => {
      if (selectedCards.value.length < 5) {
        selectedCards.value.push(cardId)
      }
    }

    const deselectCard = (cardId: string) => {
      selectedCards.value = selectedCards.value.filter(id => id !== cardId)
    }

    const playHand = () => {
      handsRemaining.value--
      // ... hand evaluation and scoring
    }

    const discardCards = () => {
      discardsRemaining.value--
      // ... discard selected cards and draw new ones
    }

    return {
      // State
      deck, hand, jokers, money,
      handsRemaining, discardsRemaining, selectedCards,
      // Getters
      handSize, interest,
      // Actions
      selectCard, deselectCard, playHand, discardCards,
    }
  })
  ```

  **Example component usage:**
  ```typescript
  const gameStore = useGameStore()
  const { hand, money, handsRemaining } = storeToRefs(gameStore)

  gameStore.playHand()
  ```
</usage>

<game-state-model>
  **Key state entities:**

  ```typescript
  // Deck & Cards
  deck: PlayingCard[]           // Full deck of cards
  hand: PlayingCard[]           // Current hand (up to 8 cards)
  selectedCards: string[]       // IDs of selected cards (up to 5)
  discardPile: PlayingCard[]    // Discarded cards

  // Jokers & Consumables
  jokers: Joker[]               // Active joker slots (up to 5+)
  consumables: Consumable[]     // Tarot/Planet/Spectral cards (up to 2 slots)

  // Resources
  money: number                 // Current dollars
  handsRemaining: number        // Hands left this round
  discardsRemaining: number     // Discards left this round

  // Progression
  currentAnte: number           // Current ante (1-8+)
  currentBlind: 'small' | 'big' | 'boss'
  blindTarget: number           // Score needed to beat current blind
  currentScore: number          // Score accumulated this round

  // Hand Levels
  handLevels: Record<PokerHandType, { chips: number, mult: number, level: number }>

  // Run Meta
  phase: 'blind-select' | 'playing' | 'shop'
  vouchers: Voucher[]           // Active vouchers for this run
  ```
</game-state-model>

<patterns>
  - **Modularize stores by domain** (one file per domain)
  - **Export state, getters, and actions** from each store
  - **Use stores for global/shared state**, not for local component state
  - **Follow naming convention**: `use<Domain>Store` (e.g., `useGameStore`)
  - **Use computed properties** for derived state (getters)
  - **Keep score calculation in utils** — stores call `calculateScore()` from `utils/poker.ts`
</patterns>

<best-practices>
  - **Keep store logic focused** on state management and business rules
  - **Extract pure game logic** into `utils/` (hand evaluation, score math)
  - **Extract orchestration** into `composables/` (user interaction flows)
  - **Avoid direct DOM manipulation** in stores
  - **Use TypeScript** for all stores with proper type definitions
  - **Handle game state transitions** carefully (blind → shop → blind)
  - **fetch 함수는 반드시 store 상태를 갱신해야 한다** — `fetch*` 이름의 action이 데이터를 가져온 후 반환만 하고 store state에 저장하지 않으면, 후속 `find*` 호출이 실패하는 버그가 발생한다. 데이터를 store에 저장하지 않고 반환만 하려면 `get`/`load` 등 다른 네이밍을 사용한다.
</best-practices>

<score-calculation>
  Score calculation follows the order defined in AGENTS.md:

  ```
  Score = (base chips + card chips + joker chips) x (base mult + joker added mult) x (joker multiplied mult)
  ```

  - Jokers are applied **left-to-right**
  - Place +Mult jokers to the left of xMult jokers for optimal scoring
  - See `calculateScore()` in `utils/poker.ts`

  **Store responsibility**: Apply the final calculated score to game state.
  **Util responsibility**: Perform the actual calculation.
</score-calculation>

<styling-boundaries>
  - **DO NOT include styling or layout logic** in stores (no Tailwind classes, no CSS concerns)
  - **DO NOT perform viewport/device checks** in stores
  - **Keep stores focused** on data/state, game rules, and state transitions only
</styling-boundaries>

<side-effects>
  - **Keep side effects minimal** — stores manage state, not UI
  - **No API calls** — all game data is client-side
  - **Avoid DOM/window access** in stores
  - **Extract complex side effects** to composables
</side-effects>
