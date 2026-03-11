# Prompt Studio

AI-powered tool that transforms vague prompts into production-ready ones using proven prompt engineering frameworks.

## What It Does

Paste a bad prompt, pick a framework and technique, and get a structured, high-quality prompt back — rewritten by AI.

- **Scores your prompt** (0-100) and flags issues before transformation
- **3 frameworks**: COSTAR, 6-Step Checklist, Markdown Prompting
- **6 techniques**: Zero-Shot, Few-Shot, Chain-of-Thought, Role Prompting, Structured Output, Meta Prompting
- **Before/After comparison** with word count and expansion stats
- **One-click copy** or download as `.txt`

## Why Use It

- Stop guessing — use battle-tested frameworks to structure your prompts
- Real-time analysis catches vague, ambiguous, or underspecified prompts before you waste API calls
- Works with multiple AI providers (Anthropic, Google Gemini, OpenRouter, Ollama, LocalAI)
- Run fully local with Ollama or LocalAI — no API key needed
- API keys persist in your browser via localStorage — never sent to third parties
- Dark mode, fully responsive, works on any device

## Quick Start

### Docker Compose (with LocalAI)

Run the full stack — Prompt Studio + LocalAI with pre-loaded models:

```bash
docker compose up
```

Model configs from the `models/` folder (`llama3`, `mistral-openorca`, `phi-2`, `gpt-4`) are automatically loaded — LocalAI downloads the model weights on first startup. Models are persisted in a Docker volume for subsequent runs.

- App: **http://localhost:3000**
- LocalAI API: **http://localhost:8080**

For NVIDIA GPU acceleration:

```bash
docker compose --profile gpu up
```

To stop everything:

```bash
docker compose down
```

### Docker (app only)

```bash
docker pull suhailtaj/prompt-studio
docker run -d --name prompt-studio -p 3000:80 suhailtaj/prompt-studio
```

### Podman

```bash
podman pull docker.io/suhailtaj/prompt-studio
podman run -d --name prompt-studio -p 3000:80 docker.io/suhailtaj/prompt-studio
```

Open **http://localhost:3000** and go to **Settings** to configure your provider.

## Supported Models

| Provider | Models |
|----------|--------|
| Anthropic | claude-sonnet-4-6, claude-opus-4-6, claude-haiku-4-5 |
| Google Gemini | gemini-2.5-flash, gemini-2.5-pro, gemini-2.0-flash |
| OpenRouter | Any model via custom ID |
| Ollama | llama3, mistral, phi3, gemma |
| LocalAI | gpt-4, llama3, mistral-openorca, phi-2 |

## Links

- **Source**: [github.com/suhailtajshaik/prompt-builder](https://github.com/suhailtajshaik/prompt-builder)
- **License**: MIT
