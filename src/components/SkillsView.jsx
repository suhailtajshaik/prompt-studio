import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Download, Copy, Check, Code2 } from 'lucide-react';
import PromptInput from './PromptInput';
import ErrorBanner from './ErrorBanner';
import SkillPreview from './SkillPreview';
import SmartClarifications from './SmartClarifications';
import { useSkillGenerator } from '../hooks/useSkillGenerator';
import { useSmartClarifications } from '../hooks/useSmartClarifications';
import { buildClarificationContext } from '../data/smartClarifications';
import { downloadZip, downloadMd } from '../utils/skillDownloader';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const LANGUAGES = [
  { id: 'python', label: 'Python', icon: '🐍' },
  { id: 'nodejs', label: 'Node.js/TypeScript', icon: '⚙️' },
  { id: 'go', label: 'Go', icon: '🐹' },
  { id: 'rust', label: 'Rust', icon: '🦀' },
  { id: 'java', label: 'Java', icon: '☕' },
  { id: 'cpp', label: 'C++', icon: '➕' },
];

export default function SkillsView({ apiKeys, provider, model }) {
  const [language, setLanguage] = useState('python');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(null); // 'zip', 'md', or null

  const { skill, loading, error, generate, reset } = useSkillGenerator();
  const { answers, answerQuestion, clearAnswers } = useSmartClarifications();

  const handleGenerate = async () => {
    if (!input.trim()) return;
    const clarificationContext = buildClarificationContext(answers);
    await generate(input, language, provider, model, apiKeys[provider], clarificationContext);
  };

  const handleDownloadZip = async () => {
    if (!skill) return;
    await downloadZip(skill);
    setCopied('zip');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownloadMd = async () => {
    if (!skill) return;
    await downloadMd(skill);
    setCopied('md');
    setTimeout(() => setCopied(null), 2000);
  };

  const canGenerate = input.trim() && !loading && !!apiKeys[provider];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-light border border-accent/20 text-xs font-medium text-accent-text">
          <Wand2 size={14} />
          Skills Generator
        </div>
        <h2 className="text-lg sm:text-xl font-display font-bold text-text">
          Build <span className="text-text-tertiary">AI Agent Skills</span>
        </h2>
        <p className="text-xs text-text-tertiary max-w-md mx-auto">
          Select a language, describe your skill, and get a complete, self-contained module in your chosen language.
        </p>
      </div>

      {/* Language Selector */}
      <div>
        <label className="block text-xs font-semibold text-text-secondary mb-3">
          <Code2 className="inline mr-1" size={14} />
          Select Language
        </label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {LANGUAGES.map((lang) => (
            <motion.button
              key={lang.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLanguage(lang.id)}
              className={`
                relative py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium
                transition-all duration-200 flex flex-col items-center gap-1
                ${language === lang.id
                  ? 'bg-accent text-white shadow-lg shadow-accent/30 border border-accent'
                  : 'bg-surface-alt border border-border hover:border-accent/50 text-text-secondary'
                }
              `}
            >
              <span className="text-lg">{lang.icon}</span>
              <span className="hidden sm:inline">{lang.label}</span>
              <span className="sm:hidden text-xs">{lang.label.split('/')[0]}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div>
        <label className="block text-xs font-semibold text-text-secondary mb-2">
          Describe your skill
        </label>
        <PromptInput
          value={input}
          onChange={setInput}
          placeholder="e.g., A CLI tool for batch image processing, a module to manage API rate limiting, a data validation library..."
        />
      </div>

      {/* Error */}
      <ErrorBanner message={error?.message} details={error?.details} onDismiss={reset} />

      {/* Smart Clarifications */}
      <AnimatePresence>
        {input.trim() && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <SmartClarifications
              description={input}
              answers={answers}
              onAnswer={answerQuestion}
              onClear={clearAnswers}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generate button */}
      <motion.button
        whileHover={canGenerate ? { scale: 1.01 } : {}}
        whileTap={canGenerate ? { scale: 0.98 } : {}}
        onClick={handleGenerate}
        disabled={!canGenerate}
        className={`
          relative w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl
          text-sm sm:text-base font-display font-semibold
          transition-all duration-200 overflow-hidden
          ${canGenerate
            ? 'text-white shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30'
            : 'bg-surface-alt text-text-tertiary/50 cursor-not-allowed border border-border/40'
          }
        `}
        style={canGenerate ? { background: 'var(--gradient-primary)' } : undefined}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <span className="spinner w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
              Generating skill...
            </>
          ) : (
            <>
              <Wand2 size={16} />
              Generate Skill
            </>
          )}
        </span>
      </motion.button>

      {/* Preview & Download */}
      <AnimatePresence>
        {skill && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            {/* Preview */}
            <SkillPreview skill={skill} />

            {/* Download buttons */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownloadZip}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                           bg-accent/10 border border-accent/30 hover:bg-accent/15 hover:border-accent/50
                           text-accent-text font-semibold text-sm transition-all"
              >
                {copied === 'zip' ? (
                  <>
                    <Check size={16} />
                    Downloaded!
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span className="hidden sm:inline">.zip</span>
                    <span className="sm:hidden">ZIP</span>
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownloadMd}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                           bg-accent/10 border border-accent/30 hover:bg-accent/15 hover:border-accent/50
                           text-accent-text font-semibold text-sm transition-all"
              >
                {copied === 'md' ? (
                  <>
                    <Check size={16} />
                    Downloaded!
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span className="hidden sm:inline">.md</span>
                    <span className="sm:hidden">MD</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
