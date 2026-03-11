# Rich UI Redesign Spec — "Obsidian Forge"

## Aesthetic Direction
Rich dark surfaces with layered depth, subtle gradient meshes, glowing accent highlights, frosted glass cards, premium typography, generous spacing, satisfying micro-interactions. High-end developer tool feel.

## Key Visual Elements

### Background
- Ambient gradient mesh: 2-3 very subtle gradient orbs (indigo, purple, teal), heavy blur (200px+), 0.15-0.2 opacity
- Noise texture overlay at 0.03 opacity for depth
- Base bg: #08090E (very deep navy-black)

### Cards
- Frosted glass: `background: rgba(255,255,255,0.03)`, `backdrop-filter: blur(20px)`
- Border: `1px solid rgba(255,255,255,0.06)`
- Inner glow: `box-shadow: inset 0 1px 0 rgba(255,255,255,0.05)`
- Hover: border glows with accent color, subtle elevation change
- `.card-glow` variant with accent border glow for active states

### Colors
- Dark accent: #818CF8 (indigo), hover: #6366F1
- Light accent: #4F46E5
- Success/teal: #00d4aa (COSTAR), #34D399
- Warning/gold: #e8b931 (6-Step)
- Purple: #a78bfa (Markdown)
- Gradient CTA: from-indigo-500 via-violet-500 to-purple-500

### Typography
- Display: Outfit (Google Font) — headings, big titles, extrabold
- Body: Inter — all body text
- Mono: JetBrains Mono — code, scores, badges

### Animations
- Shimmer on transform button (gradient sweep)
- Glow-pulse on result-ready dot
- whileHover={{ scale: 1.02 }} on framework/technique cards (framer-motion)
- Smooth color/border transitions

## Component Changes

### Header
- Outfit font, text-3xl sm:text-4xl md:text-5xl font-extrabold
- "Good Prompt" gradient text: from-indigo-400 to-violet-400
- Badge pill: "Prompt Engineering Studio" with sparkle icon
- Glassy theme toggle button

### TabBar
- Pill/segment style (not underline)
- Active: gradient bg (indigo to violet), white text, rounded-xl
- Inactive: transparent, hover bg
- Wrap in a glassy container

### FrameworkPicker
- Per-framework colors back (fw.color from constants.js)
- motion.button with hover scale
- Active: border glows with fw.color, tinted bg, dot pulses
- Field pills colored per framework

### TechniquePicker
- motion.button with hover scale
- Active: accent glow border, tinted bg

### TransformButton
- motion.button with hover scale + glow
- Gradient: from-indigo-500 via-violet-500 to-purple-500
- Shimmer overlay
- Glow shadow: shadow-lg shadow-indigo-500/25
- Loading: pulsing gradient

### ResultView
- Framework badge uses fw.color
- Copy button glow on copied
- Stats cards with subtle gradient bg
- Pulse dot for result-ready

### LearnView
- Framework cards use fw.color
- Table row hover effects

### SettingsView
- Icon containers with gradient bg
- Inputs with subtle inner shadow

### ErrorBanner
- Red border glow

## Technical Notes
- useTheme hook defaults to dark — keep
- Responsive: px-4 sm:px-6 lg:px-8, max-w-4xl
- Cmd+Enter keyboard shortcut — keep
- Google Font Outfit already loaded in index.html
- Framework colors: COSTAR=#00d4aa, 6-Step=#e8b931, Markdown=#a78bfa
- Run npm run build after all changes
