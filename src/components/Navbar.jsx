import { Sparkles, Sun, Moon, Settings, BookOpen, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const NAV_ITEMS = [
  { id: 'studio', label: 'Studio', icon: Wand2 },
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Navbar({ active, onChange, dark, onToggleTheme }) {
  return (
    <>
      {/* Top bar - logo + theme toggle */}
      <nav className="sticky top-0 z-40 border-b border-border/60 bg-surface-glass backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <button
              onClick={() => onChange('studio')}
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                   style={{ background: 'var(--gradient-accent)' }}>
                <Sparkles size={14} className="text-white" />
              </div>
              <span className="text-sm font-bold text-text tracking-tight">
                Prompt Studio
              </span>
            </button>

            {/* Desktop nav - hidden on mobile */}
            <div className="hidden sm:flex items-center gap-0.5 bg-surface-alt/80 rounded-xl p-1 border border-border/50">
              {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                const isActive = active === id;
                return (
                  <button
                    key={id}
                    onClick={() => onChange(id)}
                    className={cn(
                      "relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "text-text"
                        : "text-text-tertiary hover:text-text-secondary"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-surface rounded-lg shadow-sm border border-border/60"
                        transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      <Icon size={14} className={cn(isActive && "text-accent")} />
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleTheme}
              className="h-9 w-9 rounded-xl text-text-tertiary hover:text-text hover:bg-surface-alt"
            >
              <motion.div
                key={dark ? 'sun' : 'moon'}
                initial={{ scale: 0.5, rotate: -90, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.5, rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </motion.div>
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-surface-glass backdrop-blur-xl safe-area-bottom">
        <div className="flex items-center justify-around h-14 px-2">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all duration-200 min-w-[64px]",
                  isActive
                    ? "text-accent"
                    : "text-text-tertiary"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-pill"
                    className="absolute inset-0 bg-accent-light rounded-xl"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                  />
                )}
                <Icon size={18} className="relative" />
                <span className="relative text-[10px] font-semibold">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
