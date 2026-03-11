import { Sun, Moon, Sparkles } from 'lucide-react';

export default function Header({ dark, onToggle }) {
  return (
    <header className="mb-8 sm:mb-12 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0"
                 style={{ background: 'var(--gradient-primary)' }}>
              <Sparkles size={18} className="text-white sm:hidden" />
              <Sparkles size={20} className="text-white hidden sm:block" />
            </div>
            <span className="text-[10px] sm:text-xs font-mono font-medium tracking-widest uppercase text-text-tertiary">
              Prompt Studio
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] text-text leading-[1.15] mb-2 sm:mb-3">
            Bad Prompt{' '}
            <span className="text-text-tertiary/50 mx-0.5 sm:mx-1">→</span>{' '}
            <em className="not-italic gradient-text">Good Prompt</em>
          </h1>
          <p className="text-text-secondary text-xs sm:text-sm leading-relaxed max-w-lg">
            Paste your vague prompt, choose a framework &amp; technique, and get a
            production-ready prompt — powered by AI.
          </p>
        </div>

        <button
          onClick={onToggle}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="shrink-0 mt-1 p-2 sm:p-2.5 rounded-xl border border-border bg-surface/80
                     text-text-tertiary hover:text-accent hover:border-accent/30
                     hover:bg-accent-light hover:shadow-glow
                     backdrop-blur-sm transition-all duration-200"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
