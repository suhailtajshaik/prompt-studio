import { motion } from 'framer-motion';
import { ExternalLink, BookOpen, Zap, GraduationCap } from 'lucide-react';
import { FRAMEWORKS, TECHNIQUES } from '../data/constants';

const DESIGN_PRINCIPLES = [
  { stage: 'C — Context', prevents: 'Hallucination from missing background' },
  { stage: 'O — Objective', prevents: 'Scope creep and tangential responses' },
  { stage: 'S — Steps', prevents: 'Sloppy reasoning and skipped logic' },
  { stage: 'T — Tools', prevents: 'Wrong tool for the job, or ignoring available tools' },
  { stage: 'A — Actions', prevents: 'Inconsistent formatting and tone drift' },
  { stage: 'R — Reflection', prevents: 'Unverified claims shipping to the user' },
];

const FRAMEWORK_COLORS = {
  costar: '#00B894',
  sixstep: '#F39C12',
  markdown: '#A855F7',
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export default function LearnView() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4 sm:space-y-6"
    >
      {/* Frameworks */}
      {Object.values(FRAMEWORKS).map((fw) => {
        const color = FRAMEWORK_COLORS[fw.id];
        return (
          <motion.div key={fw.id} variants={item} className="card p-5 sm:p-7">
            <div className="flex items-center gap-2.5 sm:gap-3.5 mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0"
                   style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                <BookOpen size={16} className="sm:hidden" style={{ color }} />
                <BookOpen size={18} className="hidden sm:block" style={{ color }} />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-display font-bold text-text">{fw.name}</h3>
                <p className="text-[10px] sm:text-xs text-text-tertiary font-mono mt-0.5 truncate">{fw.tagline}</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-4 sm:mb-5 font-body">
              {fw.description}
            </p>

            <div className="flex flex-wrap gap-1.5 sm:gap-2.5">
              {fw.fields.map((f) => (
                <div
                  key={f.key}
                  className="px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-body border"
                  style={{
                    background: `${color}08`,
                    borderColor: `${color}20`,
                  }}
                >
                  <span className="font-semibold" style={{ color }}>{f.label}</span>
                  <span className="text-text-tertiary ml-1.5 sm:ml-2 hidden xs:inline">{f.hint}</span>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* Techniques */}
      <motion.div variants={item} className="card p-5 sm:p-7">
        <div className="flex items-center gap-2.5 sm:gap-3.5 mb-4 sm:mb-6">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0"
               style={{ background: 'var(--gradient-primary)' }}>
            <Zap size={16} className="text-white sm:hidden" />
            <Zap size={18} className="text-white hidden sm:block" />
          </div>
          <h3 className="text-base sm:text-lg font-display font-bold text-text">Prompting Techniques</h3>
        </div>
        <div className="space-y-2.5 sm:space-y-3">
          {TECHNIQUES.map((tech) => (
            <div
              key={tech.id}
              className="flex items-start gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-xl bg-surface-alt/60 border border-border/50
                         hover:bg-surface-hover hover:border-border-focus transition-all duration-200"
            >
              <span className="text-xl sm:text-2xl mt-0.5 shrink-0">{tech.icon}</span>
              <div className="min-w-0">
                <h4 className="font-semibold text-xs sm:text-sm text-text font-display mb-1 sm:mb-1.5">
                  {tech.name}
                </h4>
                <p className="text-[10px] sm:text-xs text-text-secondary leading-relaxed font-body">
                  {tech.description}
                </p>
                <span className="inline-block mt-2 sm:mt-2.5 text-[9px] sm:text-[11px] font-mono text-accent-text bg-accent-light px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border border-accent/15">
                  Best for: {tech.when}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* COSTAR Design Principles */}
      <motion.div variants={item} className="card p-5 sm:p-7">
        <div className="flex items-center gap-2.5 sm:gap-3.5 mb-4 sm:mb-5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-accent-light border border-accent/15 shrink-0">
            <GraduationCap size={16} className="text-accent sm:hidden" />
            <GraduationCap size={18} className="text-accent hidden sm:block" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-display font-bold text-text">Why COSTAR Works</h3>
            <p className="text-[10px] sm:text-xs text-text-tertiary mt-0.5">
              Each letter constrains a different failure mode
            </p>
          </div>
        </div>

        {/* Mobile: stacked cards / Desktop: table */}
        <div className="hidden sm:block overflow-x-auto rounded-xl border border-border/50">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-alt/60">
                <th className="p-4 text-xs uppercase tracking-wider text-text-tertiary font-mono font-medium">
                  Stage
                </th>
                <th className="p-4 text-xs uppercase tracking-wider text-text-tertiary font-mono font-medium">
                  Prevents
                </th>
              </tr>
            </thead>
            <tbody>
              {DESIGN_PRINCIPLES.map((row, i) => (
                <tr key={i} className="border-t border-border/40 hover:bg-surface-alt/30 transition-colors">
                  <td className="p-4 text-sm font-semibold font-display text-accent-text whitespace-nowrap">
                    {row.stage}
                  </td>
                  <td className="p-4 text-sm text-text-secondary font-body">
                    {row.prevents}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked version */}
        <div className="sm:hidden space-y-2">
          {DESIGN_PRINCIPLES.map((row, i) => (
            <div key={i} className="p-3 rounded-xl bg-surface-alt/40 border border-border/30">
              <div className="text-xs font-semibold font-display text-accent-text mb-1">
                {row.stage}
              </div>
              <div className="text-[10px] text-text-secondary font-body leading-relaxed">
                {row.prevents}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Source Attribution */}
      <motion.div variants={item} className="text-center py-4 sm:py-6">
        <p className="text-[10px] sm:text-xs text-text-tertiary/70 leading-relaxed">
          Frameworks: COSTAR, 6-Step Prompt Checklist, Markdown Prompting.
          Techniques based on research from{' '}
          <a
            href="https://www.promptingguide.ai"
            target="_blank"
            rel="noreferrer"
            className="text-accent-text hover:underline inline-flex items-center gap-1"
          >
            promptingguide.ai <ExternalLink size={9} />
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}
