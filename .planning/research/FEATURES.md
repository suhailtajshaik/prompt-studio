# Feature Research: UI/UX Redesign for Prompt Studio

**Domain:** Developer tool UI/UX -- prompt engineering tool redesign
**Researched:** 2026-03-08
**Confidence:** MEDIUM (based on established dev-tool UX patterns; no live web search available to verify latest 2026 trends)

## Feature Landscape

### Table Stakes (Users Expect These)

Design features that modern developer tools universally ship. Missing any of these makes the tool feel amateur or unfinished.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Clean card-based layout with consistent spacing** | Every modern dev tool (Vercel, Linear, Raycast) uses tight 4/8px grid spacing with bordered cards, not glass effects. Users associate glassmorphism with landing pages, not working tools. | MEDIUM | Replace `.glass-card` with solid-bg bordered cards. Switch from 20px to 4-6px border-radius per PROJECT.md direction. Requires touching every component. |
| **Proper visual hierarchy via typography scale** | Users scan top-to-bottom; section headers, field labels, helper text must be clearly differentiated by size/weight/color. Currently all sections use `text-sm font-semibold` uniformly. | LOW | Define 4-level type scale: page title (18-20px semibold), section header (14px medium), label (13px medium), helper (12px regular muted). Apply to all 10 components. |
| **Focus states and keyboard navigation indicators** | Developer users are keyboard-heavy. Current focus is accent border glow only on textarea. Framework/technique cards have no visible focus ring. | LOW | Add `focus-visible:ring-2 ring-accent/40 ring-offset-2` to all interactive elements. Requires updating FrameworkPicker, TechniquePicker, TabBar, buttons. |
| **Intentional color palette with semantic meaning** | Current palette mixes hardcoded hex colors (`#ff5c5c`, `#00d4aa`, `#e8b931`) with CSS variable accents. Inconsistent. Dev tools use 1 accent + neutral gray scale + semantic colors (success/warning/error). | MEDIUM | Define design tokens: 1 primary accent (indigo already chosen), neutral gray scale (slate), success (green), warning (amber), error (red). Replace all hardcoded colors. |
| **Light theme as true first-class citizen** | PROJECT.md says "light default." Current light mode works via `prefers-color-scheme` but many component styles use `bg-white/3`, `border-white/6` -- these rely on `--color-invert` which is black in light mode, producing near-invisible borders/surfaces. | HIGH | Audit every component for `white/N` and `surface-N` usage. These invert incorrectly. Need proper light-mode card backgrounds (white with gray border) vs dark-mode (gray-900 with gray-700 border). Biggest single effort item. |
| **Responsive but desktop-primary layout** | Tool is desktop-primary but must not break on tablet. Current single-column 880px max-width is fine but framework cards at `md:grid-cols-3` can get cramped. | LOW | Keep 880px max-width. Ensure grid breakpoints work at 768px. Minor CSS tweaks only. |
| **Smooth but restrained animations** | Current animations are good (Framer Motion page transitions, stagger children) but some are gratuitous: hover scale on framework cards, shimmer on transform button, floating aurora blobs. Dev tools use enter/exit transitions, not continuous ambient motion. | MEDIUM | Keep: page transition fades, stagger-in on load, button press feedback. Remove: aurora float animation, shimmer overlay, hover translateY on cards, glowPulse. Reduce motion for `prefers-reduced-motion`. |
| **Theme toggle (not just system preference)** | Current theme uses only `prefers-color-scheme` media query -- users cannot manually switch. Every developer tool ships a toggle. | MEDIUM | Add theme state to App (system/light/dark). Store in localStorage. Replace `@media (prefers-color-scheme)` with class-based `.dark` on `<html>`. Requires refactoring CSS custom properties. Depends on: new color system. |

### Differentiators (Competitive Advantage)

Design features that elevate beyond baseline. Not expected, but make the tool feel premium and thoughtful.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Step-progress indicator for the build flow** | Makes the input-options-transform journey explicit. Shows users where they are (1. Paste prompt, 2. Pick framework, 3. Choose techniques, 4. Transform). Reduces cognitive load. Linear, Stripe, and Vercel use this pattern for multi-step flows. | MEDIUM | Add a horizontal stepper above the build tab content. 4 steps with connecting line. Highlight active/completed steps. Pure presentational -- does not change functionality. Depends on: clean card layout (table stakes). |
| **Inline prompt quality meter (progress bar style)** | Current score badge (`72/100 . B`) is small and easy to miss. A horizontal progress bar with color gradient (red-yellow-green) beneath the textarea makes quality feedback visceral and satisfying. | LOW | Replace text badge with a thin 4px progress bar below textarea. Color interpolates from red (0-40) through amber (40-70) to green (70-100). Score text moves to right end. Existing `analyzePrompt` data is already computed. |
| **Collapsible before/after diff in result view** | Current before/after is always visible and takes significant vertical space. A collapsible accordion defaults closed (most users want the improved prompt, not the comparison) and reduces scroll. | LOW | Wrap the "Before vs After" section in a disclosure component. Default collapsed. Use Framer Motion `AnimatePresence` for height animation. Already have the library. |
| **Contextual tooltips on framework/technique cards** | Explain what each framework/technique does on hover without navigating to the Learn tab. Reduces tab-switching friction. | LOW | Add title tooltips or small popovers on hover/focus for each framework and technique card. Content already exists in constants data. No new dependencies needed -- CSS-only tooltips or Framer Motion popover. |
| **Copy-to-clipboard with format options** | Beyond plain text copy, offer "Copy as Markdown" for users pasting into ChatGPT/Claude interfaces that render markdown. Small feature, high satisfaction for the target audience. | LOW | Add a dropdown or secondary button next to Copy. Wrap result in markdown code fence for the markdown option. Minimal code change. |
| **Subtle skeleton loading state** | Current loading shows spinner text "Transforming your prompt..." which is fine but a skeleton placeholder in the result view (pulsing gray blocks where the output will appear) feels more polished and sets spatial expectations. | LOW | Add a skeleton component with 3-4 pulsing `animate-pulse` bars. Show in ResultView when loading. Tailwind has `animate-pulse` built in. |
| **Monospace line numbers in result output** | Developer users expect code-like output to have line numbers (like a code editor). Adds professionalism for minimal effort. | LOW | Wrap result text in a `<pre>` with line-number gutter. Split result by newlines, prepend line numbers. CSS grid with fixed-width gutter. |
| **Keyboard shortcut for transform** | `Cmd+Enter` / `Ctrl+Enter` to trigger transform without clicking. Developer-expected pattern from every IDE and terminal. | LOW | Add `onKeyDown` handler to textarea: if `(cmd/ctrl)+Enter` and prompt non-empty, trigger transform. 5 lines of code. |

### Anti-Features (Commonly Requested, Often Problematic)

Design features that seem like good ideas but create problems for this specific redesign scope.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Complex multi-pane/split-view layout** | "IDE-like experience" feels powerful | Adds massive layout complexity, fights the clean single-column flow, poor on smaller screens. The tool's flow is linear (input -> options -> output), not parallel. Split-view suits editors, not transformers. | Keep single-column with clear vertical sections. The step indicator (differentiator above) provides the same "professional tool" feel without layout complexity. |
| **Animated background effects (new style)** | "The aurora was cool, replace it with something equally eye-catching" | Any ambient background animation (particles, gradients, waves) fights the "developer tool" aesthetic. Tools like Linear, Vercel Dashboard, and Supabase Studio use flat solid backgrounds because content is the focus. | Solid `#FAFBFC` (light) / `#0D1117` (dark) background. Let the cards, typography, and accent color carry the visual identity. |
| **Elaborate onboarding tour or walkthrough** | "New users might not know what to do" | The tool has 4 steps. It is self-explanatory. A tour adds code complexity and annoys repeat users. Tools this simple do not need onboarding. | Good placeholder text, example prompt chips (already exist), and the step indicator together serve as implicit onboarding. |
| **Custom theme builder / accent color picker** | "Let users personalize their experience" | Scope creep. Doubles CSS complexity. The tool is used briefly (transform a prompt, copy, leave) -- not a daily workspace users want to personalize. | Ship one excellent light + dark theme. Revisit personalization only if usage data shows long sessions. |
| **Drag-and-drop reordering of techniques** | "Let users prioritize which techniques matter most" | Technique order does not meaningfully affect the AI prompt transformation. Adds DnD complexity (library or custom) for zero functional benefit. | Keep the current multi-select toggle. Order in the UI is presentation only. |
| **Real-time streaming of AI response** | "Show the improved prompt as it generates" | This is a feature change, not a design change. Out of scope per PROJECT.md. Also requires SSE/streaming API changes on the backend side. | Keep the current request-response model. The skeleton loading state (differentiator) makes the wait feel short. |

## Feature Dependencies

```
[Clean card layout + color system]
    |-- required by --> [Theme toggle] (needs class-based theming, not media query)
    |-- required by --> [Step progress indicator] (visual consistency)
    |-- required by --> [Light theme first-class] (card bg/border must work in both modes)

[Typography scale]
    |-- enhances --> [Step progress indicator] (label sizing)
    |-- enhances --> [Collapsible diff] (section header treatment)

[Semantic color tokens]
    |-- required by --> [Inline quality meter] (needs red-amber-green gradient)
    |-- required by --> [Light theme first-class] (hardcoded colors break in light)

[Focus states]
    |-- enhances --> [Keyboard shortcut] (visual feedback on focus)

[Reduced motion support]
    |-- modifies --> [All animations] (must respect prefers-reduced-motion)
```

### Dependency Notes

- **Clean card layout requires color system first:** Cannot restyle cards without knowing the final token values for backgrounds, borders, and shadows in both themes.
- **Theme toggle requires class-based theming:** Current `@media (prefers-color-scheme)` approach cannot support a manual toggle. Must refactor to `.dark` class on root element before building the toggle UI.
- **Light theme first-class requires semantic color audit:** The `white/N` opacity pattern used throughout components assumes dark mode. Must be replaced with explicit light/dark token values before light mode is presentable.

## MVP Definition

### Launch With (Phase 1: Foundation)

These must land first because everything else depends on them.

- [ ] **New color system + design tokens** -- Define all colors as explicit light/dark pairs, not opacity-based inversion. This unblocks every other visual change.
- [ ] **Card component restyle** -- Solid backgrounds, 4-6px radius, subtle borders, clean shadows. Replace `.glass-card` globally.
- [ ] **Typography scale** -- 4-level hierarchy applied consistently across all 10 components.
- [ ] **Remove aurora/grain/glow effects** -- Strip ambient background effects, switch to solid background color.
- [ ] **Light theme audit** -- Fix every `white/N` and `surface-N` usage that breaks in light mode.

### Add After Foundation (Phase 2: Polish)

Once the base looks clean, layer on UX improvements.

- [ ] **Theme toggle** -- Manual light/dark switch with localStorage persistence. Requires class-based theming from Phase 1.
- [ ] **Focus states + keyboard shortcut** -- `Cmd+Enter` transform, visible focus rings on all interactive elements.
- [ ] **Step progress indicator** -- Horizontal stepper for build flow.
- [ ] **Inline quality meter** -- Progress bar replacing score badge.
- [ ] **Animation cleanup** -- Remove gratuitous animations, keep meaningful transitions, add `prefers-reduced-motion` support.

### Future Consideration (Phase 3: Delight)

Nice-to-haves that add polish but are not essential for the redesign.

- [ ] **Skeleton loading state** -- Pulsing placeholder in result view during transform.
- [ ] **Collapsible before/after diff** -- Accordion in result view.
- [ ] **Copy as Markdown option** -- Secondary copy format.
- [ ] **Line numbers in result output** -- Code-editor style gutter.
- [ ] **Contextual tooltips on cards** -- Hover/focus info popovers.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| New color system + design tokens | HIGH | MEDIUM | P1 |
| Card component restyle | HIGH | MEDIUM | P1 |
| Typography scale | HIGH | LOW | P1 |
| Remove aurora/grain/glow | HIGH | LOW | P1 |
| Light theme audit | HIGH | HIGH | P1 |
| Theme toggle | HIGH | MEDIUM | P2 |
| Focus states + keyboard nav | MEDIUM | LOW | P2 |
| Keyboard shortcut (Cmd+Enter) | MEDIUM | LOW | P2 |
| Step progress indicator | MEDIUM | MEDIUM | P2 |
| Inline quality meter | MEDIUM | LOW | P2 |
| Animation cleanup | MEDIUM | MEDIUM | P2 |
| Skeleton loading state | LOW | LOW | P3 |
| Collapsible diff | LOW | LOW | P3 |
| Copy as Markdown | LOW | LOW | P3 |
| Line numbers in output | LOW | LOW | P3 |
| Contextual tooltips | LOW | LOW | P3 |

**Priority key:**
- P1: Foundation -- must land before anything else looks right
- P2: Polish -- makes the tool feel professional and intentional
- P3: Delight -- small touches that add craft

## Competitor Feature Analysis

Analysis based on known developer tool and prompt engineering tool UX patterns.

| Feature | Vercel Dashboard | Linear | ChatGPT/Claude UI | Our Approach |
|---------|-----------------|--------|-------------------|--------------|
| **Card style** | Solid white/dark cards, 8px radius, 1px gray border, subtle shadow | Solid cards, 6px radius, minimal border, tight spacing | Full-width sections, no visible card borders | Solid cards, 4-6px radius, 1px border, light shadow. Between Linear's tightness and Vercel's definition. |
| **Color palette** | Black/white + blue accent. Minimal color. | Purple accent on neutral gray. Very restrained. | White/dark bg, green accent (GPT), orange (Claude). Minimal. | Indigo accent (already chosen) on slate gray scale. One accent, not gradient. |
| **Typography** | Inter/Geist, tight scale, heavy use of muted secondary text | Inter, small text sizes, high information density | System fonts, generous sizing, lots of whitespace | Inter + JetBrains Mono (keep). Tighten scale. Use muted text for metadata. |
| **Animations** | Minimal -- page transitions, no hover effects on cards | Smooth but fast transitions (150-200ms). No ambient motion. | Streaming text only. Almost no UI animation. | Keep Framer page transitions (reduce to 200ms). Remove hover scale/translate on cards. No ambient effects. |
| **Theme toggle** | Yes, in header/settings | Yes, in settings. System/light/dark. | Yes, in settings menu | Add toggle. System/light/dark. Store in localStorage. |
| **Layout** | Full-width with sidebar nav | Sidebar + main content | Full-width centered column | Keep centered column (no sidebar needed for 4 tabs). Max-width 880px is good. |
| **Loading states** | Skeleton loaders everywhere | Skeleton + progress indicators | Streaming text cursor | Skeleton loader for result view. Keep spinner for transform button. |
| **Code display** | Syntax-highlighted, line numbers, copy button | Minimal code display | Code blocks with copy, no line numbers | JetBrains Mono, line numbers, copy button. Already halfway there. |

## Sources

- Direct analysis of existing Prompt Studio codebase (10 components, CSS, Tailwind config)
- PROJECT.md design direction table (established targets)
- Established UX patterns from Vercel, Linear, Supabase, Raycast, Stripe developer tools (based on training data, MEDIUM confidence)
- General developer tool design conventions (HIGH confidence -- these patterns are well-established and stable)

**Confidence note:** No live web search was available to verify latest 2026 design trends. Recommendations are based on well-established developer tool patterns that have been consistent since 2023-2025. The risk of these patterns being outdated is LOW -- developer tool aesthetics evolve slowly.

---
*Feature research for: Prompt Studio UI/UX Redesign*
*Researched: 2026-03-08*
