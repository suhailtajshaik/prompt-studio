# Prompt Studio

Transform vague, poorly structured prompts into production-ready ones using proven frameworks and AI.

## Features

- **3 Frameworks** — COSTAR, 6-Step Prompt Checklist, Markdown Prompting
- **6 Techniques** — Zero-Shot, Few-Shot, Chain-of-Thought, Role Prompting, Structured Output, Meta Prompting
- **Real-time Analysis** — Scores your prompt (0-100), detects issues, suggests fixes
- **Multi-Provider AI** — Anthropic (Claude), Google Gemini, OpenRouter, LocalAI
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
- API key from one of: [Anthropic](https://console.anthropic.com/settings/keys), [Google AI Studio](https://aistudio.google.com/app/apikey), or [OpenRouter](https://openrouter.ai/keys) (not needed for LocalAI)

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
2. Select your provider (Anthropic, Gemini, OpenRouter, or LocalAI)
3. Paste your API key (not required for LocalAI)
4. Keys are saved to localStorage — persistent across sessions, never sent to third parties

### Run with Docker Compose (with LocalAI)

The easiest way to run Prompt Studio with a fully local AI backend:

```bash
docker compose up
```

This starts both the Prompt Studio app and LocalAI. The 6 model configs from the `models/` folder are automatically loaded — LocalAI downloads the GGUF weights on first startup (total ~18 GB, can take several minutes depending on your connection).

- App: [http://localhost:3000](http://localhost:3000)
- LocalAI API: [http://localhost:8080](http://localhost:8080)

For NVIDIA GPU acceleration:

```bash
docker compose --profile gpu up
```

To stop everything:

```bash
docker compose down
```

Models are cached in `./models/` and won't be re-downloaded on subsequent runs.

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

### Run with Podman

```bash
podman pull docker.io/suhailtaj/prompt-studio
podman run -d --name prompt-studio -p 3000:80 docker.io/suhailtaj/prompt-studio
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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
├── models/
│   ├── qwen2.5-1.5b-instruct.yaml  # Qwen 2.5 1.5B (small, fast)
│   ├── llama-3.2-3b-instruct.yaml  # Llama 3.2 3B (small, balanced)
│   ├── qwen3-8b.yaml               # Qwen3 8B (medium, thinking mode)
│   ├── mistral-7b-instruct.yaml    # Mistral 7B v0.3 (medium, general)
│   ├── deepseek-r1-7b.yaml         # DeepSeek R1 7B (reasoning)
│   └── deepseek-r1-1.5b.yaml       # DeepSeek R1 1.5B (reasoning, light)
├── docker-compose.yml      # Full stack with LocalAI
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

### Cloud Providers

| Provider | Models |
|----------|--------|
| **Anthropic** | claude-sonnet-4-6, claude-opus-4-6, claude-haiku-4-5 |
| **Google Gemini** | gemini-2.5-flash, gemini-2.5-pro, gemini-2.0-flash |
| **OpenRouter** | Any model via custom ID |

### LocalAI Models (CPU-Optimized, Q4_K_M Quantization)

| Category | Model | Dropdown Label | GGUF Size |
|----------|-------|----------------|-----------|
| **Small** | Qwen 2.5 1.5B | Qwen 2.5 1.5B — Small, Fast | ~1.1 GB |
| **Small** | Llama 3.2 3B | Llama 3.2 3B — Small, Balanced | ~2.0 GB |
| **Medium** | Qwen3 8B | Qwen3 8B — Medium, Thinking | ~5.0 GB |
| **Medium** | Mistral 7B v0.3 | Mistral 7B — Medium, General | ~4.4 GB |
| **Reasoning** | DeepSeek R1 7B | DeepSeek R1 7B — Reasoning | ~4.7 GB |
| **Reasoning** | DeepSeek R1 1.5B | DeepSeek R1 1.5B — Reasoning, Light | ~1.1 GB |

**Small models** (8GB RAM) run at ~25-50 tok/s on CPU. **Medium/Reasoning models** (16GB RAM) run at ~10-15 tok/s. All models use Q4_K_M quantization for the best quality-to-speed tradeoff on CPU.

## Frameworks

| Framework | Structure | Best For |
|-----------|-----------|----------|
| **COSTAR** | Context → Objective → Steps → Tools → Actions → Reflection | System prompts, complex agents |
| **6-Step Checklist** | Task → Context → Examples → Persona → Format → Tone | General-purpose prompting |
| **Markdown Prompting** | Role → Objective → Context → Instructions → Notes | CustomGPTs, clean templates |

## License

MIT
