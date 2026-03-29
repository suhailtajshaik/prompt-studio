/**
 * Intent categories for auto-detecting user prompt purpose.
 * Each intent maps to the best framework + techniques for that use case.
 */

export const INTENT_CATEGORIES = [
  {
    id: 'coding',
    label: 'Coding',
    icon: '💻',
    color: '#3B82F6',
    description: 'Software development, debugging, code generation, and technical implementation',
    keywords: [
      'code', 'program', 'function', 'bug', 'debug', 'api', 'database', 'script',
      'html', 'css', 'javascript', 'python', 'react', 'node', 'sql', 'git',
      'deploy', 'server', 'frontend', 'backend', 'algorithm', 'class', 'component',
      'error', 'fix', 'build', 'compile', 'test', 'refactor', 'optimize',
      'website', 'app', 'application', 'software', 'developer', 'engineering',
      'typescript', 'java', 'rust', 'go', 'docker', 'kubernetes', 'aws',
      'endpoint', 'query', 'migration', 'schema', 'orm', 'framework',
    ],
    framework: 'costar',
    techniques: ['cot', 'structured'],
  },
  {
    id: 'writing',
    label: 'Writing',
    icon: '✍️',
    color: '#8B5CF6',
    description: 'Content creation, copywriting, articles, blog posts, and documentation',
    keywords: [
      'write', 'article', 'blog', 'post', 'essay', 'copy', 'content', 'draft',
      'paragraph', 'story', 'narrative', 'document', 'report', 'newsletter',
      'headline', 'tagline', 'slogan', 'description', 'bio', 'about',
      'landing page', 'website copy', 'product description', 'press release',
      'white paper', 'case study', 'editorial', 'opinion', 'review',
    ],
    framework: 'sixstep',
    techniques: ['role', 'few-shot'],
  },
  {
    id: 'research',
    label: 'Research',
    icon: '🔍',
    color: '#06B6D4',
    description: 'Investigation, analysis, fact-finding, and deep exploration of topics',
    keywords: [
      'research', 'investigate', 'analyze', 'study', 'explore', 'compare',
      'evaluate', 'assess', 'review', 'examine', 'find', 'discover',
      'literature', 'source', 'evidence', 'data', 'statistics', 'trend',
      'market research', 'competitive analysis', 'benchmark', 'survey',
      'methodology', 'hypothesis', 'findings', 'conclusion',
    ],
    framework: 'costar',
    techniques: ['cot', 'structured'],
  },
  {
    id: 'data_analysis',
    label: 'Data Analysis',
    icon: '📊',
    color: '#10B981',
    description: 'Data processing, visualization, statistical analysis, and reporting',
    keywords: [
      'data', 'dataset', 'csv', 'excel', 'spreadsheet', 'chart', 'graph',
      'visualization', 'metrics', 'kpi', 'dashboard', 'report', 'analytics',
      'statistics', 'correlation', 'regression', 'forecast', 'predict',
      'trend', 'pattern', 'insight', 'aggregate', 'pivot', 'filter',
      'calculate', 'formula', 'percentage', 'average', 'median',
    ],
    framework: 'costar',
    techniques: ['cot', 'structured'],
  },
  {
    id: 'creative',
    label: 'Creative',
    icon: '🎨',
    color: '#F59E0B',
    description: 'Creative content, storytelling, poetry, scripts, and artistic expression',
    keywords: [
      'creative', 'story', 'poem', 'poetry', 'fiction', 'novel', 'script',
      'screenplay', 'dialogue', 'character', 'plot', 'scene', 'imagine',
      'fantasy', 'world-building', 'lyrics', 'song', 'art', 'design',
      'illustration', 'concept', 'pitch', 'idea', 'vision', 'inspiration',
      'metaphor', 'narrative', 'voice', 'style', 'genre', 'hook',
    ],
    framework: 'markdown',
    techniques: ['role', 'zero-shot'],
  },
  {
    id: 'problem_solving',
    label: 'Problem Solving',
    icon: '🧩',
    color: '#EF4444',
    description: 'Troubleshooting, decision-making, strategy, and solution design',
    keywords: [
      'solve', 'problem', 'issue', 'challenge', 'solution', 'fix', 'resolve',
      'troubleshoot', 'decide', 'decision', 'strategy', 'plan', 'approach',
      'alternative', 'option', 'trade-off', 'pros', 'cons', 'risk',
      'prioritize', 'optimize', 'improve', 'overcome', 'obstacle',
      'bottleneck', 'root cause', 'diagnosis', 'workaround',
    ],
    framework: 'costar',
    techniques: ['cot', 'meta'],
  },
  {
    id: 'summarization',
    label: 'Summarization',
    icon: '📝',
    color: '#14B8A6',
    description: 'Condensing, simplifying, extracting key points, and creating overviews',
    keywords: [
      'summarize', 'summary', 'condense', 'simplify', 'shorten', 'brief',
      'overview', 'key points', 'highlights', 'takeaways', 'tldr', 'recap',
      'digest', 'abstract', 'outline', 'gist', 'main idea', 'essence',
      'extract', 'distill', 'compress', 'reduce', 'paraphrase',
    ],
    framework: 'sixstep',
    techniques: ['zero-shot', 'structured'],
  },
  {
    id: 'brainstorming',
    label: 'Brainstorming',
    icon: '💡',
    color: '#F97316',
    description: 'Ideation, generating ideas, exploring possibilities, and innovation',
    keywords: [
      'brainstorm', 'ideas', 'suggest', 'recommend', 'generate', 'list',
      'possibilities', 'options', 'alternatives', 'innovative', 'creative',
      'think', 'come up with', 'propose', 'what if', 'how might',
      'explore', 'possibilities', 'variations', 'angles', 'perspectives',
      'name', 'title', 'concept', 'theme', 'approach',
    ],
    framework: 'markdown',
    techniques: ['zero-shot', 'meta'],
  },
  {
    id: 'communication',
    label: 'Communication',
    icon: '💬',
    color: '#EC4899',
    description: 'Emails, messages, presentations, speeches, and professional communication',
    keywords: [
      'email', 'message', 'letter', 'reply', 'respond', 'communicate',
      'presentation', 'speech', 'pitch', 'proposal', 'meeting', 'agenda',
      'announcement', 'memo', 'notice', 'invitation', 'thank you',
      'follow up', 'outreach', 'cold email', 'introduction', 'apology',
      'negotiation', 'feedback', 'review', 'recommendation',
    ],
    framework: 'sixstep',
    techniques: ['role', 'few-shot'],
  },
  {
    id: 'learning',
    label: 'Learning',
    icon: '📚',
    color: '#6366F1',
    description: 'Education, tutorials, explanations, and skill development',
    keywords: [
      'learn', 'teach', 'explain', 'understand', 'tutorial', 'guide',
      'how to', 'what is', 'why does', 'course', 'lesson', 'concept',
      'beginner', 'advanced', 'fundamentals', 'basics', 'introduction',
      'education', 'training', 'practice', 'exercise', 'quiz', 'test',
      'knowledge', 'skill', 'master', 'improve', 'study',
    ],
    framework: 'costar',
    techniques: ['cot', 'few-shot'],
  },
];

/**
 * Auto-detect the most likely intent from user input text.
 * Uses keyword matching with scoring.
 */
export function detectIntent(text) {
  if (!text || !text.trim()) return null;

  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);

  const scores = INTENT_CATEGORIES.map((cat) => {
    let score = 0;
    for (const keyword of cat.keywords) {
      if (keyword.includes(' ')) {
        // Multi-word keyword: check as substring
        if (lower.includes(keyword)) score += 3;
      } else {
        // Single word: check word boundary
        if (words.includes(keyword)) score += 2;
        else if (lower.includes(keyword)) score += 1;
      }
    }
    return { ...cat, score };
  });

  scores.sort((a, b) => b.score - a.score);

  if (scores[0].score === 0) return null;

  return {
    primary: scores[0],
    secondary: scores[1]?.score > 0 ? scores[1] : null,
    confidence: Math.min(1, scores[0].score / 10),
  };
}

/**
 * Get the auto-selected framework and techniques for a detected intent.
 */
export function getIntentConfig(intentId) {
  const intent = INTENT_CATEGORIES.find((c) => c.id === intentId);
  if (!intent) return { framework: 'costar', techniques: ['zero-shot'] };
  return { framework: intent.framework, techniques: intent.techniques };
}
