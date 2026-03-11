# Prompt Studio — Bad Prompt → Good Prompt

A prompt engineering tool that transforms vague, poorly structured prompts into production-ready ones using established frameworks and techniques.

## Features

- **3 Frameworks**: COSTAR, 6-Step Prompt Checklist, Markdown Prompting
- **6 Techniques**: Zero-Shot, Few-Shot, Chain-of-Thought, Role Prompting, Structured Output, Meta Prompting
- **Real-time Analysis**: Detects issues in your prompt before transformation (score, severity, fixes)
- **AI-Powered**: Uses Claude Sonnet via the Anthropic API to rewrite prompts
- **Before/After Comparison**: See stats on word count expansion and structure improvements
- **Copy & Download**: One-click copy or download as .txt
- **Frameworks Reference**: Built-in learning tab with framework details and technique descriptions

## Tech Stack

- React 18
- Vite 6
- Tailwind CSS 3
- Framer Motion 11
- Lucide React (icons)
- Anthropic API (Claude Sonnet)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Anthropic API key ([get one here](https://console.anthropic.com/settings/keys))

### Install & Run

```bash
# Clone or copy the project
cd prompt-builder

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Configure API Key

1. Click the **Settings** tab
2. Paste your Anthropic API key (`sk-ant-api03-...`)
3. The key stays in your browser session only — never sent to any server except the Anthropic API

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
prompt-builder/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── ErrorBanner.jsx     # Dismissible error alerts
│   │   ├── FrameworkPicker.jsx  # COSTAR / 6-Step / Markdown selector
│   │   ├── Header.jsx          # Title and description
│   │   ├── LearnView.jsx       # Frameworks & techniques reference
│   │   ├── PromptInput.jsx     # Textarea + real-time analysis
│   │   ├── ResultView.jsx      # Output, stats, before/after, copy
│   │   ├── SettingsView.jsx    # API key configuration
│   │   ├── TabBar.jsx          # Navigation tabs
│   │   ├── TechniquePicker.jsx # Technique multi-selector
│   │   └── TransformButton.jsx # CTA with loading state
│   ├── data/
│   │   ├── analyzer.js         # Prompt quality analysis engine
│   │   └── constants.js        # Frameworks, techniques, system prompt
│   ├── hooks/
│   │   └── useTransform.js     # API call hook
│   ├── App.jsx                 # Main app with tab routing
│   ├── index.css               # Global styles + Tailwind
│   └── main.jsx                # Entry point
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## How It Works

1. **Paste** your bad/vague prompt
2. **Analyze** — the tool scores it (0-100) and flags issues with fixes
3. **Pick** a framework (COSTAR, 6-Step, Markdown Prompting)
4. **Select** techniques (Zero-Shot, Few-Shot, CoT, etc.)
5. **Transform** — Claude rewrites your prompt using the selected framework + techniques
6. **Copy** the improved prompt and use it anywhere

## Frameworks Reference

| Framework | Structure | Best For |
|-----------|-----------|----------|
| **COSTAR** | Context → Objective → Steps → Tools → Actions → Reflection | System prompts, complex agents |
| **6-Step** | Task → Context → Examples → Persona → Format → Tone | General-purpose prompting |
| **Markdown** | Role → Objective → Context → Instructions → Notes | CustomGPTs, clean templates |

## License

MIT
