import { useState } from 'react';
import { Copy, Check, Download, Sparkles, TrendingUp, FileText, BarChart3, RotateCcw } from 'lucide-react';
import { FRAMEWORKS, TECHNIQUES } from '../data/constants';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

export default function ResultView({ result, badPrompt, frameworkId, techniqueIds, intent, onNewPrompt }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const fw = FRAMEWORKS[frameworkId];
  const isDecodeIntent = fw?.isSpecialWorkflow === true;
  const techNames = (techniqueIds || [])
    .map((id) => TECHNIQUES.find((t) => t.id === id)?.name)
    .filter(Boolean);

  const decodeIntentParts = isDecodeIntent ? parseDecodeIntentOutput(result) : null;

  function parseDecodeIntentOutput(text) {
    const decodedIntentMatch = text.match(/DECODED_INTENT:\s*(.+?)(?=\n\nINTENT:|$)/s);
    const intentMatch = text.match(/INTENT:\s*(.+?)(?=\n\nREWRITTEN_PROMPT:|$)/s);
    const rewrittenMatch = text.match(/REWRITTEN_PROMPT:\s*([\s\S]+?)$/);
    return {
      decodedIntent: decodedIntentMatch ? decodedIntentMatch[1].trim() : '',
      intent: intentMatch ? intentMatch[1].trim() : '',
      rewrittenPrompt: rewrittenMatch ? rewrittenMatch[1].trim() : '',
    };
  }

  const handleCopy = async (textToCopy, index) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch {
      const el = document.createElement('textarea');
      el.value = textToCopy;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleDownload = () => {
    const text = isDecodeIntent && decodeIntentParts ? decodeIntentParts.rewrittenPrompt : result;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized-prompt.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const badWordCount = badPrompt.split(/\s+/).filter(Boolean).length;
  const goodWordCount = result.split(/\s+/).filter(Boolean).length;
  const improvement = Math.round(((goodWordCount - badWordCount) / Math.max(badWordCount, 1)) * 100);

  const CopyButton = ({ text, index }) => (
    <Button
      variant={copiedIndex === index ? 'outline' : 'default'}
      size="sm"
      onClick={() => handleCopy(text, index)}
      className="h-7 text-xs gap-1.5"
    >
      {copiedIndex === index ? <Check size={12} /> : <Copy size={12} />}
      {copiedIndex === index ? 'Copied' : 'Copy'}
    </Button>
  );

  // Decode Intent result layout
  if (isDecodeIntent && decodeIntentParts) {
    return (
      <div className="space-y-4 pt-4">
        <Separator />

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent-light">
                <Sparkles size={14} className="text-accent" />
              </div>
              <div>
                <CardTitle>Intent Decoded</CardTitle>
                <p className="text-xs text-text-tertiary mt-0.5">
                  Your prompt analyzed and decoded into 3 clear outputs.
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {[
          { title: 'Decoded Intent', content: decodeIntentParts.decodedIntent, idx: 0 },
          { title: 'Intent Category', content: decodeIntentParts.intent, idx: 1 },
          { title: 'Rewritten Prompt', content: decodeIntentParts.rewrittenPrompt, idx: 2 },
        ].map(({ title, content, idx }) => (
          <Card key={idx}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>{title}</CardTitle>
                <CopyButton text={content} index={idx} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="code-output p-4 text-[13px] rounded-lg max-h-[300px] overflow-y-auto">
                {content}
              </div>
            </CardContent>
          </Card>
        ))}

        <Button variant="outline" className="w-full gap-2" onClick={onNewPrompt}>
          <RotateCcw size={14} />
          Start New Prompt
        </Button>
      </div>
    );
  }

  // Standard result layout
  return (
    <div className="space-y-4 pt-4">
      <Separator />

      {/* Optimized Prompt Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Sparkles size={14} className="text-white" />
              </div>
              <div>
                <CardTitle>Optimized Prompt</CardTitle>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  {intent?.primary && (
                    <Badge
                      className="text-[10px]"
                      style={{
                        backgroundColor: `${intent.primary.color}15`,
                        color: intent.primary.color,
                        borderColor: `${intent.primary.color}30`,
                      }}
                    >
                      {intent.primary.icon} {intent.primary.label}
                    </Badge>
                  )}
                  {fw && <Badge variant="outline" className="text-[10px]">{fw.name}</Badge>}
                  {techNames.map((name) => (
                    <Badge key={name} variant="outline" className="text-[10px]">{name}</Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload} className="h-7 text-xs gap-1.5">
                <Download size={12} />
                .txt
              </Button>
              <CopyButton text={result} index={0} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="code-output p-4 max-h-[400px] overflow-y-auto text-[13px]">
            {result}
          </div>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: FileText, label: 'Original', value: badWordCount, unit: 'words', color: 'text-danger' },
          { icon: Sparkles, label: 'Optimized', value: goodWordCount, unit: 'words', color: 'text-success' },
          { icon: TrendingUp, label: 'Expansion', value: `+${improvement}%`, unit: 'richer', color: 'text-accent' },
        ].map(({ icon: Icon, label, value, unit, color }) => (
          <Card key={label} className="text-center">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Icon size={12} className={color} />
                <span className="text-[10px] text-text-tertiary uppercase tracking-wider font-mono">{label}</span>
              </div>
              <div className={`text-xl font-bold ${color}`}>{value}</div>
              <div className="text-[10px] text-text-tertiary mt-0.5">{unit}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Before vs After */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2.5">
            <BarChart3 size={14} className="text-accent" />
            <CardTitle className="text-sm">Before vs After</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-danger font-mono mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-danger" />
                Before
              </div>
              <div className="p-3 rounded-lg bg-danger-light border border-danger/15 font-mono text-xs text-text-secondary leading-relaxed break-words">
                {badPrompt}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-accent-text font-mono mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                After
              </div>
              <div className="p-3 rounded-lg bg-accent-light border border-accent/15 font-mono text-xs text-accent-text leading-relaxed max-h-[180px] overflow-y-auto break-words">
                {result.slice(0, 500)}{result.length > 500 ? '...' : ''}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full gap-2" onClick={onNewPrompt}>
        <RotateCcw size={14} />
        Start New Prompt
      </Button>
    </div>
  );
}
