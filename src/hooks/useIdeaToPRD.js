import { useState, useCallback } from 'react';
import { IDEA_TO_PRD_PROMPTS } from '../data/ideaToPRD';

const PROVIDER_LABELS = {
  anthropic: 'Anthropic',
  gemini: 'Google Gemini',
  openrouter: 'OpenRouter',
};

function makeError(message, details) {
  return { message, details };
}

function parseClarifications(text) {
  if (!text || typeof text !== 'string') {
    console.error('Invalid clarifications response', text);
    return null;
  }

  try {
    // Try to extract JSON from markdown code blocks first
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[1]);
      return parsed.cards || parsed;
    }

    // Try to find JSON object directly
    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error('No JSON array found in clarifications response');
      return null;
    }

    const jsonString = text.substring(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(jsonString);
    return parsed;
  } catch (e) {
    console.error('Failed to parse clarifications:', e.message);
    return null;
  }
}

function parsePRD(text) {
  if (!text || typeof text !== 'string') {
    console.error('Invalid PRD response', text);
    return null;
  }

  try {
    // Extract markdown from response (everything is markdown for PRD)
    const markdown = text.trim();
    
    if (!markdown) {
      return null;
    }

    // Simple markdown to HTML converter
    const html = markdownToHtml(markdown);
    
    return {
      markdown,
      html,
      text: text,
    };
  } catch (e) {
    console.error('Failed to parse PRD:', e.message);
    return null;
  }
}

function markdownToHtml(markdown) {
  let html = markdown
    // Headers
    .replace(/^### (.*?)$/gm, '<h3 class="text-sm font-bold text-text mt-4 mb-2">$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2 class="text-base font-bold text-text mt-4 mb-2">$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1 class="text-lg font-bold text-text mt-4 mb-2">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-accent-text">$1</strong>')
    .replace(/__(.+?)__/g, '<strong class="font-semibold text-accent-text">$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/_(.+?)_/g, '<em class="italic">$1</em>')
    // Code
    .replace(/`(.*?)`/g, '<code class="bg-surface-alt px-1.5 py-0.5 rounded text-accent-text font-mono text-xs">$1</code>')
    // Line breaks
    .replace(/\n\n/g, '</p><p class="text-xs sm:text-sm text-text-secondary leading-relaxed mt-3">')
    .replace(/\n/g, '<br/>');

  // Wrap in paragraphs
  html = `<p class="text-xs sm:text-sm text-text-secondary leading-relaxed">${html}</p>`;

  return html;
}

export function useIdeaToPRD() {
  const [prd, setPrd] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateClarifications = useCallback(
    async (idea, provider = 'anthropic', model = 'claude-3-7-sonnet-20250219', apiKey) => {
      if (!idea.trim()) return null;

      setLoading(true);
      setError(null);

      const label = PROVIDER_LABELS[provider] || provider;
      const systemPrompt = IDEA_TO_PRD_PROMPTS[provider]?.clarifications || 
                          IDEA_TO_PRD_PROMPTS.anthropic.clarifications;

      try {
        let response;
        let data;

        const userMessage = `Based on this product idea, generate 3-5 specific, context-aware clarification questions as JSON cards:

"${idea}"

Each card should ask about something ACTUALLY UNCLEAR in this specific idea, not generic questions.

Example format:
\`\`\`json
[
  {
    "id": "unique-id",
    "question": "Who's your primary user?",
    "description": "Understanding target market helps shape features",
    "options": [
      { "id": "opt-1", "label": "Enterprises", "description": "B2B, compliance-heavy", "icon": "🏢" },
      { "id": "opt-2", "label": "Consumers", "description": "Mass market", "icon": "👤" }
    ]
  }
]
\`\`\`

Respond ONLY with valid JSON array, no other text.`;

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
              max_tokens: 2000,
              system: systemPrompt,
              messages: [{ role: 'user', content: userMessage }],
            }),
          });

          data = await response.json();

          if (data.content && data.content[0]?.text) {
            const parsed = parseClarifications(data.content[0].text);
            if (parsed && Array.isArray(parsed) && parsed.length > 0) {
              setLoading(false);
              return parsed;
            } else {
              setError(makeError(
                'Failed to parse clarification questions.',
                `Response: ${data.content[0].text.substring(0, 200)}`
              ));
            }
          } else if (data.error) {
            setError(makeError(
              'Something went wrong with Anthropic.',
              `${data.error.type || 'error'}: ${data.error.message}`
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
            const parsed = parseClarifications(data.candidates[0].content.parts[0].text);
            if (parsed && Array.isArray(parsed) && parsed.length > 0) {
              setLoading(false);
              return parsed;
            }
          } else if (data.error) {
            setError(makeError(
              'Something went wrong with Gemini.',
              `${data.error.code || 'error'}: ${data.error.message}`
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
              max_tokens: 2000,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
              ],
            })
          });

          data = await response.json();
          if (data.choices && data.choices[0]?.message?.content) {
            const parsed = parseClarifications(data.choices[0].message.content);
            if (parsed && Array.isArray(parsed) && parsed.length > 0) {
              setLoading(false);
              return parsed;
            }
          } else if (data.error) {
            const errMsg = data.error?.message || JSON.stringify(data.error);
            setError(makeError(`${label} error`, errMsg));
          }
        }
      } catch (err) {
        setError(makeError(
          `Couldn't connect to ${label}.`,
          `Error: ${err.message}`
        ));
      } finally {
        setLoading(false);
      }

      return null;
    },
    []
  );

  const generatePRD = useCallback(
    async (idea, clarifications, selections, provider = 'anthropic', model = 'claude-3-7-sonnet-20250219', apiKey) => {
      setLoading(true);
      setError(null);
      setPrd(null);

      const label = PROVIDER_LABELS[provider] || provider;
      const systemPrompt = IDEA_TO_PRD_PROMPTS[provider]?.prd || 
                          IDEA_TO_PRD_PROMPTS.anthropic.prd;

      try {
        // Build context from selections
        let selectionsContext = '';
        if (selections && Object.keys(selections).length > 0) {
          selectionsContext = '\nUser answers to clarification questions:\n';
          Object.entries(selections).forEach(([cardId, optionId]) => {
            const card = clarifications.find(c => c.id === cardId);
            if (card) {
              const option = card.options.find(o => o.id === optionId);
              if (option) {
                selectionsContext += `- ${card.question}: ${option.label}\n`;
              }
            }
          });
        }

        let response;
        let data;

        const userMessage = `Generate a comprehensive Product Requirement Document (PRD) for this idea:

"${idea}"
${selectionsContext}

Create a detailed, professional PRD with:
1. Executive Summary
2. Product Vision & Goals
3. User Personas
4. Core Features & Requirements
5. Technical Considerations
6. Success Metrics
7. Timeline & Phases
8. Risks & Mitigation

Format as clean Markdown. Be specific and actionable based on the clarifications provided.`;

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
            const parsed = parsePRD(data.content[0].text);
            if (parsed) {
              setPrd(parsed);
              return true;
            } else {
              setError(makeError(
                'Failed to generate PRD.',
                'The response was empty or invalid.'
              ));
            }
          } else if (data.error) {
            setError(makeError(
              'Something went wrong with Anthropic.',
              `${data.error.type || 'error'}: ${data.error.message}`
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
            const parsed = parsePRD(data.candidates[0].content.parts[0].text);
            if (parsed) {
              setPrd(parsed);
              return true;
            }
          } else if (data.error) {
            setError(makeError(
              'Something went wrong with Gemini.',
              `${data.error.code || 'error'}: ${data.error.message}`
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
            const parsed = parsePRD(data.choices[0].message.content);
            if (parsed) {
              setPrd(parsed);
              return true;
            }
          } else if (data.error) {
            const errMsg = data.error?.message || JSON.stringify(data.error);
            setError(makeError(`${label} error`, errMsg));
          }
        }
      } catch (err) {
        setError(makeError(
          `Couldn't connect to ${label}.`,
          `Error: ${err.message}`
        ));
      } finally {
        setLoading(false);
      }

      return false;
    },
    []
  );

  const reset = useCallback(() => {
    setPrd(null);
    setError(null);
  }, []);

  return { prd, loading, error, generateClarifications, generatePRD, reset };
}
