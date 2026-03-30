# Web Balatro Design System

## Foundation

### Color System

<color-palette>
  **Primary — Dark Green (Poker Table)**:
  - Background: `#2d5a3a` (dark green felt)
  - Surface: `#1a3a24` (deeper green for cards area)
  - Hover: `#3a7a4e` (lighter green)

**Accent — Gold (Value/Action)**:
- Primary gold: `#ffd700`
- Hover gold: `#ffed4a`
- Muted gold: `#b8860b`
- Use for: Scores, currency, primary CTAs, important highlights

**Neutral Palette — Dark Foundation**:
- `gray-900` / `gray-950`: Primary backgrounds
- `gray-800`: Card backs, secondary surfaces
- `gray-700`: Borders, dividers
- `gray-400` / `gray-300`: Secondary text
- `gray-100` / `white`: Primary text, score numbers

**Semantic Colors**:
- Success: Green (`emerald-500` / `emerald-400`)
- Warning: Orange (`orange-500` / `orange-400`)
- Danger: Red (`red-600` / `red-400`) — boss blinds, card destruction
- Info: Blue (`blue-500` / `blue-400`)

**Card Suit Colors**:
- Hearts: `red-500`
- Diamonds: `red-400`
- Clubs: `gray-800` (dark) / `gray-200` (light)
- Spades: `gray-900` (dark) / `gray-100` (light)

**Rarity Colors**:

| Rarity | Border/Accent | Background |
|--------|--------------|------------|
| Common | `gray-400` | `gray-800/50` |
| Uncommon | `emerald-500` | `emerald-900/30` |
| Rare | `blue-500` | `blue-900/30` |
| Legendary | `purple-500` / `yellow-500` | `purple-900/30` |

**Card Enhancement Colors**:

| Enhancement | Visual Effect |
|-------------|--------------|
| Foil | Subtle silver shimmer overlay |
| Holographic | Rainbow gradient overlay |
| Polychrome | Shifting color spectrum |
| Bonus | Blue tint |
| Mult | Red tint |
| Wild | Multi-color border |
| Glass | Transparent/crystal effect |
| Steel | Metallic gray sheen |
| Gold | Gold border/glow |
| Lucky | Green sparkle |
| Stone | Gray, solid appearance |
</color-palette>

<color-usage-rules>
  - **Dark-first design**: The game is inherently dark-themed (poker table atmosphere)
  - **Reserve gold for value signals**: Scores, currency, primary actions
  - **Functional color only**: Color conveys gameplay meaning
  - **Suit colors are sacred**: Red for hearts/diamonds, dark for clubs/spades
  - **Rarity color consistency**: Same tier = same border color throughout
</color-usage-rules>

### Typography

<font-system>
  **Primary Font**: "Press_Start_2P" (pixel font for retro game feel)
  ```css
  font-family: "Press_Start_2P", monospace;
  ```
  Use for: Headings, scores, game labels, buttons

**Secondary Font**: System sans-serif (fallback for body text / descriptions)
```css
font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
```
Use for: Card descriptions, tooltips, detailed text

**Scale**:
- `text-xs`: 0.75rem — Tooltips, minor labels
- `text-sm`: 0.875rem — Card descriptions, secondary info
- `text-base`: 1rem — Body text, shop prices
- `text-lg`: 1.125rem — Section headings, card titles
- `text-xl`: 1.25rem — Game phase labels
- `text-2xl`: 1.5rem — Score display
- `text-4xl`+: 2.25rem+ — Final score, dramatic numbers
</font-system>

<text-hierarchy>
  - **Score Numbers**: Extra large, bold, gold color
    - Size: `text-2xl` to `text-4xl`
    - Weight: `font-bold`
    - Color: `text-yellow-400`

- **Game Labels**: Medium pixel font
  - Size: `text-sm` to `text-base`
  - Weight: `font-bold`
  - Color: `text-gray-200`

- **Card Values**: Clear, readable
  - Size: `text-lg`
  - Weight: `font-bold`
  - Color: Suit-dependent (red/dark)

- **Description Text**: Sans-serif body
  - Size: `text-sm`
  - Weight: `font-normal`
  - Line height: `leading-relaxed`
  - Color: `text-gray-400`
</text-hierarchy>

### Spacing & Layout

<spacing-scale>
  **8px Base Unit** (Tailwind default):
  - `space-1`: 4px — Tight card gaps
  - `space-2`: 8px — Card internal padding
  - `space-3`: 12px — Component gaps
  - `space-4`: 16px — Section padding
  - `space-6`: 24px — Area separation
  - `space-8`: 32px — Major section gaps

**Common Patterns**:
- Card padding: `p-2` to `p-3`
- Section padding: `p-4` to `p-6`
- Gap between cards: `gap-1` to `gap-2`
- Joker slot gap: `gap-2`
- Hand card overlap: Negative margin for fan-out effect
</spacing-scale>

<container-system>
  ```html
  <!-- Game board container -->
  <div class="max-w-lg mx-auto px-2 md:max-w-4xl md:px-4">
    <!-- Content -->
  </div>
  ```
  - Mobile: Narrow, phone-optimized (max-w-lg)
  - Desktop: Wider layout (max-w-4xl)
  - Always center with `mx-auto`
</container-system>

### Border & Radius

<border-system>
  **Border Width**:
  - Default: `border` (1px) — Standard cards
  - Emphasis: `border-2` (2px) — Selected cards, active jokers
  - Rarity: `border-2` with rarity color

**Border Colors**:
- Card border: `border-gray-600`
- Selected: `border-yellow-400`
- Rarity: Corresponding rarity color
- Debuffed: `border-red-500/50`

**Border Radius**:
- Cards: `rounded-lg` (8px)
- Buttons: `rounded-lg` (8px)
- Modals: `rounded-xl` (12px)
- Badges: `rounded-full`
</border-system>

### Shadows & Elevation

<shadow-system>
  **Minimal shadow, glow-based approach**:
  - Level 1: `shadow-sm` — Default card elevation
  - Level 2: `shadow-md` — Hover states, selected cards
  - Level 3: `shadow-lg` — Modals, overlays
  - Glow: `shadow-[0_0_10px_rgba(255,215,0,0.3)]` — Gold glow for important items

**Usage**:
- Default cards: `shadow-sm`
- Hover/selected: Gold glow effect
- Legendary items: Purple/gold glow
- Avoid heavy shadows — use border and glow instead
</shadow-system>

## Components

### Buttons

<button-primary>
  **Gold Action Button**:
  ```html
  <button class="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-6 py-3 rounded-lg transition-colors duration-200">
    <i class="pi pi-play mr-1"></i>
    Play Hand
  </button>
  ```
  - Background: Gold
  - Text: Dark, bold
  - Hover: Brighter gold
  - Usage: "Play Hand", "Buy", "Next Round"
</button-primary>

<button-secondary>
  **Outline Button**:
  ```html
  <button class="bg-transparent text-gray-200 px-6 py-3 rounded-lg font-semibold border border-gray-500 hover:border-gray-300 transition-colors duration-200">
    Discard
  </button>
  ```
  - Background: Transparent
  - Border: Gray, lightens on hover
  - Usage: "Discard", "Skip Blind", "Sell"
</button-secondary>

<button-danger>
  **Danger Button**:
  ```html
  <button class="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-lg transition-colors duration-200">
    Destroy
  </button>
  ```
  - Usage: Destructive spectral card effects, card destruction
</button-danger>

<button-states>
  - **Default**: Clear, actionable
  - **Hover**: Color shift, `duration-200`
  - **Active**: `active:scale-95`
  - **Disabled**: `opacity-50 cursor-not-allowed`
</button-states>

### Cards

<playing-card>
  ```html
  <div class="w-16 h-24 md:w-20 md:h-28 bg-white rounded-lg border-2 border-gray-300 shadow-sm flex flex-col items-center justify-center cursor-pointer
    hover:-translate-y-1 transition-transform duration-200
    data-[selected=true]:border-yellow-400 data-[selected=true]:-translate-y-3">
    <span class="text-lg font-bold text-red-500">A</span>
    <span class="text-sm">♥</span>
  </div>
  ```
</playing-card>

<joker-card>
  ```html
  <div class="w-16 h-22 md:w-20 md:h-28 rounded-lg border-2 shadow-sm p-1
    border-emerald-500 bg-gray-800">
    <!-- Joker art and ability text -->
  </div>
  ```
  - Border color varies by rarity
  - Tooltip on hover shows full ability description
</joker-card>

<card-states>
  - **Default**: Standard display
  - **Selected**: Rise up, gold border glow
  - **Debuffed**: Muted colors, red overlay
  - **Face-down**: Card back shown (gray pattern)
  - **Enhanced**: Visual overlay (Foil shimmer, Holo rainbow, etc.)
</card-states>

### Score Display

<score-display>
  ```html
  <div class="text-center">
    <div class="text-4xl font-bold text-yellow-400 font-['Press_Start_2P']">
      1,234,567
    </div>
    <div class="flex items-center justify-center gap-2 text-sm">
      <span class="text-blue-400">Chips: 350</span>
      <span class="text-gray-500">x</span>
      <span class="text-red-400">Mult: 24</span>
    </div>
  </div>
  ```
  - Chips in blue, Mult in red
  - Final score in gold
  - Animated counting for dramatic effect
</score-display>

### Shop Interface

<shop-layout>
  - Dark overlay panel on top of game board
  - Items displayed in a row/grid
  - Each item shows: art, name, price, effect preview
  - Reroll button with escalating cost display
  - Booster packs as separate section
</shop-layout>

### Icons

<icon-system>
  **PrimeIcons** (primary icon set):
  ```html
  <i class="pi pi-wallet mr-1 text-yellow-400"></i>  <!-- Money -->
  <i class="pi pi-play mr-1"></i>                     <!-- Play -->
  <i class="pi pi-times mr-1"></i>                    <!-- Discard/Close -->
  <i class="pi pi-refresh mr-1"></i>                  <!-- Reroll -->
  <i class="pi pi-shopping-cart mr-1"></i>             <!-- Shop -->
  ```

**Sizing**:
- Small: `text-sm` (14px)
- Medium: `text-base` (16px)
- Large: `text-xl` (20px)
</icon-system>

## Interactions

### Hover Effects

<hover-principles>
  - **Only on interactive elements**: Cards, buttons, shop items
  - **Cards**: Slight lift (`hover:-translate-y-1`)
  - **Consistent timing**: `duration-200`
  - **Cursor**: Always `cursor-pointer` for interactive elements
</hover-principles>

### Focus States

<focus-rules>
  - **Keyboard navigation**: Visible focus ring on cards and buttons
  - **Focus ring**: `focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900`
  - **Tab order**: Hand cards → Action buttons → Jokers → Consumables
</focus-rules>

### Transitions & Animation

<animation-principles>
  - **Card movements**: 200-300ms, ease-out
  - **Score counting**: Progressive number roll-up (400-800ms)
  - **Card dealing**: Staggered delay for fan-out effect
  - **Joker triggers**: Brief highlight/pulse when activated
  - **Keep subtle** except for score celebration moments
</animation-principles>

## Responsive Design

<breakpoints>
  **Tailwind breakpoints**:
  - Default: Mobile-first (< 768px)
  - `md`: 768px — Desktop layout transition
  - `lg`: 1024px — Wider desktop
</breakpoints>

<responsive-patterns>
  **Card Sizing**:
  ```html
  <!-- Smaller on mobile, larger on desktop -->
  <div class="w-14 h-20 md:w-20 md:h-28">
  ```

**Layout**:
```html
<!-- Vertical stack on mobile, horizontal on desktop -->
<div class="flex flex-col md:flex-row gap-2 md:gap-4">
```

**Hide/Show**:
```html
<!-- Desktop-only side panel -->
<div class="hidden md:block">
<!-- Mobile-only compact display -->
<div class="md:hidden">
```
</responsive-patterns>

<mobile-optimization>
  - **Touch targets**: Minimum 44x44px for card taps
  - **Compact card sizes**: Fit hand of 8 cards on screen
  - **Bottom-anchored actions**: Play/Discard buttons always visible
  - **Swipe-friendly**: Minimal accidental trigger zones
</mobile-optimization>

## Accessibility

<wcag-compliance>
  - **Color contrast**: Minimum 4.5:1 for text on dark backgrounds
  - **Focus indicators**: Gold ring, clearly visible
  - **Keyboard navigation**: All game actions accessible via keyboard
  - **Screen readers**: ARIA labels for card values, game state, actions
</wcag-compliance>

<semantic-html>
  - Use `<button>` for all interactive actions
  - Use `<main>` for game board
  - Use `role="list"` for card collections (hand, joker slots)
  - Use `aria-label` for card descriptions
  - Use `aria-live` for score updates
</semantic-html>

## Design Tokens

<css-custom-properties>
  ```css
  :root {
    /* Colors */
    --color-felt: #2d5a3a;
    --color-felt-dark: #1a3a24;
    --color-gold: #ffd700;
    --color-gold-muted: #b8860b;

    /* Spacing */
    --sp-1: 4px;
    --sp-2: 8px;
    --sp-3: 12px;
    --sp-4: 16px;

    /* Border radius */
    --radius-card: 8px;
    --radius-button: 8px;
    --radius-modal: 12px;

    /* Shadows */
    --shadow-card: 0 1px 3px rgba(0,0,0,.2);
    --glow-gold: 0 0 10px rgba(255,215,0,.3);
    --glow-legendary: 0 0 15px rgba(168,85,247,.4);

    /* Animation */
    --dur-fast: 150ms;
    --dur-med: 200ms;
    --dur-score: 600ms;
    --ease: cubic-bezier(.2,.7,.2,1);
  }
  ```
</css-custom-properties>

## Best Practices

<do>
  - Use gold accent for primary actions and value displays
  - Maintain poker table atmosphere with dark green backgrounds
  - Use rarity colors consistently for all items
  - Provide clear card state indicators (selected, debuffed, enhanced)
  - Animate score calculations for satisfying feedback
  - Use pixel font for game UI, sans-serif for descriptions
  - Follow mobile-first responsive approach
  - Keep card sizing consistent within each context
</do>

<dont>
  - Don't use bright/light backgrounds (breaks poker table feel)
  - Don't mix rarity color meanings
  - Don't skip card enhancement visual indicators
  - Don't use heavy shadows — prefer glow effects
  - Don't make cards too small to tap on mobile
  - Don't animate everything — reserve drama for scoring moments
  - Don't use colors that clash with suit colors (red/black)
</dont>
