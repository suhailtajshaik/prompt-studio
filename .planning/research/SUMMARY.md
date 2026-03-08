# Project Research Summary

**Project:** Prompt Studio v1.1 UI/UX Redesign
**Domain:** Developer tool visual redesign (CSS/design-token overhaul, not feature development)
**Researched:** 2026-03-08
**Confidence:** HIGH

## Executive Summary

Prompt Studio is a prompt engineering tool built with React 18, Vite 6, Tailwind CSS 3.4, and Framer Motion 11. The v1.1 redesign is a purely visual transformation: stripping a glassmorphism aesthetic (aurora blobs, backdrop-blur cards, gradient effects) and replacing it with a clean, developer-tool look (solid surfaces, tight border radii, single accent color, proper light/dark theming). No new dependencies are needed. The existing stack is fully sufficient -- this is a CSS custom property overhaul, a Tailwind config update, and a component-by-component className migration.

The recommended approach is a strict foundation-first build order. The design token system (CSS custom properties + Tailwind config) must be fully replaced before any component restyling begins. The current theming uses `prefers-color-scheme` media queries and an opacity-based color inversion system (`rgb(var(--color-invert) / X)`) that produces inconsistent results, especially in light mode. Both must be ripped out and replaced atomically with a `.dark` class strategy and explicit color values per theme. Once the foundation is solid, components can be restyled in dependency order with no backtracking.

The primary risks are: (1) scattered inline `style={{}}` attributes with hardcoded hex colors that bypass the design token system entirely -- these must be inventoried and eliminated before visual changes; (2) partial migration creating a visual Frankenstein where some components are glass and others are clean; and (3) accessibility regression from untested contrast ratios in the new light-default palette. All three are mitigated by the foundation-first approach and per-component verification.

## Key Findings

### Recommended Stack

No new packages. Zero dependencies added. The redesign is achieved entirely through configuration changes and CSS/className updates to the existing stack.

**Core technologies (all KEEP, no version changes):**
- **React 18.3.1:** UI framework -- no changes needed
- **Tailwind CSS 3.4.19:** Utility CSS -- config changes only (`darkMode: 'class'`, new color/radius/shadow tokens). Stay on v3; do NOT migrate to Tailwind v4 mid-redesign.
- **Framer Motion 11.18.2:** Animations -- reduce usage (remove hover scale transforms, keep page transitions)
- **Vite 6.4.1 + PostCSS:** Build tooling -- no changes needed

**Critical configuration change:** Switch Tailwind `darkMode` from default (media query) to `'class'` to enable manual light/dark toggle.

**Explicitly rejected:** Shadcn/ui, Radix UI, CVA, tailwind-merge, clsx, @radix-ui/colors, tailwindcss-animate. At 10 components, none provide proportional value.

### Expected Features

**Must have (table stakes -- P1 Foundation):**
- Clean card-based layout replacing glassmorphism (solid bg, 4-6px radius, 1px borders)
- Semantic design token system with explicit light/dark values (not opacity-based inversion)
- Typography scale with 4 clear hierarchy levels
- Light theme as true first-class citizen (audit all `white/N` and `surface-N` breakages)
- Removal of all decorative effects (aurora blobs, grain overlay, glow lines, shimmer)

**Should have (P2 Polish):**
- Manual theme toggle with localStorage persistence
- Focus states and keyboard navigation on all interactive elements
- `Cmd+Enter` keyboard shortcut for transform
- Step progress indicator for the build flow
- Inline prompt quality meter (progress bar replacing badge)
- Animation cleanup with `prefers-reduced-motion` support

**Defer (P3 Delight / v2+):**
- Skeleton loading states, collapsible before/after diff, copy-as-markdown, line numbers in output, contextual tooltips on cards
- Anti-features to never build: split-view layout, animated backgrounds, custom theme builder, drag-and-drop technique reordering, streaming AI response

### Architecture Approach

The existing component architecture is clean and requires no structural changes. All 10 components are functional, props flow top-down from App.jsx, and there is one custom hook (`useTransform`). The redesign is purely presentational. Only one new component is needed: `ThemeToggle` (plus a `useTheme` hook). The strategy is in-place reskinning, not rewrite.

**Key architectural decisions:**
1. **Replace `.glass-card` with `.card`** -- solid background, 1px border, subtle shadow, 6-8px radius
2. **Single accent color for all active states** -- eliminate per-framework color system (teal/gold/purple) in favor of consistent indigo accent. This removes the hardcoded inline `style={{}}` problem entirely.
3. **Semantic CSS custom properties** -- replace `--glass-*`, `--color-invert`/`--color-base` with `--color-surface`, `--color-border`, `--color-text-*` etc.
4. **State-driven styling via className, not inline style** -- migrate FrameworkPicker/TechniquePicker/ResultView from computed style objects to Tailwind class conditionals

### Critical Pitfalls

1. **Hardcoded inline colors bypass the design system** -- FrameworkPicker, TechniquePicker, ResultView, PromptInput all use `style={{}}` with hex colors. Audit and extract ALL inline colors to tokens before changing any visual values.
2. **Theme toggle conflict with media query** -- Switching from `@media (prefers-color-scheme)` to `.dark` class must be atomic. Partial migration causes the media query and manual toggle to fight each other.
3. **Glass removal collapses visual hierarchy** -- Removing blur/transparency without a replacement card system makes cards indistinguishable from background. Define the replacement card tokens BEFORE removing glass effects.
4. **Tailwind class purge on dynamic construction** -- Never build Tailwind class names with template literals. Use complete class names or lookup maps when migrating inline styles.
5. **Accessibility regression** -- New light-default palette must pass WCAG AA contrast ratios (4.5:1 body text, 3:1 UI). Check every token pair. Add `focus-visible:ring` to all interactive elements.

## Implications for Roadmap

### Phase 1: Design System Foundation
**Rationale:** Everything depends on this. Tokens cascade to all components; getting them right first prevents backtracking and visual Frankenstein states.
**Delivers:** Complete CSS custom property system (light + dark), updated Tailwind config, `.dark` class strategy, `.card` base class, removal of all decorative CSS (aurora, grain, glow, glass).
**Addresses:** Color system + design tokens (P1), remove aurora/grain/glow (P1), Tailwind darkMode config change
**Avoids:** Pitfall 2 (theme conflict), Pitfall 3 (hierarchy collapse), Pitfall 1 (partial inline color awareness -- audit happens here)
**Note:** After this phase, the app will look "broken but functional" -- components reference updated tokens but have not been individually restyled yet.

### Phase 2: Core Layout and Navigation
**Rationale:** App.jsx shell, Header, TabBar, and ThemeToggle set the visual frame. Users see these on every tab. Fixing them first makes all subsequent component work feel grounded.
**Delivers:** Clean layout shell (solid bg, proper spacing), simplified Header, restyled TabBar, functional ThemeToggle with localStorage persistence, useTheme hook.
**Addresses:** Theme toggle (P2), App.jsx decorative wrapper removal, Header/TabBar restyle
**Avoids:** Pitfall 4 (animation mismatch -- define motion tokens here)

### Phase 3: Build Tab Components
**Rationale:** The Build tab is the primary user flow (PromptInput, FrameworkPicker, TechniquePicker, TransformButton). This is the highest-traffic path and should be polished first.
**Delivers:** Restyled prompt input, framework/technique selection cards with single accent color, clean transform button without shimmer/gradient, elimination of all inline `style={{}}` color attributes in these components.
**Addresses:** Card restyle (P1), typography scale (P1), light theme audit (P1), focus states (P2), keyboard shortcut (P2)
**Avoids:** Pitfall 1 (inline colors), Pitfall 6 (class purge -- use lookup maps not template literals)

### Phase 4: Result, Learn, Settings Views
**Rationale:** Secondary views that complete the redesign. Can be done in parallel since they are independent.
**Delivers:** Restyled ResultView (code output, stats, comparison), LearnView (cards, tables), SettingsView (inputs, cards), ErrorBanner, Footer.
**Addresses:** Remaining component restyling, inline color elimination in ResultView/LearnView
**Avoids:** Pitfall 5 (accessibility -- full keyboard nav audit here)

### Phase 5: Polish and Differentiators
**Rationale:** Once the foundation is solid and all components are restyled, layer on UX enhancements that elevate the experience.
**Delivers:** Step progress indicator, inline quality meter, animation cleanup, `prefers-reduced-motion` support, skeleton loading state, collapsible diff, any remaining P3 items the team chooses to include.
**Addresses:** All P2 differentiators and selected P3 delight features

### Phase Ordering Rationale

- **Foundation before components:** The token system cascades everywhere. Changing tokens first shifts the baseline for all 10 components simultaneously, even before individual restyling. This is the single most impactful change.
- **Layout shell before content:** Header/TabBar/ThemeToggle create the visual frame. Without the frame, individual component restyling feels disconnected.
- **Primary flow before secondary views:** Build tab is the core user journey. Polish it first, then handle Result/Learn/Settings.
- **Differentiators last:** New UX features (step indicator, quality meter) are additive. They should only be built on a clean, stable visual foundation.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** Needs careful token definition -- the exact color values for light/dark themes should be validated against WCAG contrast requirements. Consider using a contrast checker tool during implementation.
- **Phase 3:** The inline style elimination in FrameworkPicker/TechniquePicker requires a decision on whether to use a single accent color or preserve per-framework colors via CSS classes. Research recommends single accent (simpler), but the team may want to preserve visual distinction.

Phases with standard patterns (skip research-phase):
- **Phase 2:** Theme toggle + layout shell is a well-documented Tailwind pattern. The useTheme hook is ~15 lines.
- **Phase 4:** Straightforward component restyling following the same patterns established in Phase 3.
- **Phase 5:** All differentiator features are LOW complexity with established patterns.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Direct analysis of installed node_modules. All version numbers verified. No new dependencies needed -- this is the strongest finding. |
| Features | MEDIUM | Based on established dev-tool UX patterns (Vercel, Linear, Raycast). No live 2026 trend verification, but developer tool aesthetics evolve slowly. Risk of being outdated is LOW. |
| Architecture | HIGH | Direct codebase analysis of all 10 components, CSS, and Tailwind config. Component tree, data flow, and integration points fully mapped. |
| Pitfalls | HIGH | Pitfalls identified from direct code inspection (inline styles, theme conflicts). These are concrete, not speculative. |

**Overall confidence:** HIGH

### Gaps to Address

- **Exact color token values:** The research provides two slightly different token sets (STACK.md and ARCHITECTURE.md use similar but not identical hex values). The team should settle on one canonical set during Phase 1 implementation. Use the ARCHITECTURE.md set as the starting point -- it is more comprehensive (includes semantic colors, code block tokens).
- **Per-framework color decision:** Research recommends single accent color for all active states (simplest), but the team may want per-framework distinction. This needs a design decision before Phase 3.
- **Font stack finalization:** Research assumes Inter + JetBrains Mono (already loaded). ARCHITECTURE.md drops Outfit from display font. Confirm this aligns with design intent.
- **Tailwind v4 migration:** Explicitly deferred. Should be a separate project after the redesign is complete.

## Sources

### Primary (HIGH confidence)
- Direct codebase analysis: all 10 React components, `index.css`, `tailwind.config.js`, `package.json`
- Installed `node_modules` package.json files for version verification
- `.planning/PROJECT.md` design direction and constraints

### Secondary (MEDIUM confidence)
- Tailwind CSS v3 documentation: `darkMode: 'class'` strategy, CSS custom properties integration (training data, verified against known v3.4 features)
- Established developer tool UX patterns from Vercel, Linear, Supabase, Raycast, Stripe (training data, patterns stable since 2023)

### Tertiary (LOW confidence)
- None. All findings are grounded in direct code analysis or well-established patterns.

---
*Research completed: 2026-03-08*
*Ready for roadmap: yes*
