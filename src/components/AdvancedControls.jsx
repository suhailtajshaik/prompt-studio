import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Wand2, Check, Zap, SlidersHorizontal } from 'lucide-react';
import { FRAMEWORKS, TECHNIQUES } from '../data/constants';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

const FRAMEWORK_COLORS = {
  decode_intent: { accent: '#E11D48', bg: 'rgba(225, 29, 72, 0.04)' },
  costar:        { accent: '#10B981', bg: 'rgba(16, 185, 129, 0.04)' },
  sixstep:       { accent: '#F59E0B', bg: 'rgba(245, 158, 11, 0.04)' },
  markdown:      { accent: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.04)' },
};

export default function AdvancedControls({
  framework,
  onFrameworkChange,
  techniques,
  onTechniqueToggle,
  intent,
  isOverridden,
  onResetToAuto,
  onEnterManual,
}) {
  const autoFramework  = intent?.primary?.framework  || 'costar';
  const autoTechniques = intent?.primary?.techniques || ['zero-shot'];
  const fw             = FRAMEWORKS[framework];
  const techCount      = techniques.length;

  const handleSwitchToAuto   = () => onResetToAuto();
  const handleSwitchToManual = () => onEnterManual(); // snapshot auto values → isOverridden becomes true

  return (
    <div>
      {/* ── Header bar ─────────────────────────────────────── */}
      <div
        className={cn(
          'w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200',
          isOverridden
            ? 'bg-surface border-accent/25 shadow-sm'
            : 'bg-surface border-border'
        )}
      >
        {/* Icon */}
        <div
          className={cn(
            'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200',
            isOverridden ? 'bg-accent-light text-accent' : 'bg-surface-alt text-text-tertiary'
          )}
        >
          <SlidersHorizontal size={14} />
        </div>

        {/* Label + sub-text */}
        <div className="flex-1 min-w-0 text-left">
          <p className={cn('text-sm font-medium', isOverridden ? 'text-text' : 'text-text-secondary')}>
            Advanced Prompt Settings
          </p>
          <p className="text-[11px] text-text-tertiary mt-0.5 truncate">
            {isOverridden
              ? `${fw?.name ?? 'Custom'} · ${techCount} technique${techCount !== 1 ? 's' : ''} (manual)`
              : 'Auto detected'}
          </p>
        </div>

        {/* ── Auto / Manual toggle pill ── */}
        <div
          className="flex items-center rounded-xl border border-border bg-surface-alt p-0.5 shrink-0"
          role="group"
          aria-label="Prompt mode"
        >
          {/* Auto pill */}
          <button
            type="button"
            onClick={handleSwitchToAuto}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-medium transition-all duration-200',
              !isOverridden
                ? 'bg-surface shadow-sm text-accent border border-accent/20'
                : 'text-text-tertiary hover:text-text-secondary hover:bg-surface/50'
            )}
          >
            <Zap size={11} />
            Auto
          </button>

          {/* Manual pill */}
          <button
            type="button"
            onClick={handleSwitchToManual}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-medium transition-all duration-200',
              isOverridden
                ? 'bg-surface shadow-sm text-text border border-border'
                : 'text-text-tertiary hover:text-text-secondary hover:bg-surface/50'
            )}
          >
            <SlidersHorizontal size={11} />
            Manual
          </button>
        </div>


      </div>


      {/* ── Manual mode: picker panel ────────────────────────── */}
      <AnimatePresence>
        {isOverridden && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Framework Picker */}
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Layers size={13} className="text-accent" />
                      <span className="text-xs font-semibold text-text uppercase tracking-wider">Framework</span>
                    </div>
                    <div className="space-y-1.5">
                      {Object.values(FRAMEWORKS).map((f) => {
                        const isActive = framework === f.id;
                        const colors   = FRAMEWORK_COLORS[f.id];
                        const wasAuto  = f.id === autoFramework;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => onFrameworkChange(f.id)}
                            className={cn(
                              'relative text-left w-full p-3 rounded-xl border transition-all duration-200',
                              isActive
                                ? 'shadow-sm'
                                : 'border-border hover:border-border-focus hover:bg-surface-hover'
                            )}
                            style={isActive ? { backgroundColor: colors.bg, borderColor: `${colors.accent}35` } : undefined}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ background: isActive ? colors.accent : 'var(--color-border-focus)' }}
                              />
                              <span className="font-semibold text-[13px] text-text">{f.name}</span>
                              {wasAuto && (
                                <Badge variant="outline" className="text-[9px] px-1 py-0 ml-auto rounded-lg">
                                  was auto
                                </Badge>
                              )}
                            </div>
                            <p className="text-[11px] text-text-tertiary leading-relaxed pl-[18px]">
                              {f.tagline}
                            </p>
                            {f.fields.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2 pl-[18px]">
                                {f.fields.map((field) => (
                                  <Badge
                                    key={field.key}
                                    variant="outline"
                                    className="text-[9px] font-mono px-1 py-0 rounded-md"
                                    style={isActive ? { color: colors.accent, borderColor: `${colors.accent}30` } : undefined}
                                  >
                                    {field.key}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Technique Picker */}
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Wand2 size={13} className="text-accent" />
                        <span className="text-xs font-semibold text-text uppercase tracking-wider">Techniques</span>
                      </div>
                      <Badge variant="outline" className="font-mono text-[10px] rounded-lg">
                        {techniques.length} selected
                      </Badge>
                    </div>
                    <div className="space-y-1.5">
                      {TECHNIQUES.map((tech) => {
                        const isActive   = techniques.includes(tech.id);
                        const wasAutoTch = autoTechniques.includes(tech.id);
                        return (
                          <button
                            key={tech.id}
                            type="button"
                            onClick={() => onTechniqueToggle(tech.id)}
                            className={cn(
                              'text-left w-full flex items-center gap-2.5 p-2.5 rounded-xl border transition-all duration-200',
                              isActive
                                ? 'border-accent/25 bg-accent-light'
                                : 'border-border hover:border-border-focus hover:bg-surface-hover'
                            )}
                          >
                            <span className="text-sm shrink-0">{tech.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={cn(
                                    'text-[12px] font-medium truncate',
                                    isActive ? 'text-accent-text' : 'text-text-secondary'
                                  )}
                                >
                                  {tech.name}
                                </span>
                                {wasAutoTch && (
                                  <Badge variant="outline" className="text-[9px] px-1 py-0 rounded-md">
                                    was auto
                                  </Badge>
                                )}
                              </div>
                              <span className="text-[10px] text-text-tertiary block truncate">{tech.when}</span>
                            </div>
                            {isActive && (
                              <span className="w-5 h-5 rounded-lg bg-accent flex items-center justify-center shrink-0">
                                <Check size={10} className="text-white" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {techniques.length > 0 && (
                      <p className="text-[11px] text-text-tertiary leading-relaxed border-l-2 border-accent/20 pl-3 mt-3">
                        {techniques
                          .map((id) => TECHNIQUES.find((t) => t.id === id)?.description)
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    )}
                  </CardContent>
                </Card>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
