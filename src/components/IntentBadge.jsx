import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronRight } from 'lucide-react';
import { FRAMEWORKS, TECHNIQUES } from '../data/constants';
import { cn } from '@/lib/utils';

export default function IntentBadge({ intent, className }) {
  if (!intent) return null;

  const { primary, secondary, confidence } = intent;
  const fw = FRAMEWORKS[primary.framework];
  const techNames = primary.techniques
    .map((id) => TECHNIQUES.find((t) => t.id === id)?.name)
    .filter(Boolean);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={primary.id}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
        className={cn("flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-wrap", className)}
      >
        {/* Intent pill */}
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium border w-fit"
          style={{
            color: primary.color,
            backgroundColor: `${primary.color}0C`,
            borderColor: `${primary.color}20`,
          }}
        >
          <Sparkles size={11} />
          <span>Detected: {primary.icon} {primary.label}</span>
          {confidence >= 0.5 && (
            <span className="opacity-50 font-mono text-[10px]">
              {Math.round(confidence * 100)}%
            </span>
          )}
        </div>

        {/* Auto-selected framework + techniques */}
        <div className="flex items-center gap-1.5 text-[11px] text-text-tertiary flex-wrap">
          <span className="px-2 py-0.5 rounded-lg bg-surface-alt border border-border font-mono">
            {fw?.name || primary.framework}
          </span>
          <ChevronRight size={10} className="opacity-30" />
          {techNames.map((name) => (
            <span key={name} className="px-2 py-0.5 rounded-lg bg-surface-alt border border-border font-mono">
              {name}
            </span>
          ))}
        </div>

        {secondary && (
          <span className="text-[11px] text-text-tertiary opacity-50">
            also: {secondary.icon} {secondary.label}
          </span>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
