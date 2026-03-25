import { Sparkles, Sun, Moon, Settings, BookOpen, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from './ui/tooltip';

const NAV_ITEMS = [
  { id: 'studio', label: 'Studio', icon: Wand2 },
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Navbar({ active, onChange, dark, onToggleTheme }) {
  return (
    <TooltipProvider delayDuration={0}>
      <nav className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <button
              onClick={() => onChange('studio')}
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-text hidden sm:inline">
                Prompt Studio
              </span>
            </button>

            {/* Center nav */}
            <div className="flex items-center gap-1 bg-surface-alt rounded-lg p-1 border border-border/50">
              {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                const isActive = active === id;
                return (
                  <button
                    key={id}
                    onClick={() => onChange(id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-surface text-text shadow-sm border border-border/60"
                        : "text-text-tertiary hover:text-text-secondary"
                    )}
                  >
                    <Icon size={15} className={cn(isActive && "text-accent")} />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right actions */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleTheme}
                  className="h-8 w-8 text-text-tertiary hover:text-text"
                >
                  {dark ? <Sun size={16} /> : <Moon size={16} />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {dark ? 'Light mode' : 'Dark mode'}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </nav>
    </TooltipProvider>
  );
}
