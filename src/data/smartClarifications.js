/**
 * Smart Clarification Question Generation
 * Generates context-specific questions based on skill intent analysis
 * Only asks about ambiguities/gaps, not generic options
 */

/**
 * Pattern definitions for detecting unclear intent
 */
const INTENT_PATTERNS = {
  data_processing: {
    keywords: ['parse', 'process', 'transform', 'convert', 'extract', 'filter'],
    questions: [
      {
        id: 'input-format',
        text: 'What input format(s) should it support?',
        hint: 'e.g., CSV, JSON, XML, etc.',
        options: [
          { id: 'single', label: 'Single format', desc: 'Only one format needed' },
          { id: 'multiple', label: 'Multiple formats', desc: 'Support several formats' },
          { id: 'custom', label: 'Custom/configurable', desc: 'Let users define format' },
        ],
      },
      {
        id: 'data-volume',
        text: 'What volume of data will it handle?',
        options: [
          { id: 'small', label: 'Small', desc: '<100MB' },
          { id: 'medium', label: 'Medium', desc: '100MB - 1GB' },
          { id: 'large', label: 'Large', desc: '>1GB / streaming' },
        ],
      },
      {
        id: 'error-behavior',
        text: 'How should it handle errors?',
        options: [
          { id: 'throw', label: 'Throw exceptions', desc: 'Fail fast' },
          { id: 'log', label: 'Log and continue', desc: 'Skip bad records' },
          { id: 'both', label: 'Both (configurable)', desc: 'User decides' },
        ],
      },
    ],
  },

  api_service: {
    keywords: ['api', 'service', 'endpoint', 'rest', 'request', 'response', 'http'],
    questions: [
      {
        id: 'auth-method',
        text: 'What authentication method?',
        options: [
          { id: 'none', label: 'None', desc: 'Public API' },
          { id: 'bearer', label: 'Bearer tokens', desc: 'API keys/JWT' },
          { id: 'oauth', label: 'OAuth2', desc: 'Full OAuth flow' },
          { id: 'configurable', label: 'Configurable', desc: 'Support multiple' },
        ],
      },
      {
        id: 'response-format',
        text: 'Response format?',
        options: [
          { id: 'json', label: 'JSON only', desc: 'Standard JSON responses' },
          { id: 'configurable', label: 'Configurable', desc: 'Support JSON/XML/etc' },
        ],
      },
      {
        id: 'rate-limiting',
        text: 'Need rate limiting?',
        options: [
          { id: 'yes', label: 'Yes', desc: 'Implement rate limits' },
          { id: 'no', label: 'No', desc: 'Not needed' },
          { id: 'builtin', label: 'Yes (built-in)', desc: 'Use middleware' },
        ],
      },
      {
        id: 'concurrency',
        text: 'Concurrent request handling?',
        options: [
          { id: 'sequential', label: 'Sequential', desc: 'One at a time' },
          { id: 'fixed', label: 'Fixed pool', desc: 'e.g., 10 concurrent' },
          { id: 'unlimited', label: 'Unlimited', desc: 'Handle all' },
        ],
      },
    ],
  },

  database_orm: {
    keywords: ['database', 'db', 'store', 'persist', 'query', 'orm', 'schema', 'model'],
    questions: [
      {
        id: 'db-type',
        text: 'Target database?',
        options: [
          { id: 'sql', label: 'SQL (PostgreSQL/MySQL)', desc: 'Relational' },
          { id: 'nosql', label: 'NoSQL (MongoDB/etc)', desc: 'Document-based' },
          { id: 'both', label: 'Both / Agnostic', desc: 'Database agnostic' },
        ],
      },
      {
        id: 'query-complexity',
        text: 'Query complexity?',
        options: [
          { id: 'simple', label: 'Simple CRUD', desc: 'Basic operations' },
          { id: 'complex', label: 'Complex queries', desc: 'Joins, aggregations' },
          { id: 'both', label: 'Both', desc: 'Full query support' },
        ],
      },
      {
        id: 'migrations',
        text: 'Need migration support?',
        options: [
          { id: 'yes', label: 'Yes', desc: 'Schema versioning' },
          { id: 'no', label: 'No', desc: 'Manual schema management' },
        ],
      },
    ],
  },

  cli_tool: {
    keywords: ['cli', 'command', 'terminal', 'shell', 'command-line', 'console'],
    questions: [
      {
        id: 'subcommands',
        text: 'Number of subcommands?',
        options: [
          { id: 'single', label: 'Single command', desc: 'One main action' },
          { id: 'few', label: 'Few (2-5)', desc: 'Small set' },
          { id: 'many', label: 'Many (5+)', desc: 'Complex CLI' },
        ],
      },
      {
        id: 'interactive',
        text: 'Interactive mode needed?',
        options: [
          { id: 'no', label: 'No', desc: 'Arguments only' },
          { id: 'prompts', label: 'Yes (prompts)', desc: 'Ask user questions' },
          { id: 'repl', label: 'Yes (REPL)', desc: 'Interactive shell' },
        ],
      },
      {
        id: 'config-files',
        text: 'Config file support?',
        options: [
          { id: 'no', label: 'No', desc: 'CLI args only' },
          { id: 'yes', label: 'Yes', desc: 'Read config files' },
          { id: 'both', label: 'Both', desc: 'Args override config' },
        ],
      },
    ],
  },

  validation: {
    keywords: ['validate', 'validation', 'check', 'verify', 'schema', 'sanitize'],
    questions: [
      {
        id: 'rule-source',
        text: 'Where do validation rules come from?',
        options: [
          { id: 'hardcoded', label: 'Hardcoded', desc: 'Fixed rules' },
          { id: 'configurable', label: 'Configurable', desc: 'Pass rules in' },
          { id: 'schema', label: 'Schema-based', desc: 'e.g., JSON Schema' },
        ],
      },
      {
        id: 'error-reporting',
        text: 'How many errors to report?',
        options: [
          { id: 'first', label: 'First error only', desc: 'Stop at first' },
          { id: 'all', label: 'All errors', desc: 'Collect all' },
        ],
      },
      {
        id: 'custom-validators',
        text: 'Support custom validators?',
        options: [
          { id: 'no', label: 'No', desc: 'Built-in rules only' },
          { id: 'yes', label: 'Yes', desc: 'User-defined rules' },
        ],
      },
    ],
  },

  concurrency: {
    keywords: ['async', 'concurrent', 'parallel', 'queue', 'worker', 'thread', 'pool'],
    questions: [
      {
        id: 'pool-size',
        text: 'Worker pool size?',
        options: [
          { id: 'fixed', label: 'Fixed size', desc: 'e.g., 4 workers' },
          { id: 'dynamic', label: 'Dynamic', desc: 'Grow/shrink as needed' },
          { id: 'configurable', label: 'Configurable', desc: 'User sets size' },
        ],
      },
      {
        id: 'queue-behavior',
        text: 'Queue full behavior?',
        options: [
          { id: 'wait', label: 'Wait', desc: 'Block until space' },
          { id: 'drop', label: 'Drop', desc: 'Reject new items' },
          { id: 'error', label: 'Error', desc: 'Throw exception' },
        ],
      },
      {
        id: 'priority',
        text: 'Priority queue support?',
        options: [
          { id: 'no', label: 'No', desc: 'FIFO only' },
          { id: 'yes', label: 'Yes', desc: 'Support priorities' },
        ],
      },
    ],
  },

  caching: {
    keywords: ['cache', 'caching', 'memoize', 'store', 'redis', 'in-memory'],
    questions: [
      {
        id: 'cache-backend',
        text: 'Cache backend?',
        options: [
          { id: 'memory', label: 'In-memory', desc: 'RAM only' },
          { id: 'redis', label: 'Redis', desc: 'Distributed' },
          { id: 'both', label: 'Both', desc: 'Multiple backends' },
        ],
      },
      {
        id: 'eviction',
        text: 'Eviction policy?',
        options: [
          { id: 'lru', label: 'LRU', desc: 'Least recently used' },
          { id: 'lfu', label: 'LFU', desc: 'Least frequently used' },
          { id: 'ttl', label: 'TTL', desc: 'Time-based expiry' },
          { id: 'configurable', label: 'Configurable', desc: 'User chooses' },
        ],
      },
      {
        id: 'cache-invalidation',
        text: 'Cache invalidation?',
        options: [
          { id: 'ttl', label: 'TTL only', desc: 'Automatic expiry' },
          { id: 'manual', label: 'Manual', desc: 'User controls' },
          { id: 'both', label: 'Both', desc: 'TTL + manual' },
        ],
      },
    ],
  },
};

/**
 * Detect intent from skill description using keyword matching
 * Returns array of detected intents with confidence scores
 */
export function detectIntent(description) {
  if (!description) return [];

  const lowerDesc = description.toLowerCase();
  const detected = [];

  for (const [intent, data] of Object.entries(INTENT_PATTERNS)) {
    const matchCount = data.keywords.filter(kw => lowerDesc.includes(kw)).length;
    if (matchCount > 0) {
      detected.push({
        intent,
        confidence: matchCount / data.keywords.length,
        questions: data.questions,
      });
    }
  }

  // Sort by confidence (highest first)
  return detected.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Generate clarification questions for a skill description
 * Returns array of relevant questions (max 4) based on intent
 */
export function generateClarifications(description) {
  const intents = detectIntent(description);
  if (intents.length === 0) return [];

  // Get questions from top intent(s)
  const questions = [];
  const seenIds = new Set();

  for (const intent of intents) {
    for (const question of intent.questions) {
      if (!seenIds.has(question.id) && questions.length < 4) {
        seenIds.add(question.id);
        questions.push(question);
      }
    }
  }

  return questions;
}

/**
 * Build clarification context string for system prompt
 * Only includes answered clarifications
 */
export function buildClarificationContext(answers) {
  if (!answers || Object.keys(answers).length === 0) {
    return '';
  }

  let context = 'User Clarifications:\n';
  let hasAnswers = false;

  for (const [questionId, answer] of Object.entries(answers)) {
    if (answer) {
      context += `- ${questionId}: ${answer}\n`;
      hasAnswers = true;
    }
  }

  return hasAnswers ? context : '';
}
