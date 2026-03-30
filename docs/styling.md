# Web Balatro Styling Guidelines

**Note**: For complete design system documentation, refer to `design-system.md`

<color-system>
  <theme-colors>
    - Primary: Dark green (#2d5a3a) — poker table felt background
    - Accent: Gold (#ffd700) — scores, currency, primary actions
    - Surface: Deep gray (gray-800/gray-900) — card backs, panels
    - Text: Gray-100/Gray-200 — primary text on dark backgrounds
  </theme-colors>

  <usage-patterns>
    ```html
    <!-- Game background -->
    <div class="bg-[#2d5a3a]"></div>

    <!-- Gold accent for scores and actions -->
    <span class="text-yellow-400 font-bold">$25</span>
    <button class="bg-yellow-500 hover:bg-yellow-400 text-gray-900">Play Hand</button>

    <!-- Card surfaces -->
    <div class="bg-gray-800 border border-gray-600 rounded-lg"></div>

    <!-- Rarity borders -->
    <div class="border-2 border-gray-400"><!-- Common --></div>
    <div class="border-2 border-emerald-500"><!-- Uncommon --></div>
    <div class="border-2 border-blue-500"><!-- Rare --></div>
    <div class="border-2 border-purple-500"><!-- Legendary --></div>
    ```
  </usage-patterns>

  <suit-colors>
    Card suit colors must be consistent:
    ```html
    <!-- Hearts & Diamonds: Red -->
    <span class="text-red-500">♥</span>
    <span class="text-red-400">♦</span>

    <!-- Clubs & Spades: Dark/Light depending on background -->
    <span class="text-gray-800 dark:text-gray-200">♣</span>
    <span class="text-gray-900 dark:text-gray-100">♠</span>
    ```
  </suit-colors>

  <score-colors>
    Score display uses distinct colors for each component:
    ```html
    <!-- Chips: Blue -->
    <span class="text-blue-400">Chips: 350</span>

    <!-- Mult: Red -->
    <span class="text-red-400">Mult: 24</span>

    <!-- Final Score: Gold -->
    <span class="text-yellow-400 text-4xl font-bold">8,400</span>
    ```
  </score-colors>
</color-system>

<dark-mode>
  <implementation>
    - The game is **inherently dark-themed** (poker table atmosphere)
    - **Use TailwindCSS `dark:` directives** if supporting a light mode variant
    - **DO NOT use** `[data-theme="dark"]`, `.dark` class selectors, or `:global(.dark)` in CSS
    - Default design targets dark backgrounds — light mode is optional
  </implementation>

  <color-guidelines>
    - Prefer deep gray backgrounds (gray-900, gray-950) over pure black
    - Text uses gray-100 to gray-200 (not pure white) for readability
    - Borders: low-contrast gray-600 to gray-700
    - Accents (gold, rarity colors): slightly higher saturation for visibility
  </color-guidelines>
</dark-mode>

<typography>
  <pixel-font>
    Use "Press_Start_2P" for game UI elements:
    ```html
    <!-- Score numbers -->
    <div class="font-['Press_Start_2P'] text-2xl text-yellow-400 font-bold">
      1,234,567
    </div>

    <!-- Game labels -->
    <span class="font-['Press_Start_2P'] text-xs text-gray-300">
      HAND
    </span>
    ```
  </pixel-font>

  <body-text>
    Use system sans-serif for descriptions and detailed text:
    ```html
    <!-- Card descriptions, tooltips -->
    <p class="text-sm text-gray-400 leading-relaxed">
      +4 Mult for each played hand
    </p>
    ```
  </body-text>

  <hierarchy>
    - **Scores**: `text-2xl` to `text-4xl`, bold, gold — pixel font
    - **Game labels**: `text-xs` to `text-sm`, bold, gray-200 — pixel font
    - **Card names**: `text-sm` to `text-base`, semibold — sans-serif
    - **Descriptions**: `text-xs` to `text-sm`, normal, gray-400 — sans-serif
  </hierarchy>
</typography>

<icon-system>
  <usage>
    Use PrimeIcons for UI elements:
    ```html
    <i class="pi pi-wallet text-yellow-400 mr-1"></i>  <!-- Money -->
    <i class="pi pi-play mr-1"></i>                     <!-- Play -->
    <i class="pi pi-times text-red-400 mr-1"></i>       <!-- Discard -->
    <i class="pi pi-refresh mr-1"></i>                   <!-- Reroll -->
    <i class="pi pi-eye mr-1"></i>                       <!-- View deck -->
    ```
  </usage>

  <sizes>
    - Small: `text-sm` (14px) — inline with text
    - Medium: `text-base` (16px) — buttons
    - Large: `text-xl` (20px) — standalone icons
  </sizes>
</icon-system>

<component-styling>
  <playing-cards>
    ```html
    <!-- Standard playing card -->
    <div class="w-14 h-20 md:w-20 md:h-28
      bg-white rounded-lg border-2 border-gray-300 shadow-sm
      flex flex-col items-center justify-center
      cursor-pointer transition-transform duration-200
      hover:-translate-y-1
      data-[selected=true]:border-yellow-400
      data-[selected=true]:-translate-y-3
      data-[selected=true]:shadow-[0_0_10px_rgba(255,215,0,0.3)]">
    </div>

    <!-- Debuffed card -->
    <div class="... opacity-50 border-red-500/50">
    </div>

    <!-- Face-down card -->
    <div class="... bg-gray-700 border-gray-600">
      <!-- Card back pattern -->
    </div>
    ```
  </playing-cards>

  <joker-cards>
    ```html
    <!-- Joker with rarity border -->
    <div class="w-14 h-20 md:w-20 md:h-28
      bg-gray-800 rounded-lg border-2 shadow-sm p-1
      cursor-pointer transition-all duration-200
      hover:shadow-md">
      <!-- Border color varies by rarity -->
    </div>
    ```
  </joker-cards>

  <buttons>
    ```html
    <!-- Primary action (Play Hand) -->
    <button class="bg-yellow-500 hover:bg-yellow-400 text-gray-900
      font-bold px-6 py-3 rounded-lg
      transition-colors duration-200
      active:scale-95
      disabled:opacity-50 disabled:cursor-not-allowed">
      <i class="pi pi-play mr-1"></i>
      Play Hand
    </button>

    <!-- Secondary action (Discard) -->
    <button class="bg-transparent text-gray-200
      px-6 py-3 rounded-lg font-semibold
      border border-gray-500 hover:border-gray-300
      transition-colors duration-200">
      Discard
    </button>

    <!-- Shop buy button -->
    <button class="bg-emerald-600 hover:bg-emerald-500 text-white
      px-4 py-2 rounded-lg font-semibold
      transition-colors duration-200">
      Buy $6
    </button>
    ```
  </buttons>

  <badges>
    ```html
    <!-- Rarity badge -->
    <span class="px-2 py-0.5 rounded-full text-xs font-bold
      bg-purple-900/50 text-purple-300 border border-purple-500/30">
      Legendary
    </span>

    <!-- Enhancement badge -->
    <span class="px-2 py-0.5 rounded-full text-xs font-bold
      bg-blue-900/50 text-blue-300">
      Foil +50 Chips
    </span>
    ```
  </badges>
</component-styling>

<readability>
  - Maintain WCAG AA contrast (4.5:1 for text on dark backgrounds)
  - Gold text (#ffd700) on dark green (#2d5a3a) passes AA for large text
  - Use gray-200 or lighter for body text on dark backgrounds
  - Provide clear keyboard focus states with gold ring
</readability>

<motion>
  - **Card selection**: `transition-transform duration-200 ease-out`
  - **Button hover**: `transition-colors duration-200`
  - **Score counting**: Custom animation (400-800ms)
  - **Card dealing**: Staggered `duration-300` with incremental delay
  - **Joker trigger**: Brief pulse/glow (200ms)
  - Avoid bounce/spring effects — keep motion understated except for scores
</motion>

<responsive>
  ```html
  <!-- Card sizing -->
  <div class="w-14 h-20 md:w-20 md:h-28">

  <!-- Text sizing -->
  <span class="text-sm md:text-base">
  <span class="text-2xl md:text-4xl">

  <!-- Layout switching -->
  <div class="flex flex-col md:flex-row">
  <div class="hidden md:block">
  <div class="md:hidden">

  <!-- Button sizing -->
  <button class="w-full md:w-auto px-4 py-3 md:px-6 md:py-3">
  ```
</responsive>

<tokens-example>
  ```css
  :root {
    /* Game colors */
    --color-felt: #2d5a3a;
    --color-felt-dark: #1a3a24;
    --color-gold: #ffd700;

    /* Card sizing */
    --card-w-mobile: 56px;
    --card-h-mobile: 80px;
    --card-w-desktop: 80px;
    --card-h-desktop: 112px;

    /* Border radius */
    --radius-card: 8px;

    /* Shadows & Glows */
    --shadow-card: 0 1px 3px rgba(0,0,0,.2);
    --glow-gold: 0 0 10px rgba(255,215,0,.3);
    --glow-selected: 0 0 8px rgba(255,215,0,.4);
  }
  ```
</tokens-example>
