import { Sparkles, KeyRound, SlidersHorizontal } from 'lucide-react';
import { FRAMEWORKS } from '../data/constants';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export default function TransformButton({ onClick, disabled, loading, hasApiKey, intent, isOverridden, framework }) {
  const needsKey = !hasApiKey;

  if (needsKey) {
    return (
      <Button
        variant="secondary"
        className="w-full h-12 text-sm gap-2.5 cursor-default"
        disabled
      >
        <KeyRound size={16} />
        Add API key above to get started
      </Button>
    );
  }

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
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full h-12 text-sm gap-2.5 font-medium",
        !disabled && "shadow-accent hover:shadow-lg"
      )}
    >
      {loading ? (
        <>
          <div className="spinner" />
          <span>Optimizing your prompt...</span>
        </>
      ) : (
        <>
          {isOverridden ? <SlidersHorizontal size={16} /> : <Sparkles size={16} />}
          <span>{label}</span>
          <kbd className="ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/15 border border-white/20 hidden md:inline">
            {navigator.platform?.includes('Mac') ? '⌘' : 'Ctrl'}+Enter
          </kbd>
        </>
      )}
    </Button>
  );
}
