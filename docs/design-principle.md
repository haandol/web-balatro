# Web Balatro Design Principle

**Note**: For complete design system implementation details, refer to `design-system.md`

## UI Framework

### Tech Stack
- **TailwindCSS**: Utility-first CSS framework for consistent design system
- **PrimeIcons**: Icon set for UI elements

## Core Design Philosophy

### Casino/Poker Atmosphere
- **Dark green base**: Deep green (#2d5a3a) as the primary background — evoking a poker table felt
- **Gold accents**: Gold (#ffd700) for highlights, scores, currency, and important actions
- **Pixel art aesthetic**: "Press_Start_2P" font for retro gaming feel
- **Card-centric design**: Playing cards and jokers are the visual focal point

### Color Usage Principles
- **Dark, immersive palette**: Dark green, deep purple, and black tones for the background
- **Gold for value signals**: Money, scores, multipliers, and primary CTAs
- **Red for danger/risk**: Boss blinds, card destruction, negative effects
- **Functional color only**: Color conveys gameplay meaning (suit colors, rarity tiers, card enhancements)

### Gold Accent Usage Guide
- **Primary CTA buttons**: "Play Hand", "Discard", "Buy" actions
- **Currency display**: Dollar amounts, interest indicators
- **Score highlights**: Chip and mult values during scoring
- **Achievement/reward indicators**: Rare items, legendary jokers

## Layout Principles

### Game Board Layout
- **Mobile-first**: Single column vertical layout on mobile
- **Desktop**: Card hand at bottom, jokers at top, score/blind info on sides
- **Center focus**: The played hand and score calculation take center stage

### Information Hierarchy
- **Top area**: Joker slots, active modifiers
- **Center area**: Played cards, score display, blind target
- **Bottom area**: Player's hand, action buttons (Play/Discard)
- **Overlay panels**: Shop, deck viewer, card details

## Typography System

### Text Hierarchy
- **Score numbers**: Large, bold pixel font for dramatic score displays
- **Game labels**: Medium pixel font for UI labels (Chips, Mult, Hand, Discard)
- **Card values**: Clear, readable rank and suit indicators
- **Info text**: Small sans-serif for descriptions and tooltips

### Text Emphasis
- **Gold color**: For currency and score values
- **Bold weight**: For active multipliers and important stats
- **Size differentiation**: Hierarchical information structure

## Button Design System

### Primary Button (Main Action)
- **Background**: Gold (#ffd700) or dark green gradient
- **Text**: Dark, bold, action-oriented text
- **Usage**: "Play Hand", "Buy", "Next Round"
- **Example**:
  ```html
  <button class="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-6 py-3 rounded-lg">
    Play Hand
  </button>
  ```

### Secondary Button (Alternative Action)
- **Background**: Transparent or dark surface
- **Text**: Light colored
- **Border**: Thin gold or gray border
- **Usage**: "Discard", "Skip", "Sell"

### Danger Button (Destructive Action)
- **Background**: Red tones
- **Text**: White
- **Usage**: "Destroy Card", confirm destructive spectral card effects

## Visual Elements

### Card Design
- **Playing cards**: Standard poker card visuals with enhancement/edition overlays
- **Joker cards**: Distinctive art with rarity color borders (Common/Uncommon/Rare/Legendary)
- **Tarot/Planet/Spectral**: Unique visual styles per card category
- **Enhancement indicators**: Visual overlays for Foil, Holographic, Polychrome effects

### Rarity Color Coding
- **Common**: Gray/white border
- **Uncommon**: Green border
- **Rare**: Blue border
- **Legendary**: Purple/gold border

### Score Animation
- **Chip counting**: Numbers rolling up dramatically
- **Mult application**: Visual emphasis when multipliers apply
- **xMult cascade**: Escalating visual effect for multiplication chain

## Interaction Design

### Card Selection
- **Tap/click**: Select cards for play or discard (up to 5)
- **Visual feedback**: Selected cards rise/highlight with gold border
- **Deselection**: Tap again to deselect
- **Drag**: Reorder jokers in slots (left-to-right order matters)

### Hover Effects
- **Cards**: Slight lift and glow effect revealing card details
- **Buttons**: Brightness/color shift
- **Jokers**: Show tooltip with ability description
- **Shop items**: Highlight with price and effect preview

### Touch Optimization
- **Large tap targets**: Cards and buttons sized for finger interaction
- **Swipe gestures**: Navigate between game phases (optional)
- **Long press**: Show detailed card info on mobile

## Responsive Design

### Mobile (Primary)
- **Single column layout**: Vertical card arrangement
- **Compact card sizes**: Optimized for small screens
- **Bottom action bar**: Play/Discard buttons always accessible
- **Swipe-friendly**: Card selection via tap

### Desktop
- **Wider card layout**: Horizontal hand spread
- **Side panels**: Score info and blind details
- **Hover tooltips**: Detailed card information
- **Keyboard shortcuts**: Quick actions for experienced players

## Accessibility

### Color Contrast
- **WCAG AA compliance**: Sufficient contrast on dark backgrounds
- **Suit differentiation**: Not relying solely on color (use shapes/symbols)
- **Dark mode native**: The game is inherently dark-themed

### Usability
- **Clear action labels**: Button text clearly communicates intent
- **Consistency**: Same visual patterns for same game mechanics
- **Feedback**: Immediate visual response for all player actions
