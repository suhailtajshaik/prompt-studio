import { Layers } from 'lucide-react';
import { FRAMEWORKS } from '../data/constants';

const FRAMEWORK_COLORS = {
  decode_intent: { bg: 'rgba(255, 107, 157, 0.08)', border: 'rgba(255, 107, 157, 0.25)', dot: '#ff6b9d' },
  costar: { bg: 'rgba(0, 184, 148, 0.08)', border: 'rgba(0, 184, 148, 0.25)', dot: '#00B894' },
  sixstep: { bg: 'rgba(243, 156, 18, 0.08)', border: 'rgba(243, 156, 18, 0.25)', dot: '#F39C12' },
  markdown: { bg: 'rgba(168, 85, 247, 0.08)', border: 'rgba(168, 85, 247, 0.25)', dot: '#A855F7' },
};

export default function FrameworkPicker({ selected, onSelect }) {
  return (
    <div>
      <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-accent-light border border-accent/15 shrink-0">
          <Layers size={13} className="text-accent sm:hidden" />
          <Layers size={14} className="text-accent hidden sm:block" />
        </div>
        <h3 className="text-xs sm:text-sm font-semibold text-text font-body">Choose Framework</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
        {Object.values(FRAMEWORKS).map((fw) => {
          const isActive = selected === fw.id;
          const colors = FRAMEWORK_COLORS[fw.id];
          return (
            <button
              key={fw.id}
              onClick={() => onSelect(fw.id)}
              className={`relative text-left p-4 sm:p-5 rounded-xl border-2 transition-all duration-200 group ${
                isActive
                  ? 'shadow-lg'
                  : 'border-border bg-surface hover:border-border-focus hover:bg-surface-hover hover:shadow-md'
              }`}
              style={isActive ? {
                borderColor: colors.border,
                background: colors.bg,
              } : undefined}
            >
              {/* Dot + Name */}
              <div className="flex items-center gap-2.5 sm:gap-3 mb-2">
                <span
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{ background: isActive ? colors.dot : 'var(--color-border)' }}
                />
                <span className="font-semibold text-sm sm:text-[15px] font-display text-text">
                  {fw.name}
                </span>
              </div>

              {/* Tagline */}
              <p className="text-[11px] sm:text-xs text-text-tertiary leading-relaxed font-body pl-[20px] sm:pl-[24px]">
                {fw.tagline}
              </p>

              {/* Field Pills */}
              <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2.5 sm:mt-3.5 pl-[20px] sm:pl-[24px]">
                {fw.fields.map((f) => (
                  <span
                    key={f.key}
                    className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-md border transition-colors"
                    style={isActive ? {
                      color: colors.dot,
                      background: colors.bg,
                      borderColor: colors.border,
                    } : {
                      color: 'var(--color-text-tertiary)',
                      background: 'var(--color-surface-alt)',
                      borderColor: 'var(--color-border)',
                    }}
                  >
                    {f.key}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
