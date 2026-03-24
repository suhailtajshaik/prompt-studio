import { Layers } from 'lucide-react';
import { FRAMEWORKS } from '../data/constants';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

const FRAMEWORK_COLORS = {
  decode_intent: { accent: '#E11D48', bg: 'rgba(225, 29, 72, 0.05)' },
  costar: { accent: '#059669', bg: 'rgba(5, 150, 105, 0.05)' },
  sixstep: { accent: '#D97706', bg: 'rgba(217, 119, 6, 0.05)' },
  markdown: { accent: '#7C3AED', bg: 'rgba(124, 58, 237, 0.05)' },
};

export default function FrameworkPicker({ selected, onSelect }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent-light">
            <Layers size={14} className="text-accent" />
          </div>
          <CardTitle>Framework</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.values(FRAMEWORKS).map((fw) => {
            const isActive = selected === fw.id;
            const colors = FRAMEWORK_COLORS[fw.id];
            return (
              <button
                key={fw.id}
                onClick={() => onSelect(fw.id)}
                className={cn(
                  "relative text-left w-full p-3.5 rounded-lg border transition-all duration-150",
                  isActive
                    ? "border-accent/30 shadow-sm"
                    : "border-border hover:border-border-focus hover:bg-surface-hover"
                )}
                style={isActive ? { backgroundColor: colors.bg, borderColor: `${colors.accent}40` } : undefined}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: isActive ? colors.accent : 'var(--color-border-focus)' }}
                  />
                  <span className="font-semibold text-sm text-text">{fw.name}</span>
                </div>
                <p className="text-xs text-text-tertiary leading-relaxed pl-[18px]">
                  {fw.tagline}
                </p>
                <div className="flex flex-wrap gap-1 mt-2.5 pl-[18px]">
                  {fw.fields.map((f) => (
                    <Badge
                      key={f.key}
                      variant="outline"
                      className="text-[10px] font-mono px-1.5 py-0"
                      style={isActive ? { color: colors.accent, borderColor: `${colors.accent}30` } : undefined}
                    >
                      {f.key}
                    </Badge>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
