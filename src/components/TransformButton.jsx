import { Zap, KeyRound, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export default function TransformButton({ onClick, disabled, loading, hasApiKey, intent }) {
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
          <Sparkles size={16} />
          <span>
            {intentLabel
              ? `Optimize for ${intentLabel}`
              : 'Optimize Prompt'
            }
          </span>
          <kbd className="ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/15 border border-white/20 hidden md:inline">
            {navigator.platform?.includes('Mac') ? '⌘' : 'Ctrl'}+Enter
          </kbd>
        </>
      )}
    </Button>
  );
}
