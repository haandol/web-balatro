# Web Balatro Layout & Responsive Design Guidelines

**Note**: For complete design system including colors, typography, and components, refer to `design-system.md`

<container-structure>
  - Use a centered container with constrained max-width:
    ```html
    <div class="max-w-lg mx-auto px-2 md:max-w-4xl md:px-4">
      <!-- Game content -->
    </div>
    ```
  - Mobile: `max-w-lg` (phone-optimized, ~32rem)
  - Desktop: `max-w-4xl` (wider layout, ~56rem)
  - Ensure content stays within the viewport to prevent horizontal scrolling
</container-structure>

<game-layout>
  <mobile-layout>
    **Vertical stack layout (default, mobile-first)**:
    ```
    ┌─────────────────────┐
    │   Blind Info / Score │
    ├─────────────────────┤
    │    Joker Slots (5)   │
    ├─────────────────────┤
    │                      │
    │   Played Cards Area  │
    │   Score Animation    │
    │                      │
    ├─────────────────────┤
    │  Consumable Slots    │
    ├─────────────────────┤
    │                      │
    │   Player Hand (8)    │
    │                      │
    ├─────────────────────┤
    │  [Discard]  [Play]   │
    └─────────────────────┘
    ```
    - All sections stacked vertically
    - Action buttons anchored at the bottom
    - Cards sized to fit hand of 8 on mobile width
  </mobile-layout>

  <desktop-layout>
    **Wider layout with side info (md: breakpoint)**:
    ```
    ┌──────────────────────────────────────┐
    │          Joker Slots (5)              │
    ├──────┬───────────────────────┬───────┤
    │      │                       │       │
    │ Blind│   Played Cards Area   │ Deck  │
    │ Info │   Score Animation     │ Info  │
    │      │                       │       │
    ├──────┴───────────────────────┴───────┤
    │          Consumable Slots             │
    ├──────────────────────────────────────┤
    │           Player Hand (8)             │
    ├──────────────────────────────────────┤
    │       [Discard]     [Play Hand]       │
    └──────────────────────────────────────┘
    ```
    - Blind info and deck info in side columns
    - Larger card sizes
    - More spacing between elements
  </desktop-layout>

  <shop-layout>
    **Shop overlay (between blinds)**:
    ```
    ┌──────────────────────────────────────┐
    │  Shop                    $XX  [Next] │
    ├──────────────────────────────────────┤
    │  [Item] [Item] [Item]  [Reroll $X]   │
    ├──────────────────────────────────────┤
    │  [Booster Pack] [Booster Pack]       │
    ├──────────────────────────────────────┤
    │  [Voucher]                           │
    ├──────────────────────────────────────┤
    │  Current Jokers:  [J1] [J2] [J3]... │
    └──────────────────────────────────────┘
    ```
    - Full-screen overlay on mobile
    - Centered panel on desktop
  </shop-layout>
</game-layout>

<responsive-design>
  <breakpoints>
    Follow Tailwind's responsive breakpoints:
    - Default: < 768px — **Mobile** (primary target)
    - `md`: 768px and above — **Desktop** layout transition
    - `lg`: 1024px and above — **Wide desktop** (optional refinements)

    **Note:** Mobile-first approach — default styles target mobile
  </breakpoints>

  <grid-system>
    - Use Flexbox for most game layouts:
      ```html
      <!-- Joker slots row -->
      <div class="flex items-center justify-center gap-2">

      <!-- Player hand -->
      <div class="flex items-end justify-center -space-x-2 md:-space-x-1">
      ```
    - Use CSS Grid for shop layouts:
      ```html
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      ```
  </grid-system>

  <adaptive-components>
    **Prefer CSS classes for responsive behavior:**
    ```html
    <!-- Smaller cards on mobile, larger on desktop -->
    <div class="w-14 h-20 md:w-20 md:h-28">

    <!-- Hide side panels on mobile -->
    <div class="hidden md:block">

    <!-- Full-width buttons on mobile -->
    <button class="w-full md:w-auto">
    ```
  </adaptive-components>
</responsive-design>

<card-sizing>
  **Playing cards**:
  - Mobile: `w-14 h-20` (56x80px) — fits 8 cards with overlap
  - Desktop: `w-20 h-28` (80x112px)

  **Joker cards**:
  - Mobile: `w-14 h-20`
  - Desktop: `w-20 h-28`

  **Shop item cards**:
  - Mobile: `w-20 h-28`
  - Desktop: `w-24 h-32`

  **Card overlap for hand display**:
  ```html
  <!-- Negative space-x for overlapping cards in hand -->
  <div class="flex items-end justify-center -space-x-2 md:-space-x-1">
    <div class="w-14 h-20 md:w-20 md:h-28"><!-- card --></div>
    ...
  </div>
  ```
</card-sizing>

<component-design>
  <score-area>
    - Center of the game board
    - Shows blind target, current score progress
    - Animated chip/mult calculation display
    - Responsive text sizing:
      ```html
      <div class="text-2xl md:text-4xl font-bold text-yellow-400">
        1,234,567
      </div>
      ```
  </score-area>

  <joker-slots>
    - Horizontal row at top of game area
    - Scrollable on mobile if more than 5 slots
    - Drag-to-reorder on desktop, long-press-drag on mobile
    ```html
    <div class="flex items-center justify-center gap-1 md:gap-2 overflow-x-auto">
      <!-- Joker cards -->
    </div>
    ```
  </joker-slots>

  <action-bar>
    - Fixed or sticky at bottom of viewport on mobile
    - Contains Play Hand and Discard buttons
    - Shows remaining hands and discards count
    ```html
    <div class="fixed bottom-0 left-0 right-0 p-2 bg-gray-900/95 backdrop-blur md:static md:bg-transparent">
      <div class="flex items-center justify-center gap-4">
        <button>Discard (3)</button>
        <button>Play Hand (4)</button>
      </div>
    </div>
    ```
  </action-bar>
</component-design>

<mobile-optimization>
  **Touch targets**:
  - Minimum 44x44px for all interactive elements
  - Cards are primary tap targets — size accordingly
  - Action buttons: Full width or large enough for easy tapping

  **Performance**:
  - Minimize DOM nodes for card animations
  - Use `transform` and `opacity` for GPU-accelerated animations
  - Avoid layout-triggering animations (width, height, top, left)

  **Viewport**:
  - Prevent zoom on input focus
  - Lock orientation if needed for optimal layout
  - Account for mobile browser chrome (address bar, bottom bar)
</mobile-optimization>

<animation-transitions>
  - **Card selection**: `transition-transform duration-200` — lift selected cards
  - **Card dealing**: Staggered `transition-all duration-300` with delay
  - **Score counting**: Progressive number animation (400-800ms)
  - **Shop transitions**: `transition-opacity duration-200` for panel open/close
  - Avoid heavy transitions that jank on mobile devices
  ```html
  <!-- Card selection animation -->
  <div class="transition-transform duration-200 ease-out
    data-[selected=true]:-translate-y-3">
  ```
</animation-transitions>

<accessibility>
  - Maintain proper heading hierarchy (h1 for game title, h2 for sections)
  - Implement keyboard navigation for card selection (arrow keys)
  - Use `role="list"` and `role="listitem"` for card collections
  - Ensure sufficient color contrast on dark backgrounds
  - Use `aria-live="polite"` for score updates and game state changes
</accessibility>
