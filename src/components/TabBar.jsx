import { Wrench, Eye, BookOpen, Settings } from 'lucide-react';

const TABS = [
  { id: 'build', label: 'Build', icon: Wrench },
  { id: 'result', label: 'Result', icon: Eye },
  { id: 'learn', label: 'Frameworks', shortLabel: 'Learn', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function TabBar({ active, onChange, hasResult }) {
  return (
    <nav className="flex gap-1 sm:gap-1.5 p-1 sm:p-1.5 mb-6 sm:mb-10 rounded-xl sm:rounded-2xl bg-surface-alt/60 border border-border/50 backdrop-blur-sm overflow-x-auto">
      {TABS.map(({ id, label, shortLabel, icon: Icon }) => {
        const isActive = active === id;
        const isDisabled = id === 'result' && !hasResult;

        return (
          <button
            key={id}
            onClick={() => !isDisabled && onChange(id)}
            disabled={isDisabled}
            className={`
              relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5
              text-xs sm:text-sm font-body font-medium
              rounded-lg sm:rounded-xl transition-all duration-200 flex-1 justify-center
              whitespace-nowrap min-w-0
              ${isActive
                ? 'bg-surface text-text shadow-md border border-border/60'
                : isDisabled
                  ? 'text-text-tertiary/30 cursor-not-allowed'
                  : 'text-text-tertiary hover:text-text-secondary hover:bg-surface/40'
              }
            `}
          >
            <Icon size={14} className={`shrink-0 ${isActive ? 'text-accent' : ''}`} />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{shortLabel || label}</span>
            {id === 'result' && hasResult && (
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 pulse-dot"
                    style={{ background: 'var(--gradient-primary)' }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}
