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
        className={cn("flex items-center gap-3 flex-wrap", className)}
      >
        {/* Intent pill */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border"
          style={{
            color: primary.color,
            backgroundColor: `${primary.color}10`,
            borderColor: `${primary.color}25`,
          }}
        >
          <Sparkles size={12} />
          <span>Detected: {primary.icon} {primary.label}</span>
          {confidence >= 0.5 && (
            <span className="opacity-60">
              {Math.round(confidence * 100)}%
            </span>
          )}
        </div>

        {/* Auto-selected framework + techniques */}
        <div className="flex items-center gap-1.5 text-[11px] text-text-tertiary">
          <span className="px-2 py-0.5 rounded-md bg-surface-alt border border-border font-mono">
            {fw?.name || primary.framework}
          </span>
          <ChevronRight size={10} className="opacity-40" />
          {techNames.map((name) => (
            <span key={name} className="px-2 py-0.5 rounded-md bg-surface-alt border border-border font-mono">
              {name}
            </span>
          ))}
        </div>

        {secondary && (
          <span className="text-[11px] text-text-tertiary opacity-60">
            also: {secondary.icon} {secondary.label}
          </span>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
