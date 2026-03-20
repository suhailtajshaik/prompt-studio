import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Code2 } from 'lucide-react';

const SYNTAX_HIGHLIGHT = {
  '#': '#a78bfa', // headers
  '**': '#f97316', // bold
  '`': '#00d4aa', // inline code
  '-': '#e8b931', // lists
};

function SyntaxHighlightedCode({ text, isMarkdown = true }) {
  if (!isMarkdown) {
    // For code blocks, simple colorization
    return (
      <pre className="text-[10px] sm:text-xs text-text-secondary font-mono leading-relaxed whitespace-pre-wrap break-words">
        {text}
      </pre>
    );
  }

  // Simple markdown syntax highlighting
  const lines = text.split('\n');
  return (
    <div className="text-[10px] sm:text-xs font-mono leading-relaxed">
      {lines.map((line, idx) => {
        let color = 'text-text-secondary';
        let weight = 'font-normal';

        if (line.startsWith('#')) {
          color = 'text-accent-text';
          weight = 'font-semibold';
        } else if (line.startsWith('-') || line.match(/^\d+\./)) {
          color = 'text-text-secondary';
        } else if (line.includes('```')) {
          color = 'text-text-tertiary';
        }

        return (
          <div key={idx} className={`${color} ${weight}`}>
            {line}
          </div>
        );
      })}
    </div>
  );
}

export default function SkillPreview({ skill }) {
  const [expandedSections, setExpandedSections] = useState({
    readme: true,
    main_code: true,
    example: false,
    dependencies: false,
    tests: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (!skill) return null;

  const languageEmojis = {
    python: '🐍',
    nodejs: '⚙️',
    go: '🐹',
    rust: '🦀',
    java: '☕',
    cpp: '➕',
  };

  const emoji = languageEmojis[skill.language] || '💻';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Metadata Card */}
      <div className="card p-5 sm:p-6 space-y-3">
        <div>
          <div className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1">
            Module Name
          </div>
          <h3 className="text-base sm:text-lg font-display font-bold text-text">
            {emoji} {skill.name}
          </h3>
        </div>

        <div>
          <div className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1">
            Description
          </div>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {skill.description}
          </p>
        </div>

        <div className="pt-2 flex gap-2 flex-wrap">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium
                           bg-accent/10 text-accent-text border border-accent/20">
            {skill.language}
          </span>
          {skill.main_file && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium
                             bg-surface-alt text-text-secondary border border-border/40">
              {skill.main_file}
            </span>
          )}
          {skill.dependency_file && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium
                             bg-surface-alt text-text-secondary border border-border/40">
              {skill.dependency_file}
            </span>
          )}
        </div>

        {skill.metadata && (
          <>
            {skill.metadata.tags && (
              <div>
                <div className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">
                  Tags
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skill.metadata.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium
                                 bg-accent/10 text-accent-text border border-accent/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* README Preview */}
      {skill.readme && (
        <div className="card overflow-hidden border border-border/60">
          <button
            onClick={() => toggleSection('readme')}
            className="w-full px-5 sm:px-6 py-4 flex items-center justify-between bg-surface-alt/50 hover:bg-surface-alt/80 transition-colors"
          >
            <div className="flex items-center gap-2 text-left">
              <Code2 size={14} className="text-accent-text" />
              <span className="text-xs sm:text-sm font-semibold text-text">README.md</span>
              <span className="text-[10px] text-text-tertiary">
                ({skill.readme.length} chars)
              </span>
            </div>
            {expandedSections.readme ? (
              <ChevronUp size={14} className="text-text-tertiary" />
            ) : (
              <ChevronDown size={14} className="text-text-tertiary" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.readme && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 sm:p-5 bg-surface-alt/30 border-t border-border/40 max-h-96 overflow-y-auto">
                  <SyntaxHighlightedCode text={skill.readme} isMarkdown={true} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Main Source Code Preview */}
      {skill.main_code && (
        <div className="card overflow-hidden border border-border/60">
          <button
            onClick={() => toggleSection('main_code')}
            className="w-full px-5 sm:px-6 py-4 flex items-center justify-between bg-surface-alt/50 hover:bg-surface-alt/80 transition-colors"
          >
            <div className="flex items-center gap-2 text-left">
              <Code2 size={14} className="text-accent-text" />
              <span className="text-xs sm:text-sm font-semibold text-text">
                {skill.main_file || 'main.py'}
              </span>
              <span className="text-[10px] text-text-tertiary">
                ({skill.main_code.length} chars)
              </span>
            </div>
            {expandedSections.main_code ? (
              <ChevronUp size={14} className="text-text-tertiary" />
            ) : (
              <ChevronDown size={14} className="text-text-tertiary" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.main_code && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 sm:p-5 bg-surface-alt/30 border-t border-border/40 max-h-96 overflow-y-auto">
                  <SyntaxHighlightedCode text={skill.main_code} isMarkdown={false} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Dependencies Preview */}
      {skill.dependency_content && (
        <div className="card overflow-hidden border border-border/60">
          <button
            onClick={() => toggleSection('dependencies')}
            className="w-full px-5 sm:px-6 py-4 flex items-center justify-between bg-surface-alt/50 hover:bg-surface-alt/80 transition-colors"
          >
            <div className="flex items-center gap-2 text-left">
              <Code2 size={14} className="text-accent-text" />
              <span className="text-xs sm:text-sm font-semibold text-text">
                {skill.dependency_file || 'requirements.txt'}
              </span>
            </div>
            {expandedSections.dependencies ? (
              <ChevronUp size={14} className="text-text-tertiary" />
            ) : (
              <ChevronDown size={14} className="text-text-tertiary" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.dependencies && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 sm:p-5 bg-surface-alt/30 border-t border-border/40 max-h-96 overflow-y-auto">
                  <SyntaxHighlightedCode text={skill.dependency_content} isMarkdown={false} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Example Preview */}
      {skill.example_code && (
        <div className="card overflow-hidden border border-border/60">
          <button
            onClick={() => toggleSection('example')}
            className="w-full px-5 sm:px-6 py-4 flex items-center justify-between bg-surface-alt/50 hover:bg-surface-alt/80 transition-colors"
          >
            <div className="flex items-center gap-2 text-left">
              <Code2 size={14} className="text-accent-text" />
              <span className="text-xs sm:text-sm font-semibold text-text">
                {skill.example_file || 'example.py'} (Example)
              </span>
            </div>
            {expandedSections.example ? (
              <ChevronUp size={14} className="text-text-tertiary" />
            ) : (
              <ChevronDown size={14} className="text-text-tertiary" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.example && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 sm:p-5 bg-surface-alt/30 border-t border-border/40 max-h-96 overflow-y-auto">
                  <SyntaxHighlightedCode text={skill.example_code} isMarkdown={false} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Tests Preview (if present) */}
      {skill.test_code && (
        <div className="card overflow-hidden border border-border/60">
          <button
            onClick={() => toggleSection('tests')}
            className="w-full px-5 sm:px-6 py-4 flex items-center justify-between bg-surface-alt/50 hover:bg-surface-alt/80 transition-colors"
          >
            <div className="flex items-center gap-2 text-left">
              <Code2 size={14} className="text-accent-text" />
              <span className="text-xs sm:text-sm font-semibold text-text">
                {skill.test_file || 'test.py'} (Tests)
              </span>
            </div>
            {expandedSections.tests ? (
              <ChevronUp size={14} className="text-text-tertiary" />
            ) : (
              <ChevronDown size={14} className="text-text-tertiary" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.tests && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 sm:p-5 bg-surface-alt/30 border-t border-border/40 max-h-96 overflow-y-auto">
                  <SyntaxHighlightedCode text={skill.test_code} isMarkdown={false} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
