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
    console.error('[PARSER] Invalid input: text is not a string', text);
    return null;
  }

  console.log('[PARSER] Starting parse, text length:', text.length);

  // Required fields that must be present in the response
  const REQUIRED_FIELDS = ['name', 'description', 'language', 'main_file', 'main_code', 'dependency_file', 'dependency_content', 'readme', 'example_file', 'example_code', 'metadata'];
  const OPTIONAL_FIELDS = ['test_file', 'test_code'];

  // Try to extract JSON from markdown code blocks (```json ... ```)
  const jsonMarkdownMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (jsonMarkdownMatch) {
    try {
      console.log('[PARSER] Found JSON in markdown code block (attempting parse)');
      const parsed = JSON.parse(jsonMarkdownMatch[1]);
      const validation = validateSkillJSON(parsed, REQUIRED_FIELDS);
      if (validation.valid) {
        console.log('[PARSER] ✅ Successfully parsed from markdown block');
        return parsed;
      } else {
        console.warn('[PARSER] ⚠️ Markdown JSON missing fields:', validation.missing);
      }
    } catch (e) {
      console.error('[PARSER] Failed to parse markdown block:', e.message);
    }
  }

  // Try to find JSON object directly (find first { and last })
  try {
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error('[PARSER] ❌ No JSON braces found in response');
      console.log('[PARSER] Response text preview:', text.substring(0, 200));
      return null;
    }

    const jsonString = text.substring(jsonStart, jsonEnd + 1);
    console.log('[PARSER] Extracted JSON substring, length:', jsonString.length);
    
    const parsed = JSON.parse(jsonString);
    console.log('[PARSER] ✅ JSON parsed successfully');
    
    // Validate all required fields
    const validation = validateSkillJSON(parsed, REQUIRED_FIELDS);
    if (!validation.valid) {
      console.error('[PARSER] ❌ Missing required fields:', validation.missing);
      console.error('[PARSER] Validation report:', JSON.stringify(validation, null, 2));
      return null;
    }
    
    console.log('[PARSER] ✅ All required fields present, skill:', parsed.name);
    return parsed;
  } catch (e) {
    console.error('[PARSER] ❌ Failed to parse JSON:', e.message);
    console.log('[PARSER] Response preview (first 500 chars):', text.substring(0, 500));
    console.log('[PARSER] Response preview (last 500 chars):', text.substring(Math.max(0, text.length - 500)));
    return null;
  }
}

function validateSkillJSON(obj, requiredFields) {
  const validation = {
    valid: true,
    missing: [],
    invalid: [],
    present: []
  };

  for (const field of requiredFields) {
    if (!(field in obj)) {
      validation.missing.push(field);
      validation.valid = false;
    } else if (!obj[field]) {
      validation.invalid.push({ field, value: obj[field] });
      validation.valid = false;
    } else {
      validation.present.push(field);
    }
  }

  return validation;
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
          const responseText = data.content[0].text;
          const parsed = parseSkillOutput(responseText);
          if (parsed) {
            setSkill({ ...parsed, language });
            return true;
          } else {
            const debugInfo = {
              responseLength: responseText.length,
              firstChars: responseText.substring(0, 200),
              hasJsonBraces: responseText.includes('{') && responseText.includes('}'),
              parsed: parsed ? 'parsed but missing fields' : 'failed to parse JSON'
            };
            setError(makeError(
              '⚠️ Failed to parse skill generation output. The response was malformed or missing required JSON fields.',
              `Debug info:\n${JSON.stringify(debugInfo, null, 2)}\n\n📋 Expected fields: name, description, language, main_file, main_code, dependency_file, dependency_content, readme, example_file, example_code, metadata\n\n🔍 Check browser console for detailed parser logs showing which fields are missing.`
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
          if (parsed) {
            setSkill({ ...parsed, language });
            return true;
          } else {
            const debugInfo = {
              responseLength: responseText.length,
              firstChars: responseText.substring(0, 200),
              hasJsonBraces: responseText.includes('{') && responseText.includes('}'),
              parsed: parsed ? 'parsed but missing fields' : 'failed to parse JSON'
            };
            setError(makeError(
              '⚠️ Failed to parse skill generation output. The response was malformed or missing required JSON fields.',
              `Debug info:\n${JSON.stringify(debugInfo, null, 2)}\n\n📋 Expected fields: name, description, language, main_file, main_code, dependency_file, dependency_content, readme, example_file, example_code, metadata\n\n🔍 Check browser console for detailed parser logs showing which fields are missing.`
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
          if (parsed) {
            setSkill({ ...parsed, language });
            return true;
          } else {
            const debugInfo = {
              responseLength: responseText.length,
              firstChars: responseText.substring(0, 200),
              hasJsonBraces: responseText.includes('{') && responseText.includes('}'),
              parsed: parsed ? 'parsed but missing fields' : 'failed to parse JSON'
            };
            setError(makeError(
              '⚠️ Failed to parse skill generation output. The response was malformed or missing required JSON fields.',
              `Debug info:\n${JSON.stringify(debugInfo, null, 2)}\n\n📋 Expected fields: name, description, language, main_file, main_code, dependency_file, dependency_content, readme, example_file, example_code, metadata\n\n🔍 Check browser console for detailed parser logs showing which fields are missing.`
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
