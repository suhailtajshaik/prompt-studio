# Pitfalls Research

**Domain:** UI/UX Redesign of Existing React App (Prompt Studio v1.1)
**Researched:** 2026-03-08
**Confidence:** HIGH (based on direct codebase analysis + established patterns)

## Critical Pitfalls

### Pitfall 1: Hardcoded Colors Scattered Across Inline Styles

**What goes wrong:**
The current codebase uses extensive inline `style` attributes with hardcoded hex colors and raw `rgba()` values. FrameworkPicker builds colors via template literals like `` `${fw.color}08` ``, `` `${fw.color}60` ``, `` `${fw.color}15` ``. ResultView has hardcoded `#00d4aa`, `#ff5c5c`, `#e8b931` directly in JSX. During redesign, some of these get updated to the new palette while others get missed, creating a visual Frankenstein -- half old design, half new.

**Why it happens:**
Developers update the CSS custom properties in `index.css` and the Tailwind config, then assume that covers everything. But the inline `style` attributes bypass both systems entirely.

**How to avoid:**
Before any visual changes, audit and catalog every inline `style` attribute across all 10 components. Create a color inventory. Move inline colors to either Tailwind classes or CSS custom properties FIRST, as a preparatory refactor, before changing any actual colors.

**Phase to address:** Phase 1 (Foundation) -- extract inline styles to design tokens before any visual redesign begins.

---

### Pitfall 2: Theme Switching Breaks When Moving from prefers-color-scheme to Manual Toggle

**What goes wrong:**
The current app uses `@media (prefers-color-scheme: dark)` in `index.css` to swap CSS custom properties. Moving to a user-controlled toggle often breaks because: (a) the media query still fires and conflicts with the manual toggle, (b) Tailwind's `dark:` variant isn't configured, and (c) hardcoded rgba values don't respond to either system.

**How to avoid:**
Pick ONE theming strategy and commit:
1. Add `darkMode: 'class'` to `tailwind.config.js`
2. Move CSS custom property definitions from `@media (prefers-color-scheme: dark)` to a `.dark` class selector
3. Use JavaScript to read `prefers-color-scheme` as the DEFAULT, but let the user override via toggle
4. Store the user's preference in `localStorage`

Do this as an atomic change -- do not partially migrate.

**Phase to address:** Phase 1 (Foundation) -- theming infrastructure must be settled before any visual tokens are defined.

---

### Pitfall 3: Removing Glassmorphism Breaks Layout Structure

**What goes wrong:**
The current `.glass-card` class provides `backdrop-filter: blur(24px)`, semi-transparent backgrounds, and specific `border-radius: 20px`. When you remove the aurora blobs and glass effect, cards that previously "floated" now look flat and indistinguishable from the background. The visual hierarchy collapses.

**How to avoid:**
Design the replacement card system BEFORE removing the glass effects. Define:
- Card background color (solid, distinct from page background)
- Border style (1px solid with defined color, not alpha-based)
- Shadow (subtle, not glass-shadow)
- Border radius (4-6px per design direction)
- Spacing/padding adjustments

Apply the new card system and remove the glass system in the same commit per component, not globally.

**Phase to address:** Phase 2 (Component Redesign) -- but the replacement design tokens must be defined in Phase 1.

---

### Pitfall 4: Framer Motion Animations Mismatched with New Aesthetic

**What goes wrong:**
The current app uses `whileHover={{ scale: 1.01 }}`, stagger animations, and page transitions. A "clean developer tool" aesthetic typically has minimal, snappy animations -- not bouncy, floaty ones. Developers often forget to update animation parameters when they update the visual design.

**How to avoid:**
Create a centralized motion config file (e.g., `src/motion.js`) with named animation presets. Remove `whileHover={{ scale }}` from framework/technique picker cards -- clean dev tools use color/border changes on hover, not scale transforms.

**Phase to address:** Phase 1 (Foundation) -- define motion tokens. Phase 2 -- apply per component.

---

### Pitfall 5: Accessibility Regression During Visual Overhaul

**What goes wrong:**
New color palettes haven't been tested for WCAG contrast ratios, focus styles get accidentally removed when restyling buttons, and light-default often means text-on-light-background contrast is insufficient.

**How to avoid:**
- Check EVERY color combination against WCAG 2.1 AA (4.5:1 for body text, 3:1 for large text/UI)
- Add explicit `focus-visible:` ring styles to every interactive element
- The `::selection` style currently uses `color: #fff` with `background: var(--accent-muted)` -- verify contrast in both themes
- Test with keyboard navigation after each component is restyled

**Phase to address:** Every phase -- bake contrast checking into design token definitions (Phase 1) and verify per component (Phase 2+).

---

### Pitfall 6: Tailwind Class Purge Removes Dynamically-Constructed Classes

**What goes wrong:**
The codebase constructs Tailwind classes dynamically. During refactoring, if someone introduces new dynamic classes via template literals, Tailwind's JIT compiler may not detect them and they get purged from the build output.

**How to avoid:**
- NEVER construct Tailwind class names dynamically with template literals
- When migrating inline styles to Tailwind, use complete class names or a lookup map
- If a color value must be dynamic, keep it as an inline style or CSS custom property

**Phase to address:** Phase 2 (Component Redesign) -- enforce as a code review rule.

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Hardcoded inline colors | Phase 1: Extract to design tokens | `grep -c 'style={{' src/components/` returns 0 for color-related inline styles |
| Theme toggle conflict | Phase 1: Set up theming infrastructure | Toggle works, localStorage persists, no flash on reload |
| Glass removal hierarchy loss | Phase 1: Define card system tokens; Phase 2: Apply per component | Each card visually distinct from page background in both themes |
| Animation aesthetic mismatch | Phase 1: Define motion tokens; Phase 2: Apply | No `scale` hover transforms; all transitions under 200ms |
| Accessibility regression | Phase 1: Palette contrast verification; Phase 2: Per-component audit | Lighthouse accessibility score >= 95; all text passes WCAG AA |
| Tailwind class purge | Phase 2: Code review rule | Production build visually matches dev build exactly |

## "Looks Done But Isn't" Checklist

- [ ] Theme toggle persists across page reload (localStorage)
- [ ] Inline `style` colors in FrameworkPicker, ResultView stats also updated
- [ ] Inner elements have proportional border radii
- [ ] Tab through entire app with keyboard -- focus rings visible and styled
- [ ] Switch to dark mode and check every component
- [ ] Scrollbar inside code-output and result containers matches theme
- [ ] `::selection` contrast proper in both themes
- [ ] TransformButton loading spinner matches new design
- [ ] ErrorBanner visible and readable in new design
- [ ] Empty states (no result, placeholder text) match new design

---
*Pitfalls research for: Prompt Studio v1.1 UI/UX Redesign*
*Researched: 2026-03-08*
