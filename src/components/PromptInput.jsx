import { useRef, useEffect } from 'react';
import { AlertTriangle, Pen } from 'lucide-react';
import { EXAMPLE_PROMPTS } from '../data/constants';
import { analyzePrompt, getScoreClass } from '../data/analyzer';

export default function PromptInput({ value, onChange }) {
  const ref = useRef(null);
  const analysis = analyzePrompt(value);
  const wordCount = value.split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = Math.max(140, ref.current.scrollHeight) + 'px';
    }
  }, [value]);

  return (
    <div className="card p-4 sm:p-7">
      {/* Header Row */}
      <div className="flex items-start sm:items-center justify-between mb-4 sm:mb-5 gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-accent-light border border-accent/15 shrink-0">
            <Pen size={12} className="text-accent sm:hidden" />
            <Pen size={14} className="text-accent hidden sm:block" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-semibold text-text font-body">Your Prompt</h3>
            {value.trim() && (
              <span className={`text-[10px] sm:text-[11px] font-mono px-1.5 sm:px-2 py-0.5 rounded-md mt-0.5 inline-block ${getScoreClass(analysis.score)}`}>
                {analysis.score}/100 · {analysis.grade}
              </span>
            )}
          </div>
        </div>
        <span className="text-[10px] sm:text-xs text-text-tertiary font-mono px-2 py-0.5 sm:py-1 rounded-lg bg-surface-alt border border-border/50 shrink-0">
          {wordCount} words
        </span>
      </div>

      {/* Textarea */}
      <textarea
        ref={ref}
        className="prompt-input text-[13px] sm:text-sm"
        placeholder='Paste your prompt here...'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
      />

      {/* Example Chips */}
      <div className="flex items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4 flex-wrap">
        <span className="text-[10px] sm:text-xs text-text-tertiary font-medium">Try:</span>
        {EXAMPLE_PROMPTS.map((ex) => (
          <button
            key={ex.label}
            onClick={() => onChange(ex.bad)}
            className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-body rounded-lg sm:rounded-xl
                       border border-border/60 bg-surface-alt/50
                       text-text-tertiary hover:border-accent/30 hover:bg-accent-light
                       hover:text-accent transition-all duration-200"
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* Issues */}
      {analysis.issues.length > 0 && (
        <div className="mt-4 sm:mt-6 space-y-2">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <AlertTriangle size={13} className="text-warning" />
            <span className="text-[10px] sm:text-xs font-semibold text-warning uppercase tracking-wider">
              Detected Issues
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono text-warning/60 px-1.5 sm:px-2 py-0.5 rounded-md bg-warning-light">
              {analysis.issues.length}
            </span>
          </div>
          {analysis.issues.map((item, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 sm:gap-3 px-3 sm:px-5 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm border transition-colors ${
                item.severity === 'high'
                  ? 'bg-danger-light border-danger/15'
                  : item.severity === 'medium'
                    ? 'bg-warning-light border-warning/15'
                    : 'bg-surface-alt border-border/50'
              }`}
            >
              <span
                className={`mt-1 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 ${
                  item.severity === 'high'
                    ? 'bg-danger'
                    : item.severity === 'medium'
                      ? 'bg-warning'
                      : 'bg-text-tertiary'
                }`}
              />
              <div className="min-w-0">
                <p className="text-text text-xs sm:text-[13px] leading-relaxed">{item.issue}</p>
                <p className="text-text-tertiary text-[10px] sm:text-xs mt-1 sm:mt-1.5">
                  <span className="text-accent-text font-medium">Fix:</span> {item.fix}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
