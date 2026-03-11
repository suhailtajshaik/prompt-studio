import { useState, useCallback } from 'react';
import { FRAMEWORKS, TECHNIQUES, SYSTEM_PROMPT } from '../data/constants';

export function useTransform() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const transform = useCallback(async (badPrompt, frameworkId, techniqueIds, provider = 'anthropic', model = 'claude-3-7-sonnet-20250219', apiKey) => {
    if (!badPrompt.trim()) return;

    setLoading(true);
    setError('');
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
          setError(data.error.message || 'API returned an error');
        } else {
          setError('Unexpected response from API');
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
          setError(data.error.message || 'API returned an error');
        } else {
          setError('Unexpected response from API');
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

        const headers = { 'Content-Type': 'application/json' };
        if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

        response = await fetch(endpoints[provider], {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: model || defaults[provider],
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
          setError(data.error?.message || (typeof data.error === 'string' ? data.error : 'API returned an error'));
        } else {
          setError('Unexpected response from API');
        }
      }
    } catch (err) {
      setError(`Connection failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult('');
    setError('');
  }, []);

  return { result, loading, error, transform, reset };
}
