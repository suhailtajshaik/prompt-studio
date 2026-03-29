import { Sparkles, Sun, Moon, Wand2, BookOpen, Palette, Settings, Key, ChevronRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const WORKSPACE_ITEMS = [
  { id: 'studio', label: 'Studio',   icon: Wand2 },
  { id: 'learn',  label: 'Learn',    icon: BookOpen },
];

const SETTINGS_ITEMS = [
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'settings',   label: 'API Keys',  icon: Key },
];

function NavItem({ id, label, icon: Icon, active, onChange, accentColor }) {
  const isActive = active === id;
  return (
    <button
      onClick={() => onChange(id)}
      className={cn(
        "relative w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 group",
        isActive
          ? "text-text"
          : "text-text-secondary hover:text-text hover:bg-surface-alt/60"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-pill"
          className="absolute inset-0 bg-surface rounded-xl border border-border/60"
          style={{ boxShadow: `0 0 0 1px ${accentColor}18, 0 1px 3px ${accentColor}10` }}
          transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
        />
      )}
      <Icon
        size={16}
        className="relative shrink-0"
        style={isActive ? { color: accentColor } : {}}
      />
      <span className="relative">{label}</span>
    </button>
  );
}

export default function Navbar({ active, onChange, dark, onToggleTheme, currentTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const accentColor = currentTheme?.colors?.acc || 'var(--color-accent)';
  const gradStart   = currentTheme?.colors?.grad?.[0] || accentColor;
  const gradEnd     = currentTheme?.colors?.grad?.[1] || accentColor;

  const handleNav = (id) => {
    onChange(id);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 pt-5 pb-4">
        <button
          onClick={() => handleNav('studio')}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${gradStart}, ${gradEnd})` }}
          >
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="text-sm font-bold text-text tracking-tight">
            Prompt Studio
          </span>
        </button>
      </div>

      {/* Nav sections */}
      <div className="flex-1 px-3 space-y-6 overflow-y-auto">
        {/* Workspace */}
        <div>
          <div className="px-3 mb-2">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.1em]">
              Workspace
            </span>
          </div>
          <div className="space-y-0.5">
            {WORKSPACE_ITEMS.map((item) => (
              <NavItem
                key={item.id}
                {...item}
                active={active}
                onChange={handleNav}
                accentColor={accentColor}
              />
            ))}
          </div>
        </div>

        {/* Settings */}
        <div>
          <div className="px-3 mb-2">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.1em]">
              Settings
            </span>
          </div>
          <div className="space-y-0.5">
            {SETTINGS_ITEMS.map((item) => (
              <NavItem
                key={item.id}
                {...item}
                active={active}
                onChange={handleNav}
                accentColor={accentColor}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Theme toggle footer */}
      <div className="px-3 pb-4 pt-2 border-t border-border/40 mt-auto">
        <button
          onClick={onToggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-text-secondary hover:text-text hover:bg-surface-alt/60 transition-all duration-200"
        >
          <motion.div
            key={dark ? 'sun' : 'moon'}
            initial={{ scale: 0.5, rotate: -90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </motion.div>
          <span>{dark ? 'Light mode' : 'Dark mode'}</span>
          {currentTheme && (
            <span
              className="ml-auto flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-md"
              style={{
                background: currentTheme.colors.accLight,
                color: currentTheme.colors.acc,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: currentTheme.colors.acc }}
              />
              {currentTheme.name}
            </span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-56 border-r border-border/60 bg-bg flex-col z-40">
        {sidebarContent}
      </aside>

      {/* Mobile top bar */}
      <nav className="md:hidden sticky top-0 z-40 border-b border-border/60 bg-surface-glass backdrop-blur-xl">
        <div className="flex items-center justify-between h-14 px-4">
          <button
            onClick={() => handleNav('studio')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${gradStart}, ${gradEnd})` }}
            >
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="text-sm font-bold text-text tracking-tight">Prompt Studio</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              className="h-9 w-9 rounded-xl flex items-center justify-center text-text-secondary hover:text-text hover:bg-surface-alt transition-all"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="h-9 w-9 rounded-xl flex items-center justify-center text-text-secondary hover:text-text hover:bg-surface-alt transition-all"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile slide-out panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', bounce: 0.1, duration: 0.4 }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-64 bg-bg border-r border-border/60 z-50 flex flex-col"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
