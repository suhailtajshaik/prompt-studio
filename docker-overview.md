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
- Works with multiple AI providers (Anthropic, Google Gemini, OpenRouter)
- API keys persist in your browser via localStorage — never sent to third parties
- Dark mode, fully responsive, works on any device

## Quick Start

### Docker

```bash
docker pull suhailtaj/prompt-studio
docker run -d --name prompt-studio -p 3000:80 suhailtaj/prompt-studio
```

### Podman

```bash
podman pull docker.io/suhailtaj/prompt-studio
podman run -d --name prompt-studio -p 3000:80 docker.io/suhailtaj/prompt-studio
```

Open **http://localhost:3000** and go to **Settings** to add your API key.

## Supported Models

| Provider | Models |
|----------|--------|
| Anthropic | claude-sonnet-4-6, claude-opus-4-6, claude-haiku-4-5 |
| Google Gemini | gemini-2.5-flash, gemini-2.5-pro, gemini-2.0-flash |
| OpenRouter | Any model via custom ID |

## Links

- **Source**: [github.com/suhailtajshaik/prompt-builder](https://github.com/suhailtajshaik/prompt-builder)
- **License**: MIT
