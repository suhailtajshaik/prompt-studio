import { useState, useCallback } from 'react';
import { FRAMEWORKS, TECHNIQUES, SYSTEM_PROMPT } from '../data/constants';

const PROVIDER_LABELS = {
  anthropic: 'Anthropic',
  gemini: 'Google Gemini',
  openrouter: 'OpenRouter',
  ollama: 'Ollama',
  localai: 'LocalAI',
};

function makeError(message, details) {
  return { message, details };
}

export function useTransform() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const transform = useCallback(async (badPrompt, frameworkId, techniqueIds, provider = 'anthropic', model = 'claude-3-7-sonnet-20250219', apiKey) => {
    if (!badPrompt.trim()) return;

    setLoading(true);
    setError(null);
    setResult('');

    const fw = FRAMEWORKS[frameworkId];
    const techNames = techniqueIds
      .map((id) => TECHNIQUES.find((t) => t.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const userMessage = `Transform this bad prompt into a high-quality prompt.

**Bad Prompt:** "${badPrompt}"

**Apply Framework:** ${fw.name} (${fw.tagline})
**Framework fields:** ${fw.fields.map((f) => `${f.label}: ${f.hint}`).join(' | ')}
**Apply Techniques:** ${techNames || 'Zero-Shot'}

Generate the improved prompt now.`;

    const label = PROVIDER_LABELS[provider] || provider;

    try {
      // Health check for local providers before making the actual request
      if (provider === 'ollama' || provider === 'localai') {
        const healthUrls = {
          ollama: 'http://localhost:11434',
          localai: 'http://localhost:8080/readyz',
        };
        const ports = { ollama: '11434', localai: '8080' };
        const startCmd = provider === 'ollama' ? 'ollama serve' : 'docker compose up';

        try {
          const healthResp = await fetch(healthUrls[provider], {
            method: 'GET',
            signal: AbortSignal.timeout(3000),
          });
          if (!healthResp.ok && provider === 'localai') {
            setError(makeError(
              `${label} is still loading. Please wait a moment and try again.`,
              `Health check returned status ${healthResp.status} at ${healthUrls[provider]}`
            ));
            return;
          }
        } catch (healthErr) {
          setError(makeError(
            `Can't reach ${label}. Make sure it's running before transforming.`,
            `No response from ${healthUrls[provider]} (port ${ports[provider]})\n\nTo start it, run:\n  ${startCmd}\n\nError: ${healthErr.message}`
          ));
          return;
        }
      }

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
            model: model || 'claude-3-7-sonnet-20250219',
            max_tokens: 1500,
            system: SYSTEM_PROMPT,
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
              parts: [{ text: SYSTEM_PROMPT }]
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
      } else if (provider === 'openrouter' || provider === 'ollama' || provider === 'localai') {
        const endpoints = {
          openrouter: 'https://openrouter.ai/api/v1/chat/completions',
          ollama: 'http://localhost:11434/v1/chat/completions',
          localai: 'http://localhost:8080/v1/chat/completions',
        };
        const defaults = {
          openrouter: 'anthropic/claude-sonnet-4',
          ollama: 'llama3.1',
          localai: 'gpt-4',
        };

        const usedModel = model || defaults[provider];
        const headers = { 'Content-Type': 'application/json' };
        if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

        response = await fetch(endpoints[provider], {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: usedModel,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
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
            `Endpoint: ${endpoints[provider]}\nModel: ${usedModel}\nError: ${errMsg}\nStatus: ${response.status}`
          ));
        } else {
          setError(makeError(
            `Received an unexpected response from ${label}.`,
            `Endpoint: ${endpoints[provider]}\nModel: ${usedModel}\nStatus: ${response.status}\nResponse: ${JSON.stringify(data, null, 2)}`
          ));
        }
      }
    } catch (err) {
      if ((provider === 'ollama' || provider === 'localai') && (err.message === 'Failed to fetch' || err.name === 'TypeError')) {
        const port = provider === 'ollama' ? '11434' : '8080';
        setError(makeError(
          `Lost connection to ${label}. The server may have stopped or the model crashed.`,
          `Request to localhost:${port} failed\nError: ${err.message}\n\nTry restarting the server and ensure the model is loaded.`
        ));
      } else {
        setError(makeError(
          `Couldn't connect to ${label}. Please check your connection and try again.`,
          `Provider: ${provider}\nError: ${err.name}: ${err.message}`
        ));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult('');
    setError(null);
  }, []);

  return { result, loading, error, transform, reset };
}
