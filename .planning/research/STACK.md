# Stack Research

**Domain:** UI/UX Redesign -- Developer-tool aesthetic for prompt engineering tool
**Researched:** 2026-03-08
**Confidence:** HIGH

## Core Finding: No New Dependencies Needed

The existing stack (React 18 + Vite 6 + Tailwind CSS 3.4 + Framer Motion 11) is fully sufficient for this redesign. The work is a CSS/design-token overhaul, not a technology change. Adding libraries would increase bundle size and complexity for zero gain.

The one required **configuration change** is switching Tailwind's dark mode from `prefers-color-scheme` (media query) to `class`-based toggling, enabling a manual light/dark toggle with light as default.

## Current Stack (Validated -- No Changes)

| Technology | Installed Version | Purpose | Status |
|------------|-------------------|---------|--------|
| React | 18.3.1 | UI framework | KEEP -- no changes needed |
| Vite | 6.4.1 | Build tool | KEEP -- no changes needed |
| Tailwind CSS | 3.4.19 | Utility-first CSS | KEEP -- config changes only |
| Framer Motion | 11.18.2 | Animations | KEEP -- reduce usage (less bouncy, more subtle) |
| Lucide React | 0.460.0 | Icons | KEEP -- consistent icon set |
| PostCSS + Autoprefixer | 8.4.49 / 10.4.20 | CSS processing | KEEP -- already configured |

## Required Configuration Changes

### 1. Tailwind Dark Mode: `media` to `class` Strategy

**Why:** The current CSS uses `@media (prefers-color-scheme: dark)` for theme switching. This only follows OS settings -- users cannot manually toggle. The redesign requires light as default with an explicit toggle.

**Change in `tailwind.config.js`:**
```js
export default {
  darkMode: 'class',  // ADD THIS LINE
  content: [...],
  // ...
}
```

**Impact:** All `dark:` variant utilities in Tailwind now activate based on a `.dark` class on `<html>` rather than the OS media query. The custom CSS properties in `index.css` must also change from `@media (prefers-color-scheme: dark)` to `.dark` selector. Confidence: HIGH -- this is a core Tailwind 3.x feature, well-documented.

### 2. Design Token Overhaul in CSS Custom Properties

**Why:** The current tokens are built around glassmorphism (`--glass-bg`, `--blob-1`, etc.). The redesign needs clean solid-color tokens.

**Approach:** Replace the existing CSS custom properties in `index.css`. No library needed -- CSS custom properties are the design token system.

**New token structure (replace existing):**

```css
:root {
  /* Surface hierarchy */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F8FAFC;
  --bg-tertiary: #F1F5F9;

  /* Borders */
  --border-default: #E2E8F0;
  --border-subtle: #F1F5F9;
  --border-strong: #CBD5E1;

  /* Card */
  --card-bg: #FFFFFF;
  --card-border: #E2E8F0;
  --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);

  /* Radius -- sharp developer aesthetic */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;

  /* Accent -- keep indigo family, works for dev tools */
  --accent: #4F46E5;
  --accent-hover: #4338CA;
  --accent-subtle: #EEF2FF;
  --accent-text: #FFFFFF;
}

.dark {
  --bg-primary: #0F1117;
  --bg-secondary: #161B22;
  --bg-tertiary: #1C2128;

  --border-default: #30363D;
  --border-subtle: #21262D;
  --border-strong: #484F58;

  --card-bg: #161B22;
  --card-border: #30363D;
  --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);

  --accent: #818CF8;
  --accent-hover: #A5B4FC;
  --accent-subtle: rgba(129, 140, 248, 0.12);
  --accent-text: #0F1117;
}
```

### 3. Tailwind Config: Replace Glassmorphism Tokens with Clean Tokens

**Current problems in `tailwind.config.js`:**
- `surface` colors use opacity-based `rgb(var(--color-invert) / X)` -- clever but creates murky, inconsistent colors
- No border radius tokens -- glass-card uses hardcoded `20px`
- `white`/`black` are overridden with CSS vars -- confusing, breaks Tailwind mental model

**New config approach:** Map CSS custom properties to Tailwind tokens with clear semantic names. Remove the `color-invert`/`color-base` system entirely. Use explicit light/dark values via the `.dark` class strategy.

### 4. Remove Glassmorphism CSS

**What to delete from `index.css`:**
- `.aurora-bg`, `.aurora-blob`, `.blob-1/2/3` -- aurora background effects
- `@keyframes float` -- blob animation
- `.grain-overlay` -- texture overlay
- `.glass-card` -- glass effect with `backdrop-filter: blur(24px)`
- `.glow-line` -- decorative glow
- `@keyframes glowPulse` from tailwind config

**What to replace with:**
- `.card` -- clean bordered card with subtle shadow, 6px radius
- Simple solid `background-color` on `body`

## Supporting Libraries

### Explicitly NOT Adding

| Library | Why Considered | Why NOT Adding |
|---------|---------------|----------------|
| `@tailwindcss/typography` | Prose styling for prompt output | Overkill -- prompt output is monospace code blocks, not rich prose. A few lines of custom CSS on `.code-output` achieves the same thing. |
| `tailwindcss-animate` | Animation utilities | Already have Framer Motion 11 for animations AND custom keyframes in Tailwind config. Adding a third animation system creates confusion about which to use. |
| `@radix-ui/colors` | Design token color scales | The app has ~5 semantic colors. A full P3-aware color scale system is massive overhead for this scope. Handpicked Tailwind Slate/Indigo values are sufficient. |
| `clsx` or `classnames` | Conditional class merging | With only 10 components, template literals or simple ternaries are fine. Not enough conditional styling complexity to justify a dependency. |
| `class-variance-authority` (CVA) | Component variant management | Useful for design systems with dozens of component variants. This app has ~10 components with simple states. CVA adds abstraction without payoff at this scale. |
| `tailwind-merge` | Deduplicating conflicting Tailwind classes | Only needed when composing classes from multiple sources (e.g., component libraries). Not the case here. |
| Shadcn/ui | Pre-built component library | The redesign is about visual identity, not adding pre-built components. Shadcn would impose its own design decisions and require Radix UI primitives as dependencies. The app already has working components -- they just need reskinning. |

### One Optional Addition (Low Priority)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@tailwindcss/forms` | 0.5.x | Normalizes form element styling across browsers | Only if the textarea/input restyling hits browser inconsistencies. Try without it first -- the current custom `.prompt-input` styles may be sufficient with radius/border updates. |

**Verdict:** Start with zero new dependencies. Add `@tailwindcss/forms` only if form element cross-browser issues surface during implementation.

## Installation

```bash
# No new packages needed.
# The redesign is achieved through:
# 1. tailwind.config.js changes (darkMode, tokens, radius)
# 2. index.css overhaul (remove glass, add clean tokens)
# 3. Component className updates (new utility classes)
```

## Alternatives Considered

| Category | Recommendation | Alternative | Why Not |
|----------|---------------|-------------|---------|
| Design tokens | CSS custom properties (current approach) | Style Dictionary / Design Token Studio | Enterprise tooling for multi-platform token distribution. This is a single web app -- CSS vars are the right abstraction level. |
| Dark mode toggle | Tailwind `darkMode: 'class'` + localStorage | `next-themes` or custom context | `next-themes` is Next.js-specific. A simple React context + `useEffect` to toggle `.dark` on `<html>` and persist to `localStorage` is ~15 lines of code. No library needed. |
| Color palette | Tailwind's Slate + Indigo scales | Open-source palettes (Radix Colors, IBM Carbon) | Tailwind's colors are battle-tested, already available without imports, and consistent with the existing codebase. No reason to switch. |
| Border radius | CSS custom properties (`--radius-sm/md/lg`) | Tailwind extend with fixed values | Custom properties are better because the design direction explicitly calls for "4-6px" -- having a `--radius-md: 6px` token makes it trivial to tweak globally if the team settles on 4px or 5px instead. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `backdrop-filter: blur()` | Core of the old glassmorphism look. Also has Safari performance issues and inconsistent rendering. | Solid background colors with subtle shadows |
| Gradient backgrounds for containers | Creates the "marketing page" feel the redesign is moving away from | Solid borders with 1px `--border-default` color |
| Large border-radius (12px+) | The design direction explicitly targets 4-6px for developer-tool sharpness | `--radius-sm: 4px`, `--radius-md: 6px` |
| `transform: translateY(-2px)` on hover | The current glass-card lift effect feels playful, not professional | Subtle border-color change or shadow increase on hover |
| Animated color transitions on body | Current `transition: background-color 0.3s` on body causes flash during theme toggle | Instant theme switch (no transition on `background-color` for body). Transition only on interactive elements. |
| Opacity-based surface system | `rgb(var(--color-invert) / 0.05)` creates muddy, inconsistent grays that vary by context | Explicit color values per theme: `--bg-secondary: #F8FAFC` (light) / `#161B22` (dark) |

## Implementation Patterns

### Theme Toggle (No Library Needed)

```typescript
// ~15 lines, no dependency
function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return { isDark, toggle: () => setIsDark(prev => !prev) };
}
```

### Clean Card Pattern (Replacing Glass Card)

```css
.card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-md);
  box-shadow: var(--card-shadow);
}

.card:hover {
  border-color: var(--border-strong);
}
```

Or purely in Tailwind utilities:
```html
<div class="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-md shadow-sm hover:border-slate-300">
```

### Border Radius Strategy

Add to `tailwind.config.js`:
```js
theme: {
  extend: {
    borderRadius: {
      'sharp-sm': '4px',
      'sharp': '6px',
      'sharp-lg': '8px',
    },
  },
}
```

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| tailwindcss@3.4.19 | `darkMode: 'class'` | Fully supported since Tailwind 2.x. No version concern. |
| tailwindcss@3.4.19 | `@tailwindcss/forms@0.5.x` | Official plugin, guaranteed compatible with 3.4. |
| framer-motion@11.18.2 | React 18.3.1 | Fully compatible. Framer Motion 11 supports React 18. |
| vite@6.4.1 | tailwindcss@3.4.19 via PostCSS | Already working. No changes needed. |

**Note on Tailwind v4:** Tailwind CSS v4 was released in early 2025. It uses a new CSS-first configuration approach and drops `tailwind.config.js`. The project is on v3.4.19 and should stay there for this redesign -- migrating to v4 mid-redesign would double the scope. Tailwind v3 is stable and will receive maintenance updates. Consider v4 migration as a separate future effort.

## Sources

- Installed `node_modules/tailwindcss/package.json` -- version 3.4.19 confirmed
- Installed `node_modules/framer-motion/package.json` -- version 11.18.2 confirmed
- Existing `tailwind.config.js` and `src/index.css` -- current token/theme analysis
- Tailwind CSS docs (training data, verified against v3.4 features) -- `darkMode: 'class'` is a stable, core feature since v2. MEDIUM confidence (unable to verify current docs live, but this is foundational Tailwind functionality unlikely to have changed).
- General design systems knowledge -- CSS custom properties as design tokens is industry standard practice. HIGH confidence.

---
*Stack research for: Prompt Studio v1.1 UI/UX Redesign*
*Researched: 2026-03-08*
