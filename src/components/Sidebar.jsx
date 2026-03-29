import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pen, Eye, BookOpen, Settings, Sun, Moon, Sparkles,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from './ui/tooltip';

const NAV_ITEMS = [
  { id: 'build', label: 'Build', icon: Pen, description: 'Create & transform prompts' },
  { id: 'result', label: 'Result', icon: Eye, description: 'View transformed output' },
  { id: 'learn', label: 'Learn', icon: BookOpen, description: 'Frameworks & techniques' },
  { id: 'settings', label: 'Settings', icon: Settings, description: 'API keys & preferences' },
];

export default function Sidebar({ active, onChange, hasResult, dark, onToggleTheme }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-200",
          collapsed ? "w-[60px]" : "w-[240px]",
          // Mobile: bottom bar
          "max-md:fixed max-md:bottom-0 max-md:left-0 max-md:top-auto max-md:h-auto max-md:w-full max-md:flex-row max-md:border-r-0 max-md:border-t"
        )}
      >
        {/* Logo / Brand - Desktop only */}
        <div className="hidden md:flex items-center gap-3 px-4 h-14 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <Sparkles size={16} className="text-white" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="text-sm font-semibold text-text truncate"
            >
              Prompt Studio
            </motion.span>
          )}
        </div>

        <Separator className="hidden md:block" />

        {/* Navigation */}
        <nav className={cn(
          "flex-1 py-2 px-2 space-y-1",
          // Mobile: horizontal layout
          "max-md:flex max-md:flex-row max-md:items-center max-md:justify-around max-md:space-y-0 max-md:py-1 max-md:px-1 max-md:flex-1"
        )}>
          {NAV_ITEMS.map(({ id, label, icon: Icon, description }) => {
            const isActive = active === id;
            const isDisabled = id === 'result' && !hasResult;

            const button = (
              <button
                key={id}
                onClick={() => !isDisabled && onChange(id)}
                disabled={isDisabled}
                className={cn(
                  "relative flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  // Mobile adjustments
                  "max-md:flex-col max-md:gap-1 max-md:px-2 max-md:py-1.5 max-md:text-[10px] max-md:rounded-md",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : isDisabled
                      ? "text-text-tertiary/40 cursor-not-allowed"
                      : "text-sidebar-foreground hover:bg-surface-alt hover:text-text",
                  collapsed && "justify-center md:px-0"
                )}
              >
                <Icon size={18} className={cn("shrink-0 max-md:w-5 max-md:h-5", isActive && "text-accent")} />
                {(!collapsed || window.innerWidth < 768) && (
                  <span className="truncate max-md:block">{label}</span>
                )}
                {id === 'result' && hasResult && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent pulse-dot max-md:right-1 max-md:top-1 max-md:translate-y-0" />
                )}
              </button>
            );

            if (collapsed) {
              return (
                <Tooltip key={id}>
                  <TooltipTrigger asChild>
                    {button}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="hidden md:block">
                    <p>{label}</p>
                    <p className="text-text-tertiary text-[10px]">{description}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return button;
          })}
        </nav>

        {/* Bottom actions - Desktop only */}
        <div className="hidden md:block px-2 pb-3 space-y-1">
          <Separator className="mb-2" />

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            className={cn(
              "flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-surface-alt hover:text-text transition-colors",
              collapsed && "justify-center px-0"
            )}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
            {!collapsed && <span>{dark ? 'Light mode' : 'Dark mode'}</span>}
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-surface-alt hover:text-text transition-colors",
              collapsed && "justify-center px-0"
            )}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>

        {/* Mobile theme toggle */}
        <button
          onClick={onToggleTheme}
          className="md:hidden flex flex-col items-center gap-1 px-2 py-1.5 text-[10px] text-sidebar-foreground"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
          <span>Theme</span>
        </button>
      </aside>
    </TooltipProvider>
  );
}
