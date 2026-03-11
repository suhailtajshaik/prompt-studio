# Prompt Studio

Transform vague, poorly structured prompts into production-ready ones using proven frameworks and AI.

## Features

- **3 Frameworks** — COSTAR, 6-Step Prompt Checklist, Markdown Prompting
- **6 Techniques** — Zero-Shot, Few-Shot, Chain-of-Thought, Role Prompting, Structured Output, Meta Prompting
- **Real-time Analysis** — Scores your prompt (0-100), detects issues, suggests fixes
- **Multi-Provider AI** — Anthropic (Claude), Google Gemini, OpenRouter
- **Persistent API Keys** — Saved to localStorage per provider, never leaves your browser
- **Before/After Comparison** — Word count expansion and structure improvements
- **Copy & Download** — One-click copy or download as `.txt`
- **Learning Center** — Built-in reference for all frameworks and techniques
- **Dark Mode** — Full light/dark theme support
- **Fully Responsive** — Works on mobile, tablet, and desktop

## Tech Stack

- React 18
- Vite 6
- Tailwind CSS 3
- Framer Motion 11
- Lucide React (icons)
- Docker + nginx (production)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- API key from one of: [Anthropic](https://console.anthropic.com/settings/keys), [Google AI Studio](https://aistudio.google.com/app/apikey), or [OpenRouter](https://openrouter.ai/keys)

### Install & Run

```bash
git clone https://github.com/suhailtajshaik/prompt-builder.git
cd prompt-builder
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Configure API Key

1. Go to the **Settings** tab
2. Select your provider (Anthropic, Gemini, or OpenRouter)
3. Paste your API key
4. Keys are saved to localStorage — persistent across sessions, never sent to third parties

### Run with Docker

```bash
docker pull suhailtaj/prompt-studio
docker run -d --name prompt-studio -p 3000:80 suhailtaj/prompt-studio
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To stop and remove:

```bash
docker stop prompt-studio && docker rm prompt-studio
```

### Build Docker Image Locally

```bash
docker build -t suhailtaj/prompt-studio .
docker run -d --name prompt-studio -p 3000:80 suhailtaj/prompt-studio
```

### Build for Production (without Docker)

```bash
npm run build
npm run preview
```

## Project Structure

```
prompt-studio/
├── src/
│   ├── components/
│   │   ├── ErrorBanner.jsx      # Dismissible error alerts
│   │   ├── FrameworkPicker.jsx   # COSTAR / 6-Step / Markdown selector
│   │   ├── Header.jsx           # Title, branding, dark mode toggle
│   │   ├── LearnView.jsx        # Frameworks & techniques reference
│   │   ├── PromptInput.jsx      # Textarea + real-time analysis
│   │   ├── ResultView.jsx       # Output, stats, before/after, copy
│   │   ├── SettingsView.jsx     # Provider, model, API key config
│   │   ├── TabBar.jsx           # Navigation tabs
│   │   ├── TechniquePicker.jsx  # Technique multi-selector
│   │   └── TransformButton.jsx  # CTA with loading state
│   ├── data/
│   │   ├── analyzer.js          # Prompt quality scoring engine
│   │   └── constants.js         # Frameworks, techniques, system prompt
│   ├── hooks/
│   │   ├── useApiKeys.js        # localStorage persistence for API keys
│   │   ├── useTheme.js          # Dark/light mode toggle
│   │   └── useTransform.js      # API call hook (Anthropic/Gemini/OpenRouter)
│   ├── App.jsx                  # Main app with tab routing
│   ├── index.css                # Design system tokens + global styles
│   └── main.jsx                 # Entry point
├── Dockerfile              # Multi-stage production build
├── nginx.conf              # SPA routing, gzip, caching
├── .dockerignore
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## How It Works

1. **Paste** your vague prompt
2. **Review** the real-time score and detected issues
3. **Pick** a framework (COSTAR, 6-Step, or Markdown Prompting)
4. **Select** techniques (Zero-Shot, Few-Shot, CoT, etc.)
5. **Transform** — AI rewrites your prompt using the selected framework + techniques
6. **Copy** the improved prompt and use it anywhere

## Supported Models

| Provider | Models |
|----------|--------|
| **Anthropic** | claude-sonnet-4-6, claude-opus-4-6, claude-haiku-4-5 |
| **Google Gemini** | gemini-2.5-flash, gemini-2.5-pro, gemini-2.0-flash |
| **OpenRouter** | Any model via custom ID |

## Frameworks

| Framework | Structure | Best For |
|-----------|-----------|----------|
| **COSTAR** | Context → Objective → Steps → Tools → Actions → Reflection | System prompts, complex agents |
| **6-Step Checklist** | Task → Context → Examples → Persona → Format → Tone | General-purpose prompting |
| **Markdown Prompting** | Role → Objective → Context → Instructions → Notes | CustomGPTs, clean templates |

## License

MIT
