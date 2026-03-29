import { Sparkles, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { FRAMEWORKS } from '../data/constants';
import { cn } from '@/lib/utils';

export default function TransformButton({ onClick, disabled, loading, hasApiKey, intent, isOverridden, framework }) {
  if (!hasApiKey) return null;

  const intentLabel = intent?.primary?.label;
  const fw = FRAMEWORKS[framework];

  let label;
  if (isOverridden && fw) {
    label = `Optimize with ${fw.name}`;
  } else if (intentLabel) {
    label = `Optimize for ${intentLabel}`;
  } else {
    label = 'Optimize Prompt';
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.01, y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={cn(
        "relative w-full h-12 sm:h-14 rounded-2xl text-sm sm:text-base font-semibold",
        "flex items-center justify-center gap-2.5 overflow-hidden",
        "text-white transition-all duration-300",
        disabled
          ? "opacity-40 cursor-not-allowed bg-accent"
          : "cursor-pointer shadow-accent hover:shadow-lg"
      )}
      style={!disabled ? { background: 'var(--gradient-accent)' } : undefined}
    >
      {/* Shimmer overlay on hover */}
      {!disabled && !loading && (
        <motion.div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
          }}
          animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {loading ? (
        <span className="flex items-center gap-2.5">
          <div className="spinner" />
          <span>Optimizing your prompt...</span>
        </span>
      ) : (
        <span className="relative flex items-center gap-2">
          {isOverridden ? <SlidersHorizontal size={16} /> : <Sparkles size={16} />}
          <span>{label}</span>
          <ArrowRight size={14} className="opacity-60" />
          <kbd className="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white/15 border border-white/20 hidden md:inline">
            {navigator.platform?.includes('Mac') ? '⌘' : 'Ctrl'}+Enter
          </kbd>
        </span>
      )}
    </motion.button>
  );
}
