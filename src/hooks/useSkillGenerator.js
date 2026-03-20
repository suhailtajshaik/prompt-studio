import { useState, useCallback } from 'react';
import { SYSTEM_PROMPTS, LANGUAGE_TEMPLATES } from '../data/skillGeneration';

const PROVIDER_LABELS = {
  anthropic: 'Anthropic',
  gemini: 'Google Gemini',
  openrouter: 'OpenRouter',
};

const LANGUAGE_NAMES = {
  python: 'Python',
  nodejs: 'Node.js/TypeScript',
  go: 'Go',
  rust: 'Rust',
  java: 'Java',
  cpp: 'C++',
};

function makeError(message, details) {
  return { message, details };
}

function parseSkillOutput(text) {
  if (!text || typeof text !== 'string') {
    console.error('Invalid input: text is not a string', text);
    return null;
  }

  // Log the raw response for debugging
  console.log('[PARSER DEBUG] Raw response length:', text.length);
  console.log('[PARSER DEBUG] First 200 chars:', text.substring(0, 200));

  // Try to extract JSON from markdown code blocks first
  const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/);
  if (jsonMatch) {
    try {
      console.log('[PARSER] Found JSON in markdown code block');
      const parsed = JSON.parse(jsonMatch[1]);
      console.log('[PARSER] Successfully parsed JSON from markdown');
      return parsed;
    } catch (e) {
      console.error('[PARSER] Failed to parse JSON from markdown:', e.message);
    }
  }

  // Try to find JSON object directly (most robust approach)
  try {
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error('[PARSER] No JSON object found in response');
      return null;
    }

    const jsonString = text.substring(jsonStart, jsonEnd + 1);
    console.log('[PARSER] Extracted JSON string, length:', jsonString.length);
    
    const parsed = JSON.parse(jsonString);
    console.log('[PARSER] Successfully parsed JSON object directly');
    
    // Validate required fields
    if (!parsed.name || !parsed.main_code) {
      console.error('[PARSER] Missing required fields:', {
        name: parsed.name,
        main_code: !!parsed.main_code
      });
      return null;
    }
    
    return parsed;
  } catch (e) {
    console.error('[PARSER] Failed to parse JSON:', e.message);
    console.log('[PARSER] Last 200 chars of response:', text.substring(Math.max(0, text.length - 200)));
    return null;
  }
}

export function useSkillGenerator() {
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(async (skillDescription, language = 'python', provider = 'anthropic', model = 'claude-3-7-sonnet-20250219', apiKey, clarificationContext = '') => {
    if (!skillDescription.trim()) return;

    setLoading(true);
    setError(null);
    setSkill(null);

    const label = PROVIDER_LABELS[provider] || provider;
    const languageName = LANGUAGE_NAMES[language] || language;
    const systemPrompt = SYSTEM_PROMPTS[provider]?.[language] || SYSTEM_PROMPTS.anthropic.python;

    try {
      let response;
      let data;

      // Build the user message with clarification context if provided
      let userMessage = `Generate a complete, self-contained ${languageName} module based on this request:

"${skillDescription}"`;

      if (clarificationContext) {
        userMessage += `\n\n${clarificationContext}`;
      }

      userMessage += `\n\nRequirements:
1. Production-ready code (no placeholders)
2. Self-contained with minimal dependencies
3. Fully functional with examples
4. Proper error handling and documentation
5. Best practices for ${languageName}

Respond ONLY with valid JSON (no markdown, no code blocks):`;

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
            max_tokens: 4000,
            system: systemPrompt,
            messages: [{ role: 'user', content: userMessage }],
          }),
        });

        data = await response.json();

        if (data.content && data.content[0]?.text) {
          const parsed = parseSkillOutput(data.content[0].text);
          if (parsed && parsed.name && parsed.main_code) {
            setSkill({ ...parsed, language });
            return true;
          } else {
            const responseText = data.content[0].text;
            const debugInfo = {
              responseLength: responseText.length,
              firstChars: responseText.substring(0, 300),
              hasJsonBraces: responseText.includes('{') && responseText.includes('}'),
              parsed: parsed ? 'parsed but missing fields' : 'failed to parse'
            };
            setError(makeError(
              'Failed to parse module generation output. Response was malformed or missing required fields (name, main_code).',
              `Debug info:\n${JSON.stringify(debugInfo, null, 2)}\n\nCheck browser console for detailed parser logs.`
            ));
          }
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
          const responseText = data.candidates[0].content.parts[0].text;
          const parsed = parseSkillOutput(responseText);
          if (parsed && parsed.name && parsed.main_code) {
            setSkill({ ...parsed, language });
            return true;
          } else {
            const debugInfo = {
              responseLength: responseText.length,
              firstChars: responseText.substring(0, 300),
              hasJsonBraces: responseText.includes('{') && responseText.includes('}'),
              parsed: parsed ? 'parsed but missing fields' : 'failed to parse'
            };
            setError(makeError(
              'Failed to parse module generation output. Response was malformed or missing required fields.',
              `Debug info:\n${JSON.stringify(debugInfo, null, 2)}\n\nCheck browser console for detailed parser logs.`
            ));
          }
        } else if (data.error) {
          setError(makeError(
            'Something went wrong with Gemini. Check your API key and try again.',
            `${data.error.code || 'error'}: ${data.error.message}\nModel: ${model}`
          ));
        } else {
          setError(makeError(
            'Received an unexpected response from Gemini.',
            `Status: ${response.status}`
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
            max_tokens: 4000,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userMessage }
            ],
          })
        });

        data = await response.json();
        if (data.choices && data.choices[0]?.message?.content) {
          const responseText = data.choices[0].message.content;
          const parsed = parseSkillOutput(responseText);
          if (parsed && parsed.name && parsed.main_code) {
            setSkill({ ...parsed, language });
            return true;
          } else {
            const debugInfo = {
              responseLength: responseText.length,
              firstChars: responseText.substring(0, 300),
              hasJsonBraces: responseText.includes('{') && responseText.includes('}'),
              parsed: parsed ? 'parsed but missing fields' : 'failed to parse'
            };
            setError(makeError(
              'Failed to parse module generation output. Response was malformed or missing required fields.',
              `Debug info:\n${JSON.stringify(debugInfo, null, 2)}\n\nCheck browser console for detailed parser logs.`
            ));
          }
        } else if (data.error) {
          const errMsg = data.error?.message || (typeof data.error === 'string' ? data.error : JSON.stringify(data.error));
          setError(makeError(
            `${label} couldn't process the request.`,
            `Model: ${usedModel}\nError: ${errMsg}`
          ));
        } else {
          setError(makeError(
            `Received an unexpected response from ${label}.`,
            `Model: ${usedModel}`
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

  const reset = useCallback(() => {
    setSkill(null);
    setError(null);
  }, []);

  return { skill, loading, error, generate, reset };
}
