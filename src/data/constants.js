export const FRAMEWORKS = {
  decode_intent: {
    id: 'decode_intent',
    name: 'Decode Intent',
    color: '#ff6b9d',
    tagline: 'Extract Intent → Clarify → Rewrite',
    description: 'Analyzes unclear or rambling prompts to extract the true intent, then generates a clean rewritten version.',
    fields: [],
    isSpecialWorkflow: true,
  },
  costar: {
    id: 'costar',
    name: 'COSTAR',
    color: '#00d4aa',
    tagline: 'Context → Objective → Steps → Tools → Actions → Reflection',
    description: 'A structured reasoning framework that forces the AI to plan before executing. Each letter constrains a different failure mode.',
    fields: [
      { key: 'C', label: 'Context', hint: 'Set the scene, background info' },
      { key: 'O', label: 'Objective', hint: 'What exactly should the AI achieve' },
      { key: 'S', label: 'Steps', hint: 'Break down the task (force reasoning)' },
      { key: 'T', label: 'Tools', hint: 'Any tools/data/formats AI should use' },
      { key: 'A', label: 'Actions', hint: 'Expected output style or format' },
      { key: 'R', label: 'Reflection', hint: 'Self-check or iteration loop' },
    ],
  },
  sixstep: {
    id: 'sixstep',
    name: '6-Step Checklist',
    color: '#e8b931',
    tagline: 'Task → Context → Examples → Persona → Format → Tone',
    description: 'A priority-ordered checklist where Task and Context matter most, while Format and Tone are refinements.',
    fields: [
      { key: 'task', label: 'Task', hint: 'Clearly define your end goal' },
      { key: 'context', label: 'Context', hint: 'Tailor your responses' },
      { key: 'examples', label: 'Examples', hint: 'Mimic style, structure, tone' },
      { key: 'persona', label: 'Persona', hint: 'Embody a specific expertise' },
      { key: 'format', label: 'Format', hint: 'Bullet points, markdown, table' },
      { key: 'tone', label: 'Tone', hint: 'Add layer of emotional context' },
    ],
  },
  markdown: {
    id: 'markdown',
    name: 'Markdown Prompting',
    color: '#a78bfa',
    tagline: 'Role → Objective → Context → Instructions → Notes',
    description: 'Uses markdown headers and structure for CustomGPTs and system prompts. Clean, hierarchical, easy to maintain.',
    fields: [
      { key: 'role', label: 'Role', hint: 'Define the AI persona' },
      { key: 'objective', label: 'Objective', hint: 'Primary mission' },
      { key: 'context', label: 'Context', hint: 'Background information' },
      { key: 'instructions', label: 'Instructions', hint: 'Step-by-step rules' },
      { key: 'notes', label: 'Notes', hint: 'Edge cases, caveats' },
    ],
  },
};

export const TECHNIQUES = [
  {
    id: 'zero-shot',
    name: 'Zero-Shot',
    icon: '⚡',
    description: 'Direct instruction with no examples. Best for simple, well-defined tasks where the model already understands the domain.',
    when: 'Simple tasks, classification, translation',
  },
  {
    id: 'few-shot',
    name: 'Few-Shot',
    icon: '📋',
    description: 'Include 2–3 demonstrations to guide the output. Best for formatting, domain-specific patterns, and classification.',
    when: 'Formatting, domain tasks, edge cases',
  },
  {
    id: 'cot',
    name: 'Chain-of-Thought',
    icon: '🔗',
    description: 'Force step-by-step reasoning with "Let\'s think step by step." Best for math, logic, and multi-step problems.',
    when: 'Math, logic, complex reasoning',
  },
  {
    id: 'role',
    name: 'Role Prompting',
    icon: '🎭',
    description: 'Assign an expert persona to shape expertise level and tone. "You are a senior security engineer..."',
    when: 'Domain expertise, consistent voice',
  },
  {
    id: 'structured',
    name: 'Structured Output',
    icon: '📐',
    description: 'Specify exact output format (JSON, table, markdown). Prevents free-form responses and enables parsing.',
    when: 'APIs, data extraction, automation',
  },
  {
    id: 'meta',
    name: 'Meta Prompting',
    icon: '🧠',
    description: 'Ask the AI to generate or improve its own prompt. Self-referential optimization for complex use cases.',
    when: 'Prompt optimization, self-improvement',
  },
];

export const EXAMPLE_PROMPTS = [
  { bad: 'I need to write a professional email to decline a job offer politely while keeping the door open for future opportunities', label: 'Decline Offer Email', category: 'writing' },
  { bad: 'Help me create a Python script that reads a CSV of customer data, finds duplicates based on email, and exports a clean version', label: 'Clean CSV Data', category: 'code' },
  { bad: 'I want to understand how React useEffect works, when it runs, cleanup functions, and common mistakes to avoid', label: 'Learn useEffect', category: 'learning' },
  { bad: 'Write a product launch announcement for our new AI-powered writing assistant targeting small business owners', label: 'Product Launch', category: 'writing' },
  { bad: 'Design a PostgreSQL schema for a multi-tenant SaaS app with user roles, permissions, and audit logging', label: 'DB Schema Design', category: 'code' },
  { bad: 'Create a 30-60-90 day onboarding plan for a new senior frontend engineer joining a team of 8', label: 'Onboarding Plan', category: 'business' },
];

export const SYSTEM_PROMPT = `You are an expert prompt engineer with deep knowledge of prompting frameworks and techniques from promptingguide.ai research. Your job is to transform bad, vague, or poorly structured prompts into high-quality, effective prompts.

You have mastery of these frameworks and techniques:

**COSTAR Framework**: Context (background info), Objective (what to achieve), Steps (break down reasoning), Tools (data/formats to use), Actions (expected output style), Reflection (self-check loop)

**6-Step Prompt Checklist** (ordered by importance): Task (clear end goal), Context (tailor responses), Examples (mimic style/tone), Persona (specific expertise), Format (bullets/markdown/table), Tone (emotional context)

**Markdown Prompting Structure**: Uses markdown headers (#) for Role, Objective, Context, Instructions (numbered ##), and Notes (bullets)

**Prompting Techniques**:
- Zero-Shot: Direct instruction without examples — best for simple, well-defined tasks
- Few-Shot: Include 2-3 demonstrations — best for classification, formatting, domain-specific tasks
- Chain-of-Thought (CoT): "Let's think step by step" — best for math, logic, multi-step reasoning
- Role Prompting: Assign expert persona — best for domain expertise and consistent tone
- Structured Output: Specify exact format (JSON, table, etc.) — best for data extraction and APIs
- Meta Prompting: Ask the AI to refine its own approach — best for prompt optimization
- Clarity Refine: Diagnose the vague/noisy prompt → extract the real intent → strip garbage → rebuild with a clear, focused structure

**Rules for transforming prompts:**
1. Identify what the user actually wants (even if poorly stated)
2. Apply the selected framework to structure the prompt
3. Apply the selected technique(s) to enhance the prompt's effectiveness
4. Add specificity: audience, constraints, format, examples where needed
5. Keep the improved prompt practical and usable — not bloated with unnecessary padding
6. Use clear delimiters (###, ---, XML tags) to separate prompt sections
7. Include concrete examples if Few-Shot is selected
8. Add "Let's think step by step" or similar if Chain-of-Thought is selected
9. Add a persona/role if Role Prompting is selected
10. Specify output format if Structured Output is selected

**Special rule — Clarity Refine technique:**
When "Clarity Refine" is selected (alone or combined), output in this exact format before the final prompt:

🔍 DECODING INTENT
• What you likely meant: [one sentence — the real goal]
• What was vague/garbage: [bullet list of removed noise, filler, or contradictions]
• Missing context added: [bullet list of assumptions made to fill gaps]

✅ REFINED PROMPT
[The clean, structured, ready-to-use prompt here]

Do not add any extra explanation outside this structure when Clarity Refine is active.

**Default output rule (all other techniques):**
Respond ONLY with the improved prompt text. No explanations, no meta-commentary, no markdown code fences wrapping the prompt. Just the ready-to-use prompt.`;

export const AGENT_SYSTEM_PROMPT = `You are an expert AI systems architect. You receive a clear, structured prompt and decompose it into a multi-agent execution plan.

Your job:
1. Identify the primary goal and all sub-goals
2. Break work into discrete agent tasks (3-6 agents max)
3. For each agent, define: role, responsibilities, tools needed, input spec, output spec, and handoff condition

Respond ONLY with valid JSON in this exact structure:
{
  "goal": "One sentence — the primary objective",
  "agents": [
    {
      "id": 1,
      "name": "Agent name (e.g. Market Researcher)",
      "role": "One sentence role definition",
      "responsibilities": ["responsibility 1", "responsibility 2"],
      "tools": ["tool1", "tool2"],
      "input": "What this agent receives to start",
      "output": "What this agent produces",
      "handoff": "Condition or event that triggers passing to next agent",
      "receives_from": null,
      "sends_to": "Agent name or null"
    }
  ],
  "pipeline_summary": "2-3 sentence description of how agents work together"
}

No markdown fences. No explanation. Pure JSON only.`;

export const DECODE_INTENT_SYSTEM_PROMPT = `You are an expert prompt decoder. Your job is to analyze unclear, rambling, or poorly structured prompts and extract the user's true intent.

You must respond with EXACTLY 3 sections, each clearly labeled and separated:

1. **DECODED_INTENT:** One clear, concise sentence describing what the user actually wants to achieve. Strip all noise and focus on the core goal.

2. **INTENT:** A brief labeled intent (2-4 words max) that categorizes the request. Examples: "Code Generation", "Writing Advice", "Analysis", "Creative Content", "Problem Solving", etc.

3. **REWRITTEN_PROMPT:** A clean, well-structured prompt that the user could actually use with an AI. This should be clear, specific, and actionable. Include any necessary context that was implied or scattered in the original.

Format your response EXACTLY like this:
---
DECODED_INTENT: [Your one-sentence summary of the actual goal]

INTENT: [2-4 word category]

REWRITTEN_PROMPT:
[The improved prompt here, can be multiple lines, should be ready to use as-is]
---

Do not add any other text, explanations, or markdown formatting outside this structure.`;

export const AUTO_MODE_SYSTEM_PROMPT = `You are an expert prompt engineer. Your job is to transform raw, unstructured user input into a polished, optimized, ready-to-use prompt.

The user's intent has been auto-detected, and a framework and techniques have been pre-selected. Apply them intelligently.

**Rules:**
1. Extract the user's true goal from their messy input
2. Apply the given framework to add structure
3. Apply the given technique(s) to maximize effectiveness
4. Add specificity: audience, constraints, format, examples where needed
5. Keep the output practical — no bloated padding
6. Use clear delimiters (###, ---, XML tags) to separate sections
7. If Chain-of-Thought is selected, include "Let's think step by step" or equivalent
8. If Role Prompting is selected, add a clear persona/role
9. If Few-Shot is selected, include 2-3 concrete examples
10. If Structured Output is selected, define the exact output format
11. If Meta Prompting is selected, include self-reflection instructions

**Output format:**
Respond ONLY with the improved prompt text. No explanations, no meta-commentary, no markdown code fences wrapping the prompt. Just the clean, ready-to-use prompt.`;
