import { useState } from 'react';
import { Copy, Check, Download, Sparkles, TrendingUp, FileText, BarChart3, RotateCcw, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { FRAMEWORKS, TECHNIQUES } from '../data/constants';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

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
      className="h-8 text-xs gap-1.5 rounded-xl"
    >
      {copiedIndex === index ? <Check size={12} /> : <Copy size={12} />}
      {copiedIndex === index ? 'Copied!' : 'Copy'}
    </Button>
  );

  // Decode Intent result layout
  if (isDecodeIntent && decodeIntentParts) {
    return (
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4 pt-4">
        <Separator />

        <motion.div variants={fadeUp}>
          <Card className="border-accent/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                     style={{ background: 'var(--gradient-accent)' }}>
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Intent Decoded</CardTitle>
                  <p className="text-xs text-text-tertiary mt-0.5">
                    Your prompt analyzed and decoded into 3 clear outputs
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {[
          { title: 'Decoded Intent', content: decodeIntentParts.decodedIntent, idx: 0 },
          { title: 'Intent Category', content: decodeIntentParts.intent, idx: 1 },
          { title: 'Rewritten Prompt', content: decodeIntentParts.rewrittenPrompt, idx: 2 },
        ].map(({ title, content, idx }) => (
          <motion.div key={idx} variants={fadeUp}>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>{title}</CardTitle>
                  <CopyButton text={content} index={idx} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="code-output p-4 text-[13px] rounded-xl max-h-[300px] overflow-y-auto">
                  {content}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        <motion.div variants={fadeUp}>
          <Button variant="outline" className="w-full gap-2 h-11 rounded-2xl" onClick={onNewPrompt}>
            <RotateCcw size={14} />
            Start New Prompt
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  // Standard result layout
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4 pt-4">
      <Separator />

      {/* Optimized Prompt Card */}
      <motion.div variants={fadeUp}>
        <Card className="border-accent/20 overflow-hidden">
          {/* Gradient top accent line */}
          <div className="h-1" style={{ background: 'var(--gradient-accent)' }} />
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                     style={{ background: 'var(--gradient-accent)' }}>
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Optimized Prompt</CardTitle>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    {intent?.primary && (
                      <Badge
                        className="text-[10px] rounded-lg"
                        style={{
                          backgroundColor: `${intent.primary.color}12`,
                          color: intent.primary.color,
                          borderColor: `${intent.primary.color}25`,
                        }}
                      >
                        {intent.primary.icon} {intent.primary.label}
                      </Badge>
                    )}
                    {fw && <Badge variant="outline" className="text-[10px] rounded-lg">{fw.name}</Badge>}
                    {techNames.map((name) => (
                      <Badge key={name} variant="outline" className="text-[10px] rounded-lg">{name}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Button variant="outline" size="sm" onClick={handleDownload} className="h-8 text-xs gap-1.5 rounded-xl">
                  <Download size={12} />
                  <span className="hidden sm:inline">.txt</span>
                </Button>
                <CopyButton text={result} index={0} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="code-output p-4 sm:p-5 max-h-[400px] overflow-y-auto text-[13px] rounded-xl">
              {result}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { icon: FileText, label: 'Original', value: badWordCount, unit: 'words', color: 'text-danger' },
          { icon: Sparkles, label: 'Optimized', value: goodWordCount, unit: 'words', color: 'text-success' },
          { icon: TrendingUp, label: 'Expansion', value: `+${improvement}%`, unit: 'richer', color: 'text-accent' },
        ].map(({ icon: Icon, label, value, unit, color }) => (
          <Card key={label} className="text-center">
            <CardContent className="pt-4 pb-3 px-2 sm:px-5">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Icon size={11} className={color} />
                <span className="text-[9px] sm:text-[10px] text-text-tertiary uppercase tracking-wider font-mono">{label}</span>
              </div>
              <div className={`text-lg sm:text-xl font-bold ${color}`}>{value}</div>
              <div className="text-[9px] sm:text-[10px] text-text-tertiary mt-0.5">{unit}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Before vs After */}
      <motion.div variants={fadeUp}>
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
                <div className="text-[10px] uppercase tracking-widest text-danger font-mono mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-danger" />
                  Before
                </div>
                <div className="p-3.5 rounded-xl bg-danger-light border border-danger/15 font-mono text-xs text-text-secondary leading-relaxed break-words">
                  {badPrompt}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-accent-text font-mono mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  After
                </div>
                <div className="p-3.5 rounded-xl bg-accent-light border border-accent/15 font-mono text-xs text-accent-text leading-relaxed max-h-[180px] overflow-y-auto break-words">
                  {result.slice(0, 500)}{result.length > 500 ? '...' : ''}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Button variant="outline" className="w-full gap-2 h-11 rounded-2xl" onClick={onNewPrompt}>
          <RotateCcw size={14} />
          Start New Prompt
        </Button>
      </motion.div>
    </motion.div>
  );
}
