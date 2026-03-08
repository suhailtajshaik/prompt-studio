# Architecture Patterns

**Domain:** UI/UX Redesign of React Developer Tool (Prompt Studio)
**Researched:** 2026-03-08
**Confidence:** HIGH (based on direct codebase analysis + established patterns)

## Current Architecture Analysis

### Component Tree (10 components, single-page SPA)

```
App.jsx (state owner: tab, badPrompt, framework, techniques, provider, model, apiKeys)
  |-- aurora-bg (3 blob divs) ............. [REMOVE]
  |-- grain-overlay ........................ [REMOVE]
  |-- Header ............................... [MODIFY - simplify hero]
  |-- glow-line ............................ [REMOVE]
  |-- TabBar ............................... [MODIFY - restyle]
  |-- AnimatePresence
  |   |-- Build tab (motion.div)
  |   |   |-- PromptInput ................. [MODIFY - restyle card + textarea]
  |   |   |-- FrameworkPicker .............. [MODIFY - restyle cards]
  |   |   |-- TechniquePicker .............. [MODIFY - restyle cards]
  |   |   |-- ErrorBanner .................. [MODIFY - restyle]
  |   |   |-- TransformButton .............. [MODIFY - remove shimmer, restyle]
  |   |-- Result tab -> ResultView ......... [MODIFY - restyle cards + stats]
  |   |-- Learn tab -> LearnView ........... [MODIFY - restyle cards + table]
  |   |-- Settings tab -> SettingsView ..... [MODIFY - restyle cards + inputs]
  |-- Footer ............................... [MODIFY - restyle]
```

### Current Styling Issues Identified

1. **Glass morphism everywhere** - `.glass-card` uses `backdrop-filter: blur(24px)`, `rgba` backgrounds, hover transforms. This is the "marketing page" feel the redesign targets.
2. **Aurora blobs + grain overlay** - 3 animated gradient blobs + SVG noise texture. Pure decoration that adds visual noise.
3. **Hardcoded colors in components** - `FrameworkPicker`, `TechniquePicker`, `ResultView` use inline `style={{}}` with hardcoded hex colors (`#00d4aa`, `#ff5c5c`, `#e8b931`). These bypass the theme system entirely.
4. **Mixed theming approach** - CSS custom properties for base theming, but Tailwind config overrides `white` and `black` with `--color-invert`/`--color-base`, creating a confusing abstraction where `bg-white/6` actually means "6% of inverted color."
5. **`prefers-color-scheme` only** - No manual toggle. Dark/light is purely OS-driven via `@media (prefers-color-scheme: dark)`.
6. **Large border radii** - `rounded-2xl` (16px), `rounded-xl` (12px) everywhere. Target is 4-6px.
7. **Framer Motion overhead** - `whileHover={{ scale: 1.01 }}` on every card. Subtle but adds "playful" feel that conflicts with "developer tool" aesthetic.

## Recommended Architecture for Redesign

### Strategy: In-Place Reskinning (Not Rewrite)

The component structure is clean and well-organized. All 10 components are functional, props flow top-down from `App.jsx`, and there is one custom hook (`useTransform`). **No structural refactoring is needed.** The redesign is purely a styling layer change.

### Phase 1: Foundation (CSS Variables + Tailwind Config)

Restructure the design system before touching any components.

#### 1A. CSS Custom Properties - Complete Replacement

Replace the current variables with a semantic, comprehensive token system. Switch from `prefers-color-scheme` media query to a `.dark` class strategy for manual toggle support.

**Current problem:** Variables like `--glass-bg`, `--glass-border`, `--glass-shadow` encode the glassmorphism aesthetic into the token names. The new system should use semantic names.

```css
@layer base {
  :root {
    /* ── Surfaces ── */
    --color-bg:           #FAFBFC;
    --color-bg-secondary: #F1F5F9;
    --color-surface:      #FFFFFF;
    --color-surface-hover:#F8FAFC;
    --color-surface-alt:  #F1F5F9;

    /* ── Borders ── */
    --color-border:       #E2E8F0;
    --color-border-light: #F1F5F9;
    --color-border-focus: #818CF8;

    /* ── Text ── */
    --color-text:         #0F172A;
    --color-text-secondary:#475569;
    --color-text-tertiary: #94A3B8;
    --color-text-inverse: #FFFFFF;

    /* ── Accent (Indigo) ── */
    --color-accent:       #4F46E5;
    --color-accent-hover: #4338CA;
    --color-accent-light: #EEF2FF;
    --color-accent-text:  #3730A3;

    /* ── Semantic ── */
    --color-success:      #16A34A;
    --color-success-light:#F0FDF4;
    --color-warning:      #D97706;
    --color-warning-light:#FFFBEB;
    --color-danger:       #DC2626;
    --color-danger-light: #FEF2F2;

    /* ── Shadows ── */
    --shadow-sm:  0 1px 2px rgba(0,0,0,0.05);
    --shadow-md:  0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-lg:  0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04);

    /* ── Radii ── */
    --radius-sm: 4px;
    --radius-md: 6px;
    --radius-lg: 8px;

    /* ── Code ── */
    --color-code-bg:     #F8FAFC;
    --color-code-text:   #1E293B;
    --color-code-border: #E2E8F0;
  }

  .dark {
    --color-bg:           #0B0F19;
    --color-bg-secondary: #111827;
    --color-surface:      #1E293B;
    --color-surface-hover:#263348;
    --color-surface-alt:  #1A2332;

    --color-border:       #334155;
    --color-border-light: #1E293B;
    --color-border-focus: #818CF8;

    --color-text:         #F1F5F9;
    --color-text-secondary:#94A3B8;
    --color-text-tertiary: #64748B;
    --color-text-inverse: #0F172A;

    --color-accent:       #818CF8;
    --color-accent-hover: #6366F1;
    --color-accent-light: rgba(129,140,248,0.12);
    --color-accent-text:  #A5B4FC;

    --color-success:      #22C55E;
    --color-success-light:rgba(34,197,94,0.1);
    --color-warning:      #FBBF24;
    --color-warning-light:rgba(251,191,36,0.1);
    --color-danger:       #F87171;
    --color-danger-light: rgba(248,113,113,0.1);

    --shadow-sm:  0 1px 2px rgba(0,0,0,0.3);
    --shadow-md:  0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3);
    --shadow-lg:  0 4px 12px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3);

    --color-code-bg:     #111827;
    --color-code-text:   #CBD5E1;
    --color-code-border: #334155;
  }
}
```

**Key decisions:**
- `--glass-*` variables eliminated entirely. No more blur-dependent tokens.
- `.dark` class instead of `prefers-color-scheme` media query. This enables a manual toggle button. Initialize from `prefers-color-scheme` via JS on load.
- Semantic naming (`--color-surface`, not `--color-invert`). The current `white`/`black` override in Tailwind that swaps meaning based on theme is clever but confusing.
- Shadows are real box-shadows, not glow effects.
- Radii are 4-8px range, not 16-20px.

#### 1B. Tailwind Config - Aligned to New Tokens

```javascript
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg:        { DEFAULT: 'var(--color-bg)', secondary: 'var(--color-bg-secondary)' },
        surface:   { DEFAULT: 'var(--color-surface)', hover: 'var(--color-surface-hover)', alt: 'var(--color-surface-alt)' },
        border:    { DEFAULT: 'var(--color-border)', light: 'var(--color-border-light)', focus: 'var(--color-border-focus)' },
        text:      { DEFAULT: 'var(--color-text)', secondary: 'var(--color-text-secondary)', tertiary: 'var(--color-text-tertiary)', inverse: 'var(--color-text-inverse)' },
        accent:    { DEFAULT: 'var(--color-accent)', hover: 'var(--color-accent-hover)', light: 'var(--color-accent-light)', text: 'var(--color-accent-text)' },
        success:   { DEFAULT: 'var(--color-success)', light: 'var(--color-success-light)' },
        warning:   { DEFAULT: 'var(--color-warning)', light: 'var(--color-warning-light)' },
        danger:    { DEFAULT: 'var(--color-danger)', light: 'var(--color-danger-light)' },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      fontFamily: {
        display: ['"Inter"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
```

**Key decisions:**
- `darkMode: 'class'` enables manual toggle.
- `Outfit` font dropped from `display`. Use Inter throughout for clean developer-tool look.
- Removed `glow-pulse`, `shimmer` animations (marketing-page effects).
- Removed the `white`/`black` override hack. Standard white/black behavior restored.
- Border radius defaults reduced from 16-20px to 4-8px.

### Phase 2: Remove Decorative Layer (App.jsx)

Remove from `App.jsx`:
1. **Aurora background** - delete the `aurora-bg` div with 3 blob children
2. **Grain overlay** - remove `grain-overlay` class and its CSS
3. **Glow line** - remove `glow-line` div

Replace with a clean background:
```jsx
<div className="min-h-screen bg-bg">
  <div className="max-w-3xl mx-auto px-6 py-12">
    {/* ... */}
  </div>
</div>
```

Remove from `index.css`:
- `.aurora-bg`, `.aurora-blob`, `.blob-*` classes and `@keyframes float`
- `.grain-overlay` and its `::before` pseudo-element
- `.glow-line`
- `.glass-card` (replace with new `.card` utility)

Add new base card class:
```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.card:hover {
  border-color: var(--color-border-focus);
  box-shadow: var(--shadow-md);
}
```

### Phase 3: Component-by-Component Restyling

Each component is independent enough to restyle in isolation. Order matters only slightly (Header/TabBar set the visual tone first).

#### Component Boundaries

| Component | Responsibility | Integration Points | Change Scope |
|-----------|---------------|-------------------|--------------|
| **App.jsx** | State owner, layout shell, tab routing | All components via props | Remove decorative wrappers, add theme toggle state, simplify layout classes |
| **Header** | Branding, title, subtitle | None (display-only) | Remove badge pill, simplify to text-only header, reduce visual weight |
| **TabBar** | Navigation between 4 tabs | App (active, onChange, hasResult) | Replace border-bottom tabs with pill/segment style, remove `--glass-border` ref |
| **PromptInput** | Textarea + analysis display | App (value, onChange) | Replace `.glass-card` with `.card`, replace `.prompt-input` styles, restyle issue cards |
| **FrameworkPicker** | 3-option radio cards | App (selected, onSelect) | Replace inline `style={{}}` colors with CSS variable-driven classes, sharpen radii |
| **TechniquePicker** | 6-option checkbox cards | App (selected, onToggle) | Same as FrameworkPicker: remove inline styles, use accent token |
| **TransformButton** | CTA button | App (onClick, disabled, loading) | Remove shimmer effect, gradient. Use solid accent color button |
| **ErrorBanner** | Error display | App (message, onDismiss) | Minor: swap danger token names |
| **ResultView** | Output display, stats, copy/download | App (result, badPrompt, frameworkId, techniqueIds, onBack) | Remove hardcoded colors, restyle code-output, sharpen stats cards |
| **LearnView** | Reference documentation | None (reads constants) | Restyle cards, table borders. Remove glow effects on dots |
| **SettingsView** | Provider/model/API key config | App (provider, model, apiKeys + setters) | Restyle inputs, cards. Already cleanest component |

#### New Component: ThemeToggle

One new component is needed for the manual dark/light toggle.

```
ThemeToggle.jsx
- Location: src/components/ThemeToggle.jsx
- Props: none (reads/writes to document.documentElement.classList + localStorage)
- Placement: inside Header or TabBar area
- Behavior: toggle .dark class on <html>, persist to localStorage, init from prefers-color-scheme
```

This is the **only new component**. Everything else is modification of existing components.

### Data Flow

Data flow is **unchanged** by the redesign. The architecture correctly separates concerns:

```
Constants (data/constants.js)  -->  Components (display)
                                      |
User input  -->  App.jsx state  -->  useTransform hook  -->  API call
                                      |
                               ResultView (display)
```

No new hooks, no new data sources, no new state. The redesign is purely presentational.

### Integration Points with Existing Code

#### Critical: Inline Style Elimination

The biggest integration challenge is **inline `style={{}}` attributes** that hardcode colors. These exist in:

| Component | What's Hardcoded | Migration Path |
|-----------|-----------------|----------------|
| `FrameworkPicker` | `fw.color` used for backgrounds, borders, shadows, dot colors | Create 3 CSS classes (`.fw-costar`, `.fw-sixstep`, `.fw-markdown`) or use `data-framework` attribute with CSS |
| `TechniquePicker` | `#00d4aa` for active state, `#a0a5b8` for inactive | Replace with `text-accent` / `text-text-tertiary` tokens |
| `ResultView` | `fw.color` for badges, `#00d4aa` for copy button, `#ff5c5c`/`#e8b931` for stats | Use accent/success/warning/danger tokens |
| `PromptInput` | `getScoreColor()` returns hex, used in inline styles | Refactor to return class names or CSS variable references |
| `LearnView` | `fw.color` with inline `boxShadow` glow | Remove glow, use framework CSS classes |

**Recommended approach:** Keep `fw.color` in constants.js but use it only as a data attribute. Apply styling via CSS:

```jsx
// FrameworkPicker card
<button data-active={isActive} className="card fw-card ...">
```

```css
/* Framework-specific accents via data attributes */
.fw-card[data-framework="costar"][data-active="true"] {
  border-color: var(--color-accent);
  background: var(--color-accent-light);
}
```

Alternatively (simpler): just use the accent color for ALL active framework/technique states. The current design uses different colors per framework (teal, gold, purple), but a developer-tool aesthetic benefits from **consistent accent color** everywhere. One color = less visual noise.

**Recommendation: Use single accent color for all active states.** Remove per-framework colors from the design (keep them in data for potential future use). This eliminates the inline style problem entirely.

#### Theme Toggle Integration

Add to `App.jsx` (or a tiny hook):

```javascript
// hooks/useTheme.js
import { useState, useEffect } from 'react';

export function useTheme() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return [dark, setDark];
}
```

Wire into Header or TabBar. This replaces the `@media (prefers-color-scheme: dark)` block in CSS with the `.dark` class approach.

## Patterns to Follow

### Pattern 1: Semantic Token Consumption

**What:** Components reference semantic tokens, never raw colors.
**When:** Every className and style reference.

```jsx
// GOOD - uses semantic tokens
<div className="bg-surface border border-border rounded-md shadow-sm">

// BAD - current approach with raw rgba
<div style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.09)' }}>
```

### Pattern 2: State-Driven Styling via className (not inline style)

**What:** Active/selected/disabled states expressed through Tailwind classes, not computed style objects.
**When:** FrameworkPicker, TechniquePicker, TabBar, TransformButton.

```jsx
// GOOD
<button className={`card p-4 ${isActive ? 'border-accent bg-accent-light' : 'border-border'}`}>

// BAD - current approach
<button style={{
  background: isActive ? `${fw.color}08` : 'rgba(255,255,255,0.02)',
  borderColor: isActive ? `${fw.color}60` : 'rgba(255,255,255,0.06)',
}}>
```

### Pattern 3: Reduced Motion

**What:** Keep Framer Motion page transitions (they aid navigation clarity) but remove micro-interactions on hover.
**When:** FrameworkPicker, TechniquePicker, TransformButton currently use `whileHover={{ scale: 1.01 }}`.

```jsx
// KEEP - page transitions aid navigation
<AnimatePresence mode="wait">
  <motion.div variants={pageVariants} ...>

// REMOVE - playful hover scaling
<motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
// REPLACE WITH
<button className="transition-colors hover:border-accent">
```

### Pattern 4: Consistent Card Component

**What:** One card pattern used everywhere instead of `.glass-card` with blur.

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg); /* 8px */
  box-shadow: var(--shadow-sm);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
```

Every `glass-card` reference becomes `card`. No hover transforms (translateY), just subtle border/shadow changes.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Partial Migration

**What:** Updating some components to the new style while leaving others with glassmorphism.
**Why bad:** Visual inconsistency is worse than a consistently "wrong" design. Mixed glass + clean = broken.
**Instead:** Complete the CSS variable + Tailwind config change first (Phase 1). This shifts the baseline for ALL components at once, even before individual component restyling. The variables cascade everywhere.

### Anti-Pattern 2: Component-Level Color Overrides

**What:** Defining component-specific color variables or CSS classes that duplicate the token system.
**Why bad:** Creates a parallel color system that drifts from the design tokens.
**Instead:** All colors flow from the root token set. If a component needs a unique treatment, add a semantic token to the root set.

### Anti-Pattern 3: Adding New Dependencies

**What:** Pulling in a component library (Radix, shadcn) or additional CSS tools for the redesign.
**Why bad:** The app has 10 components. A component library adds complexity without proportional value. The constraint says "no new deps unless essential."
**Instead:** The existing Tailwind + CSS custom properties + Framer Motion stack is sufficient for this redesign scope.

## Build Order (Dependency-Aware)

The following order minimizes wasted work and ensures each step builds on completed foundations.

```
Step 1: CSS Variables + Tailwind Config (FOUNDATION)
  |     - Rewrite :root and .dark variables in index.css
  |     - Update tailwind.config.js (darkMode, colors, radii, shadows)
  |     - Remove decorative CSS (.aurora-*, .grain-*, .glow-*, .glass-card)
  |     - Add .card base class
  |     - NOTE: After this step, the app will look "broken" but functional.
  |            All components still work; they just reference updated tokens.
  |
  v
Step 2: App.jsx Layout Shell
  |     - Remove aurora-bg div, grain-overlay wrapper
  |     - Clean layout wrapper (bg-bg, max-width, padding)
  |     - This makes the app viewable again with clean background
  |
  v
Step 3: Header + ThemeToggle (NEW)
  |     - Simplify Header (remove pill badge, reduce text sizes)
  |     - Add ThemeToggle component
  |     - Add useTheme hook
  |     - Wire into App or Header
  |
  v
Step 4: TabBar
  |     - Restyle from border-bottom tabs to clean segment/pill tabs
  |     - Remove glass-border reference
  |
  v
Step 5: PromptInput
  |     - Replace glass-card with card
  |     - Restyle textarea (.prompt-input)
  |     - Restyle example chips
  |     - Restyle issue indicators (remove inline style colors)
  |
  v
Step 6: FrameworkPicker + TechniquePicker (parallel)
  |     - Remove inline style={{}} objects
  |     - Apply single accent color for active states
  |     - Sharpen border radii
  |     - Remove motion.button whileHover/whileTap
  |
  v
Step 7: TransformButton
  |     - Remove shimmer animation
  |     - Remove gradient (solid accent bg)
  |     - Remove whileHover/whileTap scale
  |     - Clean disabled state
  |
  v
Step 8: ResultView
  |     - Restyle code-output block
  |     - Restyle stats cards (remove hardcoded colors)
  |     - Restyle before/after comparison
  |     - Restyle copy/download buttons
  |
  v
Step 9: SettingsView + LearnView + ErrorBanner (parallel)
  |     - SettingsView: restyle cards + inputs (already closest to target)
  |     - LearnView: restyle cards + table + remove glow effects
  |     - ErrorBanner: minor token swap
  |
  v
Step 10: Polish + Footer
        - Restyle footer
        - Audit all components for missed glass/glow references
        - Test both light and dark themes
        - Verify all animations are restrained
```

## New vs Modified Components

| Action | Component | Rationale |
|--------|-----------|-----------|
| **NEW** | `ThemeToggle` | Manual dark/light toggle (currently OS-only via media query) |
| **NEW** | `useTheme` hook | Manages dark class + localStorage persistence |
| **MODIFY** | `App.jsx` | Remove decorative wrappers, integrate theme state |
| **MODIFY** | `Header` | Simplify branding, reduce visual weight |
| **MODIFY** | `TabBar` | Restyle tabs from border-bottom to segment style |
| **MODIFY** | `PromptInput` | Card + textarea + chips + issues restyle |
| **MODIFY** | `FrameworkPicker` | Remove inline styles, single accent color |
| **MODIFY** | `TechniquePicker` | Remove inline styles, single accent color |
| **MODIFY** | `TransformButton` | Solid button, remove shimmer/gradient |
| **MODIFY** | `ResultView` | Code block, stats, comparison restyle |
| **MODIFY** | `LearnView` | Cards, table, remove glow effects |
| **MODIFY** | `SettingsView` | Card + input styling alignment |
| **MODIFY** | `ErrorBanner` | Token name updates |
| **MODIFY** | `index.css` | Complete variable overhaul, remove decorative CSS |
| **MODIFY** | `tailwind.config.js` | New token mapping, darkMode class, reduced animations |
| **DELETE** | None | No files deleted. Decorative CSS removed from index.css, but file remains |

## Scalability Considerations

| Concern | Current (10 components) | At 20 components | At 50 components |
|---------|------------------------|-------------------|-------------------|
| Token system | CSS variables in index.css sufficient | Still fine, consider splitting into tokens.css | Extract to design-tokens package |
| Component styling | Tailwind classes inline | Consider extracting shared class sets to @apply utilities | Component library or CSS modules |
| Theme toggle | .dark class on html | Same approach works | Same approach works |
| Animation | Framer Motion page transitions | Still fine | Consider lazy-loading framer-motion |

The app is small enough that no structural changes are needed. The token system + Tailwind approach scales comfortably to 20-30 components.

## Sources

- Direct codebase analysis (all 10 components, index.css, tailwind.config.js)
- Tailwind CSS v3 documentation: `darkMode: 'class'` strategy (HIGH confidence)
- CSS Custom Properties specification: cascade and inheritance behavior (HIGH confidence)
- Project design direction from `.planning/PROJECT.md`: target aesthetic, constraints, font decisions
