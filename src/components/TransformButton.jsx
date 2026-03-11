import { Zap } from 'lucide-react';

export default function TransformButton({ onClick, disabled, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center justify-center gap-2.5 sm:gap-3
        py-3.5 sm:py-4 px-6 sm:px-8 rounded-xl text-sm sm:text-base font-semibold font-body
        transition-all duration-200 relative overflow-hidden
        ${disabled
          ? 'bg-surface-alt text-text-tertiary border border-border cursor-not-allowed'
          : 'text-white shadow-accent hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]'
        }
      `}
      style={!disabled ? { background: 'var(--gradient-primary)' } : undefined}
    >
      {/* Shimmer overlay on hover */}
      {!disabled && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                         translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-1000" />
      )}
      {loading ? (
        <>
          <div className="spinner" />
          <span className="relative text-sm sm:text-base">Transforming...</span>
        </>
      ) : (
        <>
          <Zap size={16} className="relative sm:hidden" />
          <Zap size={18} className="relative hidden sm:block" />
          <span className="relative">Transform Prompt</span>
          <kbd className="relative ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/15 border border-white/20 hidden md:inline">
            Cmd+Enter
          </kbd>
        </>
      )}
    </button>
  );
}
