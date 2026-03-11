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
- Works with multiple AI providers (Anthropic, Google Gemini, OpenRouter, LocalAI)
- Run fully local with LocalAI — no API key needed
- API keys persist in your browser via localStorage — never sent to third parties
- Dark mode, fully responsive, works on any device

## Quick Start

### Docker Compose (with LocalAI)

Run the full stack — Prompt Studio + LocalAI with pre-loaded models:

```bash
docker compose up
```

The 6 model configs from the `models/` folder are automatically loaded — LocalAI downloads the GGUF weights on first startup (total ~18 GB, can take several minutes depending on your connection). Models are cached in `./models/` for subsequent runs.

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

### Cloud Providers

| Provider | Models |
|----------|--------|
| Anthropic | claude-sonnet-4-6, claude-opus-4-6, claude-haiku-4-5 |
| Google Gemini | gemini-2.5-flash, gemini-2.5-pro, gemini-2.0-flash |
| OpenRouter | Any model via custom ID |

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

## Links

- **Source**: [github.com/suhailtajshaik/prompt-builder](https://github.com/suhailtajshaik/prompt-builder)
- **License**: MIT
