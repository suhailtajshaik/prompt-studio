import { useRef, useEffect } from 'react';
import { AlertTriangle, Pen } from 'lucide-react';
import { EXAMPLE_PROMPTS } from '../data/constants';
import { analyzePrompt, getScoreClass } from '../data/analyzer';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export default function PromptInput({ value, onChange, placeholder = 'Paste your prompt here...' }) {
  const ref = useRef(null);
  const analysis = analyzePrompt(value);
  const wordCount = value.split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = Math.max(140, ref.current.scrollHeight) + 'px';
    }
  }, [value]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent-light">
              <Pen size={14} className="text-accent" />
            </div>
            <div>
              <CardTitle>Your Prompt</CardTitle>
              {value.trim() && (
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md mt-1 inline-block ${getScoreClass(analysis.score)}`}>
                  {analysis.score}/100 · {analysis.grade}
                </span>
              )}
            </div>
          </div>
          <Badge variant="outline" className="font-mono text-[11px]">
            {wordCount} words
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Textarea */}
        <textarea
          ref={ref}
          className="prompt-input text-sm"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
        />

        {/* Example Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-text-tertiary font-medium">Try:</span>
          {EXAMPLE_PROMPTS.map((ex) => (
            <Button
              key={ex.label}
              variant="outline"
              size="sm"
              onClick={() => onChange(ex.bad)}
              className="text-xs h-7 px-2.5"
            >
              {ex.label}
            </Button>
          ))}
        </div>

        {/* Issues */}
        {analysis.issues.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-warning" />
              <span className="text-xs font-semibold text-warning uppercase tracking-wider">
                Issues detected
              </span>
              <Badge variant="warning" className="text-[10px] px-1.5 py-0">
                {analysis.issues.length}
              </Badge>
            </div>
            {analysis.issues.map((item, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 px-4 py-3 rounded-lg text-sm border ${
                  item.severity === 'high'
                    ? 'bg-danger-light border-danger/15'
                    : item.severity === 'medium'
                      ? 'bg-warning-light border-warning/15'
                      : 'bg-surface-alt border-border'
                }`}
              >
                <span
                  className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                    item.severity === 'high'
                      ? 'bg-danger'
                      : item.severity === 'medium'
                        ? 'bg-warning'
                        : 'bg-text-tertiary'
                  }`}
                />
                <div>
                  <p className="text-text text-[13px] leading-relaxed">{item.issue}</p>
                  <p className="text-text-tertiary text-xs mt-1">
                    <span className="text-accent-text font-medium">Fix:</span> {item.fix}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
