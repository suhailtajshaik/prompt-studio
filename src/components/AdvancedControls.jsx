import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, Layers, Wand2, Check, RotateCcw } from 'lucide-react';
import { FRAMEWORKS, TECHNIQUES } from '../data/constants';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const FRAMEWORK_COLORS = {
  decode_intent: { accent: '#E11D48', bg: 'rgba(225, 29, 72, 0.04)' },
  costar: { accent: '#10B981', bg: 'rgba(16, 185, 129, 0.04)' },
  sixstep: { accent: '#F59E0B', bg: 'rgba(245, 158, 11, 0.04)' },
  markdown: { accent: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.04)' },
};

export default function AdvancedControls({
  framework,
  onFrameworkChange,
  techniques,
  onTechniqueToggle,
  intent,
  isOverridden,
  onResetToAuto,
}) {
  const [open, setOpen] = useState(false);

  const autoFramework = intent?.primary?.framework || 'costar';
  const autoTechniques = intent?.primary?.techniques || ['zero-shot'];

  const fw = FRAMEWORKS[framework];
  const techCount = techniques.length;

  return (
    <div>
      {/* Toggle button — card-style bar */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200",
          "hover:shadow-sm active:scale-[0.995]",
          open
            ? "bg-surface border-accent/25 shadow-sm"
            : "bg-surface border-border hover:border-border-focus"
        )}
      >
        <div className={cn(
          "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200",
          open || isOverridden ? "bg-accent-light text-accent" : "bg-surface-alt text-text-tertiary"
        )}>
          <SlidersHorizontal size={14} />
        </div>

        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-sm font-medium transition-colors",
              open ? "text-text" : "text-text-secondary"
            )}>
              Advanced Settings
            </span>
            {isOverridden && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-accent/30 text-accent-text rounded-lg">
                Manual
              </Badge>
            )}
          </div>
          {!open && (
            <p className="text-[11px] text-text-tertiary mt-0.5 truncate">
              {fw?.name || 'Auto'} framework · {techCount} technique{techCount !== 1 ? 's' : ''}
              {isOverridden ? ' (custom)' : ' (auto-detected)'}
            </p>
          )}
        </div>

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-text-tertiary shrink-0"
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>

      {/* Collapsible panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-4">
              {/* Reset to auto button */}
              {isOverridden && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-light/50 border border-accent/10"
                >
                  <span className="text-xs text-text-secondary flex-1">
                    Manual mode. Auto-detected: <span className="font-mono text-accent-text">{FRAMEWORKS[autoFramework]?.name}</span>
                    {' + '}
                    {autoTechniques.map((id) => TECHNIQUES.find((t) => t.id === id)?.name).filter(Boolean).join(', ')}
                  </span>
                  <Button variant="outline" size="sm" onClick={onResetToAuto} className="h-7 text-[11px] gap-1.5 shrink-0 rounded-lg">
                    <RotateCcw size={10} />
                    Reset to Auto
                  </Button>
                </motion.div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Framework Picker */}
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Layers size={13} className="text-accent" />
                      <span className="text-xs font-semibold text-text uppercase tracking-wider">Framework</span>
                    </div>
                    <div className="space-y-1.5">
                      {Object.values(FRAMEWORKS).map((fw) => {
                        const isActive = framework === fw.id;
                        const colors = FRAMEWORK_COLORS[fw.id];
                        const isAutoSelected = fw.id === autoFramework && !isOverridden;
                        return (
                          <button
                            key={fw.id}
                            onClick={() => onFrameworkChange(fw.id)}
                            className={cn(
                              "relative text-left w-full p-3 rounded-xl border transition-all duration-200",
                              isActive
                                ? "shadow-sm"
                                : "border-border hover:border-border-focus hover:bg-surface-hover"
                            )}
                            style={isActive ? { backgroundColor: colors.bg, borderColor: `${colors.accent}35` } : undefined}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ background: isActive ? colors.accent : 'var(--color-border-focus)' }}
                              />
                              <span className="font-semibold text-[13px] text-text">{fw.name}</span>
                              {isAutoSelected && (
                                <Badge variant="outline" className="text-[9px] px-1 py-0 ml-auto rounded-lg">auto</Badge>
                              )}
                            </div>
                            <p className="text-[11px] text-text-tertiary leading-relaxed pl-[18px]">
                              {fw.tagline}
                            </p>
                            {fw.fields.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2 pl-[18px]">
                                {fw.fields.map((f) => (
                                  <Badge
                                    key={f.key}
                                    variant="outline"
                                    className="text-[9px] font-mono px-1 py-0 rounded-md"
                                    style={isActive ? { color: colors.accent, borderColor: `${colors.accent}30` } : undefined}
                                  >
                                    {f.key}
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
                        const isActive = techniques.includes(tech.id);
                        const isAutoSelected = autoTechniques.includes(tech.id) && !isOverridden;
                        return (
                          <button
                            key={tech.id}
                            onClick={() => onTechniqueToggle(tech.id)}
                            className={cn(
                              "text-left w-full flex items-center gap-2.5 p-2.5 rounded-xl border transition-all duration-200",
                              isActive
                                ? "border-accent/25 bg-accent-light"
                                : "border-border hover:border-border-focus hover:bg-surface-hover"
                            )}
                          >
                            <span className="text-sm shrink-0">{tech.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className={cn(
                                  "text-[12px] font-medium truncate",
                                  isActive ? "text-accent-text" : "text-text-secondary"
                                )}>
                                  {tech.name}
                                </span>
                                {isAutoSelected && (
                                  <Badge variant="outline" className="text-[9px] px-1 py-0 rounded-md">auto</Badge>
                                )}
                              </div>
                              <span className="text-[10px] text-text-tertiary block truncate">
                                {tech.when}
                              </span>
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
