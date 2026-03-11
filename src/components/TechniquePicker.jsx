import { Wand2 } from 'lucide-react';
import { TECHNIQUES } from '../data/constants';

export default function TechniquePicker({ selected, onToggle }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 sm:mb-5 gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-accent-light border border-accent/15 shrink-0">
            <Wand2 size={13} className="text-accent sm:hidden" />
            <Wand2 size={14} className="text-accent hidden sm:block" />
          </div>
          <h3 className="text-xs sm:text-sm font-semibold text-text font-body">
            Prompting Techniques
          </h3>
        </div>
        <span className="text-[10px] sm:text-xs text-text-tertiary font-mono px-2 py-0.5 sm:py-1 rounded-lg bg-surface-alt border border-border/50 shrink-0">
          {selected.length} selected
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
        {TECHNIQUES.map((tech) => {
          const isActive = selected.includes(tech.id);
          return (
            <button
              key={tech.id}
              onClick={() => onToggle(tech.id)}
              className={`text-left p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 group ${
                isActive
                  ? 'border-accent/40 bg-accent-light shadow-sm'
                  : 'border-border/60 bg-surface hover:border-border-focus hover:bg-surface-hover'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-base sm:text-lg transition-transform duration-200 group-hover:scale-110 shrink-0">
                  {tech.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <span
                    className={`text-xs sm:text-[13px] font-medium font-body block truncate transition-colors ${
                      isActive ? 'text-accent-text' : 'text-text-secondary'
                    }`}
                  >
                    {tech.name}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-text-tertiary font-body block truncate">
                    {tech.when}
                  </span>
                </div>
                {isActive && (
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: 'var(--gradient-primary)' }}>
                    <svg width="8" height="6" viewBox="0 0 10 8" fill="none" className="sm:hidden">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className="hidden sm:block">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Techniques Description */}
      {selected.length > 0 && (
        <p className="text-[10px] sm:text-xs text-text-tertiary mt-3 sm:mt-4 leading-relaxed border-l-2 border-accent/20 ml-1 pl-3">
          {selected
            .map((id) => TECHNIQUES.find((t) => t.id === id)?.description)
            .filter(Boolean)
            .join(' · ')}
        </p>
      )}
    </div>
  );
}
