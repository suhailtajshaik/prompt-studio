import { useState, useCallback } from 'react';
import { SYSTEM_PROMPT, AGENT_SYSTEM_PROMPT } from '../data/constants';

const PROVIDER_LABELS = {
  anthropic: 'Anthropic',
  gemini: 'Google Gemini',
  openrouter: 'OpenRouter',
  localai: 'LocalAI',
};

function makeError(message, details) {
  return { message, details };
}

async function callLLM(provider, model, apiKey, systemPrompt, userMessage) {
  if (provider === 'localai') {
    const healthUrl = '/prompt-studio/api/readyz';
    try {
      const healthResp = await fetch(healthUrl, {
        method: 'GET',
        signal: AbortSignal.timeout(3000),
      });
      if (!healthResp.ok) {
        throw new Error(`Health check returned status ${healthResp.status}`);
      }
    } catch (healthErr) {
      const label = PROVIDER_LABELS[provider];
      throw new Error(`Can't reach ${label}. Make sure it's running. (${healthErr.message})`);
    }
  }

  if (provider === 'anthropic') {
    const headers = {
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    };
    if (apiKey) {
      headers['x-api-key'] = apiKey;
      headers['anthropic-dangerous-direct-browser-access'] = 'true';
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: model || 'claude-3-7-sonnet-20250219',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    const data = await response.json();
    if (data.content && data.content[0]?.text) {
      return data.content[0].text;
    }
    if (data.error) {
      throw new Error(`${data.error.type || 'error'}: ${data.error.message}`);
    }
    throw new Error(`Unexpected response (status ${response.status})`);
  }

  if (provider === 'gemini') {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-2.5-flash'}:generateContent?key=${apiKey || ''}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userMessage }] }],
      }),
    });

    const data = await response.json();
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    if (data.error) {
      throw new Error(`${data.error.code || 'error'}: ${data.error.message}`);
    }
    throw new Error(`Unexpected response (status ${response.status})`);
  }

  // openrouter or localai
  const endpoints = {
    openrouter: 'https://openrouter.ai/api/v1/chat/completions',
    localai: '/prompt-studio/api/v1/chat/completions',
  };
  const defaults = {
    openrouter: 'anthropic/claude-sonnet-4',
    localai: 'llama-3.2-1b-instruct:q4_k_m',
  };

  const usedModel = model || defaults[provider];
  const headers = { 'Content-Type': 'application/json' };
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

  const response = await fetch(endpoints[provider], {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: usedModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    }),
  });

  const data = await response.json();
  if (data.choices && data.choices[0]?.message?.content) {
    return data.choices[0].message.content;
  }
  if (data.error) {
    const errMsg = data.error?.message || (typeof data.error === 'string' ? data.error : JSON.stringify(data.error));
    throw new Error(errMsg);
  }
  throw new Error(`Unexpected response (status ${response.status})`);
}

export function useAgentDecompose() {
  const [refinedPrompt, setRefinedPrompt] = useState('');
  const [agentPlan, setAgentPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(null);
  const [error, setError] = useState(null);

  const decompose = useCallback(async (input, provider, model, apiKey) => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setRefinedPrompt('');
    setAgentPlan(null);
    setStep('refining');

    const label = PROVIDER_LABELS[provider] || provider;

    try {
      // Step 1: Clarity Refine
      const refineMessage = `Refine this vague prompt using the Clarity Refine technique. Extract intent, strip noise, output a clean structured prompt.\n\nVague input: "${input}"\n\nRespond with ONLY the refined prompt text (no decoding section needed — just the clean prompt).`;

      const refined = await callLLM(provider, model, apiKey, SYSTEM_PROMPT, refineMessage);
      setRefinedPrompt(refined);
      setStep('decomposing');

      // Step 2: Agent Decomposition
      const decomposeMessage = `Decompose this prompt into a multi-agent execution plan:\n\n"${refined}"\n\nRespond with valid JSON only.`;

      const rawJson = await callLLM(provider, model, apiKey, AGENT_SYSTEM_PROMPT, decomposeMessage);

      // Parse JSON — strip markdown fences if present
      let cleaned = rawJson.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
      }

      let plan;
      try {
        plan = JSON.parse(cleaned);
      } catch {
        setError(makeError(
          'The AI returned invalid JSON. Try again or use a different model.',
          `Parse error for response:\n${rawJson.slice(0, 500)}`
        ));
        setStep(null);
        return;
      }

      if (!plan.agents || !Array.isArray(plan.agents) || plan.agents.length === 0) {
        setError(makeError(
          'The agent plan was empty or malformed. Try again with a more detailed prompt.',
          `Parsed JSON has no agents array:\n${JSON.stringify(plan, null, 2).slice(0, 500)}`
        ));
        setStep(null);
        return;
      }

      setAgentPlan(plan);
      setStep('done');
    } catch (err) {
      setError(makeError(
        `${label} error: ${err.message}`,
        `Provider: ${provider}\nModel: ${model}\nError: ${err.message}`
      ));
      setStep(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setRefinedPrompt('');
    setAgentPlan(null);
    setError(null);
    setStep(null);
  }, []);

  return { refinedPrompt, agentPlan, loading, step, error, decompose, reset };
}
