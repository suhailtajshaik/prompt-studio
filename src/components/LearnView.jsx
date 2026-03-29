import { motion } from 'framer-motion';
import { ExternalLink, BookOpen, Zap, Brain, ArrowRight } from 'lucide-react';
import { FRAMEWORKS, TECHNIQUES } from '../data/constants';
import { INTENT_CATEGORIES } from '../data/intents';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const FRAMEWORK_COLORS = {
  decode_intent: '#E11D48',
  costar: '#10B981',
  sixstep: '#F59E0B',
  markdown: '#8B5CF6',
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

export default function LearnView() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Intent Categories */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                   style={{ background: 'var(--gradient-accent)' }}>
                <Brain size={16} className="text-white" />
              </div>
              <div>
                <CardTitle className="text-base">Intent Categories</CardTitle>
                <p className="text-xs text-text-tertiary mt-0.5">
                  We auto-detect your intent and select the best framework + techniques
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {INTENT_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-start gap-3 p-3.5 rounded-xl border border-border bg-surface-alt/50
                             hover:bg-surface-hover hover:border-border-focus transition-all duration-200"
                >
                  <span className="text-xl mt-0.5 shrink-0">{cat.icon}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-text">{cat.label}</h4>
                    </div>
                    <p className="text-[11px] text-text-tertiary leading-relaxed mb-2">
                      {cat.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-text-tertiary font-mono flex-wrap">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 rounded-lg">
                        {FRAMEWORKS[cat.framework]?.name}
                      </Badge>
                      <ArrowRight size={8} className="opacity-30" />
                      {cat.techniques.map((tid) => {
                        const tech = TECHNIQUES.find((t) => t.id === tid);
                        return tech ? (
                          <Badge key={tid} variant="outline" className="text-[10px] px-1.5 py-0 rounded-lg">
                            {tech.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Frameworks */}
      {Object.values(FRAMEWORKS).map((fw) => {
        const color = FRAMEWORK_COLORS[fw.id];
        if (!color) return null;
        return (
          <motion.div key={fw.id} variants={item}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: `${color}10`, border: `1px solid ${color}20` }}
                  >
                    <BookOpen size={16} style={{ color }} />
                  </div>
                  <div>
                    <CardTitle className="text-base">{fw.name}</CardTitle>
                    <p className="text-xs text-text-tertiary font-mono mt-0.5">{fw.tagline}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-text-secondary leading-relaxed">
                  {fw.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {fw.fields.map((f) => (
                    <div
                      key={f.key}
                      className="px-3.5 py-2.5 rounded-xl text-xs border"
                      style={{ background: `${color}06`, borderColor: `${color}15` }}
                    >
                      <span className="font-semibold" style={{ color }}>{f.label}</span>
                      <span className="text-text-tertiary ml-2 hidden sm:inline">{f.hint}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}

      {/* Techniques */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                   style={{ background: 'var(--gradient-accent)' }}>
                <Zap size={16} className="text-white" />
              </div>
              <CardTitle className="text-base">Prompting Techniques</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {TECHNIQUES.map((tech) => (
              <div
                key={tech.id}
                className="flex items-start gap-3 p-4 rounded-xl bg-surface-alt border border-border
                           hover:bg-surface-hover hover:border-border-focus transition-all duration-200"
              >
                <span className="text-xl mt-0.5 shrink-0">{tech.icon}</span>
                <div>
                  <h4 className="font-semibold text-sm text-text mb-1">{tech.name}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {tech.description}
                  </p>
                  <Badge variant="outline" className="mt-2 text-[11px] font-mono rounded-lg">
                    Best for: {tech.when}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Source Attribution */}
      <motion.div variants={item} className="text-center py-4 pb-8">
        <p className="text-xs text-text-tertiary leading-relaxed">
          Frameworks: COSTAR, 6-Step Prompt Checklist, Markdown Prompting.
          Techniques based on research from{' '}
          <a
            href="https://www.promptingguide.ai"
            target="_blank"
            rel="noreferrer"
            className="text-accent-text hover:underline inline-flex items-center gap-1"
          >
            promptingguide.ai <ExternalLink size={10} />
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}
