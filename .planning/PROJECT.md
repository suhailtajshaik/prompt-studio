# Prompt Studio

## What This Is

A prompt engineering tool that transforms vague, poorly structured prompts into production-ready ones. Users paste a bad prompt, pick a framework (COSTAR, 6-Step, Markdown Prompting) and techniques, then get an AI-rewritten prompt via Claude/Gemini/OpenRouter APIs.

## Core Value

Users can turn any vague prompt into a structured, production-ready prompt in under 60 seconds.

## Current Milestone: v1.1 UI/UX Redesign

**Goal:** Transform the visual identity and user experience from dark glassmorphism to a clean, sharp, professional developer-tool aesthetic — same functionality, better skin.

**Target features:**
- Complete visual overhaul (colors, typography, spacing, cards, backgrounds)
- Layout restructure (better grouping, hierarchy, less visual noise)
- Improved UX flow (clearer journey: input → options → result)
- Light + dark theme support (light default)

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ AUTH-FREE: No auth required — paste API key, start using
- ✓ TRANSFORM: AI-powered prompt transformation via Claude/Gemini/OpenRouter
- ✓ FRAMEWORKS: 3 frameworks (COSTAR, 6-Step, Markdown Prompting)
- ✓ TECHNIQUES: 6 techniques (Zero-Shot, Few-Shot, CoT, Role, Structured Output, Meta)
- ✓ ANALYSIS: Real-time prompt quality analysis with scoring
- ✓ RESULT: Before/after comparison with stats
- ✓ COPY: One-click copy and download as .txt
- ✓ LEARN: Built-in frameworks reference tab
- ✓ SETTINGS: Multi-provider API key configuration
- ✓ THEME: Light/dark mode via prefers-color-scheme

### Active

<!-- Current scope: UI/UX Redesign -->

- [ ] Visual overhaul — clean, sharp developer-tool aesthetic
- [ ] Layout restructure — better grouping and hierarchy
- [ ] UX flow improvement — clearer user journey
- [ ] Light + dark theme refinement — light default, both polished

### Out of Scope

- New features (prompt history, saved prompts, sharing) — redesign only
- Backend/API changes — purely frontend visual work
- Mobile-first redesign — desktop primary, mobile should work but not the focus

## Context

- React 18 + Vite 6 + Tailwind CSS 3 + Framer Motion 11
- Current UI: dark glassmorphism with aurora blobs, grain overlay, glass cards
- 10 components, single-page tabbed layout (Build, Result, Learn, Settings)
- CSS uses custom properties for theming (light/dark)
- Reference inspiration: clean SaaS landing pages, card-based layouts

## Constraints

- **Tech stack**: React + Vite + Tailwind — no framework changes
- **Scope**: Visual/UX only — no new features, no API changes
- **Dependencies**: Keep Framer Motion, Lucide React — no new deps unless essential

## Design Direction

| Aspect | Current | Target |
|--------|---------|--------|
| **Theme** | Dark glassmorphism, aurora blobs | Clean solid backgrounds, light default |
| **Typography** | Inter + JetBrains Mono | Keep Inter + JetBrains Mono |
| **Colors** | Teal/green accent on dark | TBD — curated palette for prompt tool |
| **Shape** | Rounded 16-20px radius | Sharp 4-6px radius |
| **Background** | Aurora blobs + grain overlay | Clean solid color |
| **Cards** | Glass blur + glow | Clean bordered cards with subtle shadow |
| **Feel** | Marketing page | Developer tool |

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Sharp radius (4-6px) | Developer-tool precision, less playful | — Pending |
| Clean solid background | Let content breathe, remove visual noise | — Pending |
| Keep Inter font | Already clean and neutral, no need to change | — Pending |
| Light default + dark preserved | User asked for both themes | — Pending |
| No new features | Focus purely on visual/UX quality | — Pending |

---
*Last updated: 2026-03-08 after milestone v1.1 initialization*
