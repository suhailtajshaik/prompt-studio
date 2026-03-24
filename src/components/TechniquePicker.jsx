import { Wand2, Check } from 'lucide-react';
import { TECHNIQUES } from '../data/constants';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

export default function TechniquePicker({ selected, onToggle }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent-light">
              <Wand2 size={14} className="text-accent" />
            </div>
            <CardTitle>Techniques</CardTitle>
          </div>
          <Badge variant="outline" className="font-mono text-[11px]">
            {selected.length} selected
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          {TECHNIQUES.map((tech) => {
            const isActive = selected.includes(tech.id);
            return (
              <button
                key={tech.id}
                onClick={() => onToggle(tech.id)}
                className={cn(
                  "text-left w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-150",
                  isActive
                    ? "border-accent/25 bg-accent-light"
                    : "border-border hover:border-border-focus hover:bg-surface-hover"
                )}
              >
                <span className="text-base shrink-0">{tech.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className={cn(
                    "text-[13px] font-medium block truncate",
                    isActive ? "text-accent-text" : "text-text-secondary"
                  )}>
                    {tech.name}
                  </span>
                  <span className="text-[11px] text-text-tertiary block truncate">
                    {tech.when}
                  </span>
                </div>
                {isActive && (
                  <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <Check size={12} className="text-white" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {selected.length > 0 && (
          <p className="text-xs text-text-tertiary leading-relaxed border-l-2 border-accent/20 pl-3">
            {selected
              .map((id) => TECHNIQUES.find((t) => t.id === id)?.description)
              .filter(Boolean)
              .join(' · ')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
