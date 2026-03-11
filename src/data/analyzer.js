const CHECKS = [
  {
    test: (t) => t.split(/\s+/).filter(Boolean).length < 6,
    issue: 'Too few words — AI will fill in the gaps with assumptions',
    fix: 'Expand to at least 2–3 sentences with specifics about what you need',
    severity: 'high',
  },
  {
    test: (t) => /^(write|make|create|do|give|tell|help|explain|build|generate)\s/i.test(t) && t.split(/\s+/).length < 12,
    issue: 'Bare command with no context or constraints',
    fix: 'Add who it\'s for, what format, what constraints, and why you need it',
    severity: 'high',
  },
  {
    test: (t) => !/\b(as|like|in the style|format|example|step|persona|role|context|audience|tone)\b/i.test(t),
    issue: 'No structural elements — missing role, format, or examples',
    fix: 'Apply a framework like COSTAR or the 6-Step Checklist to add structure',
    severity: 'medium',
  },
  {
    test: (t) => !/\b(json|markdown|bullet|table|list|paragraph|code|csv|numbered|heading)\b/i.test(t),
    issue: 'No output format specified',
    fix: 'Tell the AI exactly how you want the response formatted',
    severity: 'medium',
  },
  {
    test: (t) => !/\b(because|since|given|context|background|for|about|regarding|specifically)\b/i.test(t) && t.split(/\s+/).length < 20,
    issue: 'No context or background provided',
    fix: 'Explain why you need this and what the surrounding situation is',
    severity: 'medium',
  },
  {
    test: (t) => !/\b(don't|do not|avoid|never|must not|exclude|without|skip)\b/i.test(t),
    issue: 'No negative constraints (anti-goals)',
    fix: 'Tell the AI what to avoid — this reduces unwanted output',
    severity: 'low',
  },
  {
    test: (t) => !/\b(expert|professional|senior|specialist|experienced|you are)\b/i.test(t),
    issue: 'No persona or expertise level defined',
    fix: 'Assign a specific role: "You are a senior backend engineer..."',
    severity: 'low',
  },
];

export function analyzePrompt(text) {
  if (!text.trim()) return { issues: [], score: 0, grade: '' };

  const issues = CHECKS.filter((check) => check.test(text)).map(({ issue, fix, severity }) => ({
    issue,
    fix,
    severity,
  }));

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const highCount = issues.filter((i) => i.severity === 'high').length;
  const medCount = issues.filter((i) => i.severity === 'medium').length;

  // Score 0-100
  let score = 100;
  score -= highCount * 25;
  score -= medCount * 12;
  score -= issues.filter((i) => i.severity === 'low').length * 5;
  if (wordCount < 5) score -= 20;
  else if (wordCount < 10) score -= 10;
  score = Math.max(0, Math.min(100, score));

  let grade = '';
  if (score >= 80) grade = 'Good';
  else if (score >= 50) grade = 'Needs Work';
  else grade = 'Poor';

  return { issues: issues.slice(0, 5), score, grade };
}

export function getScoreColor(score) {
  if (score >= 80) return '#00d4aa';
  if (score >= 50) return '#e8b931';
  return '#ff5c5c';
}

export function getScoreClass(score) {
  if (score >= 80) return 'score-good';
  if (score >= 50) return 'score-warn';
  return 'score-poor';
}
