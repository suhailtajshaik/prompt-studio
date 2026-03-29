import { useState, useCallback } from 'react';
import { FRAMEWORKS, TECHNIQUES, SYSTEM_PROMPT, DECODE_INTENT_SYSTEM_PROMPT, AUTO_MODE_SYSTEM_PROMPT } from '../data/constants';
import { INTENT_CATEGORIES } from '../data/intents';

const PROVIDER_LABELS = {
  anthropic: 'Anthropic',
  gemini: 'Google Gemini',
  openrouter: 'OpenRouter',
};

function makeError(message, details) {
  return { message, details };
}

export function useTransform() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usedConfig, setUsedConfig] = useState(null);

  const transform = useCallback(async (badPrompt, frameworkId, techniqueIds, provider = 'anthropic', model = 'claude-sonnet-4-6', apiKey) => {
    if (!badPrompt.trim()) return;

    setLoading(true);
    setError(null);
    setResult('');

    const fw = FRAMEWORKS[frameworkId];
    const isDecodeIntent = fw?.isSpecialWorkflow === true;

    let userMessage;
    let systemPrompt;

    if (isDecodeIntent) {
      userMessage = `Analyze this unclear or rambling prompt and decode the user's true intent:

"${badPrompt}"

Respond in the exact format specified.`;
      systemPrompt = DECODE_INTENT_SYSTEM_PROMPT;
    } else {
      const techNames = techniqueIds
        .map((id) => TECHNIQUES.find((t) => t.id === id)?.name)
        .filter(Boolean)
        .join(', ');

      userMessage = `Transform this bad prompt into a high-quality prompt.

**Bad Prompt:** "${badPrompt}"

**Apply Framework:** ${fw.name} (${fw.tagline})
**Framework fields:** ${fw.fields.map((f) => `${f.label}: ${f.hint}`).join(' | ')}
**Apply Techniques:** ${techNames || 'Zero-Shot'}

Generate the improved prompt now.`;
      systemPrompt = SYSTEM_PROMPT;
    }

    // Store the config used for this transform
    setUsedConfig({ frameworkId, techniqueIds });

    const label = PROVIDER_LABELS[provider] || provider;

    try {
      let response;
      let data;

      if (provider === 'anthropic') {
        const headers = {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        };
        if (apiKey) {
          headers['x-api-key'] = apiKey;
          headers['anthropic-dangerous-direct-browser-access'] = 'true';
        }

        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: model || 'claude-sonnet-4-6',
            max_tokens: 1500,
            system: systemPrompt,
            messages: [{ role: 'user', content: userMessage }],
          }),
        });

        data = await response.json();

        if (data.content && data.content[0]?.text) {
          setResult(data.content[0].text);
          return true;
        } else if (data.error) {
          setError(makeError(
            'Something went wrong with Anthropic. Check your API key and try again.',
            `${data.error.type || 'error'}: ${data.error.message}\nModel: ${model}\nStatus: ${response.status}`
          ));
        } else {
          setError(makeError(
            'Received an unexpected response from Anthropic.',
            `Status: ${response.status}\nResponse: ${JSON.stringify(data, null, 2)}`
          ));
        }
      } else if (provider === 'gemini') {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-2.5-flash'}:generateContent?key=${apiKey || ''}`;
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            },
            contents: [{
              parts: [{ text: userMessage }]
            }]
          })
        });

        data = await response.json();

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          setResult(data.candidates[0].content.parts[0].text);
          return true;
        } else if (data.error) {
          setError(makeError(
            'Something went wrong with Gemini. Check your API key and try again.',
            `${data.error.code || 'error'}: ${data.error.message}\nModel: ${model}\nStatus: ${data.error.status || response.status}`
          ));
        } else {
          setError(makeError(
            'Received an unexpected response from Gemini.',
            `Status: ${response.status}\nResponse: ${JSON.stringify(data, null, 2)}`
          ));
        }
      } else if (provider === 'openrouter') {
        const usedModel = model || 'anthropic/claude-sonnet-4';
        const headers = { 'Content-Type': 'application/json' };
        if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

        response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: usedModel,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userMessage }
            ],
          })
        });

        data = await response.json();
        if (data.choices && data.choices[0]?.message?.content) {
          setResult(data.choices[0].message.content);
          return true;
        } else if (data.error) {
          const errMsg = data.error?.message || (typeof data.error === 'string' ? data.error : JSON.stringify(data.error));
          setError(makeError(
            `${label} couldn't process the request. The model "${usedModel}" may not be available.`,
            `Model: ${usedModel}\nError: ${errMsg}\nStatus: ${response.status}`
          ));
        } else {
          setError(makeError(
            `Received an unexpected response from ${label}.`,
            `Model: ${usedModel}\nStatus: ${response.status}\nResponse: ${JSON.stringify(data, null, 2)}`
          ));
        }
      }
    } catch (err) {
      setError(makeError(
        `Couldn't connect to ${label}. Please check your connection and try again.`,
        `Provider: ${provider}\nError: ${err.name}: ${err.message}`
      ));
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Auto-mode transform: uses detected intent to select framework + techniques.
   */
  const autoTransform = useCallback(async (badPrompt, intent, provider, model, apiKey) => {
    if (!intent) {
      // Fallback: use decode_intent workflow
      return transform(badPrompt, 'decode_intent', [], provider, model, apiKey);
    }

    const { framework, techniques } = intent.primary;
    return transform(badPrompt, framework, techniques, provider, model, apiKey);
  }, [transform]);

  const reset = useCallback(() => {
    setResult('');
    setError(null);
    setUsedConfig(null);
  }, []);

  return { result, loading, error, usedConfig, transform, autoTransform, reset };
}
