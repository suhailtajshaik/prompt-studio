import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ArrowLeft, Download, Sparkles, TrendingUp, FileText, BarChart3 } from 'lucide-react';
import { FRAMEWORKS, TECHNIQUES } from '../data/constants';

export default function ResultView({ result, badPrompt, frameworkId, techniqueIds, onBack }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const fw = FRAMEWORKS[frameworkId];
  const isDecodeIntent = fw?.isSpecialWorkflow === true;
  const techNames = techniqueIds
    .map((id) => TECHNIQUES.find((t) => t.id === id)?.name)
    .filter(Boolean);

  // Parse Decode Intent output into 3 parts
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
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'decode-intent-result.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const badWordCount = badPrompt.split(/\s+/).filter(Boolean).length;
  const goodWordCount = result.split(/\s+/).filter(Boolean).length;
  const improvement = Math.round(((goodWordCount - badWordCount) / Math.max(badWordCount, 1)) * 100);

  if (isDecodeIntent && decodeIntentParts) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-4 sm:space-y-6"
      >
        {/* Decode Intent Header */}
        <div className="card p-4 sm:p-7">
          <div className="flex items-center gap-2.5 sm:gap-3 mb-4">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0"
                 style={{ background: fw.color }}>
              <Sparkles size={13} className="text-white sm:hidden" />
              <Sparkles size={14} className="text-white hidden sm:block" />
            </div>
            <h3 className="text-xs sm:text-sm font-semibold gradient-text font-display tracking-wide">
              Intent Decoded
            </h3>
          </div>
          <div className="text-[11px] sm:text-xs text-text-tertiary">
            Your unclear prompt analyzed and decoded into 3 clear, copyable outputs.
          </div>
        </div>

        {/* 3 Output Cards - Stacked Vertically */}
        <div className="space-y-3 sm:space-y-4">
          {/* 1. Decoded Intent */}
          <div className="card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h4 className="text-xs sm:text-sm font-semibold text-text font-display">
                Decoded Intent
              </h4>
              <button
                onClick={() => handleCopy(decodeIntentParts.decodedIntent, 0)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold
                           border transition-all duration-200 ${
                             copiedIndex === 0
                               ? 'bg-success-light border-success/25 text-success'
                               : 'text-white border-transparent'
                           }`}
                style={copiedIndex !== 0 ? { background: fw.color } : undefined}
              >
                {copiedIndex === 0 ? <Check size={11} /> : <Copy size={11} />}
                {copiedIndex === 0 ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="code-output p-3 sm:p-4 text-xs sm:text-[13px] rounded-lg">
              {decodeIntentParts.decodedIntent}
            </div>
          </div>

          {/* 2. Intent Category */}
          <div className="card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h4 className="text-xs sm:text-sm font-semibold text-text font-display">
                Intent Category
              </h4>
              <button
                onClick={() => handleCopy(decodeIntentParts.intent, 1)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold
                           border transition-all duration-200 ${
                             copiedIndex === 1
                               ? 'bg-success-light border-success/25 text-success'
                               : 'text-white border-transparent'
                           }`}
                style={copiedIndex !== 1 ? { background: fw.color } : undefined}
              >
                {copiedIndex === 1 ? <Check size={11} /> : <Copy size={11} />}
                {copiedIndex === 1 ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="code-output p-3 sm:p-4 text-xs sm:text-[13px] rounded-lg font-semibold">
              {decodeIntentParts.intent}
            </div>
          </div>

          {/* 3. Rewritten Prompt */}
          <div className="card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h4 className="text-xs sm:text-sm font-semibold text-text font-display">
                Rewritten Prompt
              </h4>
              <button
                onClick={() => handleCopy(decodeIntentParts.rewrittenPrompt, 2)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold
                           border transition-all duration-200 ${
                             copiedIndex === 2
                               ? 'bg-success-light border-success/25 text-success'
                               : 'text-white border-transparent'
                           }`}
                style={copiedIndex !== 2 ? { background: fw.color } : undefined}
              >
                {copiedIndex === 2 ? <Check size={11} /> : <Copy size={11} />}
                {copiedIndex === 2 ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="code-output p-3 sm:p-4 max-h-[300px] sm:max-h-[400px] overflow-y-auto text-xs sm:text-[13px] rounded-lg">
              {decodeIntentParts.rewrittenPrompt}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-full flex items-center justify-center gap-2 py-3 sm:py-4 rounded-xl
                     text-xs sm:text-sm font-body font-medium text-text-secondary
                     border border-border bg-surface hover:bg-surface-hover
                     hover:border-border-focus hover:shadow-sm transition-all duration-200"
        >
          <ArrowLeft size={14} />
          Back to Editor
        </button>
      </motion.div>
    );
  }

  // Original workflow rendering
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Improved Prompt Card */}
      <div className="card p-4 sm:p-7">
        <div className="flex flex-col gap-4 mb-5 sm:mb-6">
          <div>
            <div className="flex items-center gap-2.5 sm:gap-3 mb-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0"
                   style={{ background: 'var(--gradient-primary)' }}>
                <Sparkles size={13} className="text-white sm:hidden" />
                <Sparkles size={14} className="text-white hidden sm:block" />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold gradient-text font-display tracking-wide">
                Improved Prompt
              </h3>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 flex-wrap pl-[38px] sm:pl-11">
              <span className="text-[10px] sm:text-[11px] font-mono px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border text-accent-text bg-accent-light border-accent/20">
                {fw.name}
              </span>
              {techNames.map((name) => (
                <span
                  key={name}
                  className="text-[10px] sm:text-[11px] font-mono px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border bg-surface-alt text-text-tertiary border-border/60"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-body font-medium
                         border border-border bg-surface text-text-secondary
                         hover:bg-surface-hover hover:border-border-focus hover:shadow-sm transition-all duration-200"
            >
              <Download size={12} />
              .txt
            </button>
            <button
              onClick={() => handleCopy(result, 0)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-body font-semibold
                         border transition-all duration-200 ${
                           copiedIndex === 0
                             ? 'bg-success-light border-success/25 text-success shadow-sm'
                             : 'text-white border-transparent shadow-accent hover:shadow-lg'
                         }`}
              style={copiedIndex !== 0 ? { background: 'var(--gradient-primary)' } : undefined}
            >
              {copiedIndex === 0 ? <Check size={12} /> : <Copy size={12} />}
              {copiedIndex === 0 ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="code-output p-4 sm:p-6 max-h-[360px] sm:max-h-[480px] overflow-y-auto text-xs sm:text-[13px]">
          {result}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3.5">
        <div className="card p-3 sm:p-5 text-center group hover:scale-[1.02] transition-transform">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
            <FileText size={11} className="text-danger sm:hidden" />
            <FileText size={13} className="text-danger hidden sm:block" />
            <span className="text-[9px] sm:text-[11px] text-text-tertiary uppercase tracking-wider font-mono">
              Original
            </span>
          </div>
          <div className="text-lg sm:text-2xl font-bold font-display text-danger">
            {badWordCount}
          </div>
          <div className="text-[9px] sm:text-[11px] text-text-tertiary mt-0.5">words</div>
        </div>
        <div className="card p-3 sm:p-5 text-center group hover:scale-[1.02] transition-transform">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
            <Sparkles size={11} className="text-success sm:hidden" />
            <Sparkles size={13} className="text-success hidden sm:block" />
            <span className="text-[9px] sm:text-[11px] text-text-tertiary uppercase tracking-wider font-mono">
              Improved
            </span>
          </div>
          <div className="text-lg sm:text-2xl font-bold font-display text-success">
            {goodWordCount}
          </div>
          <div className="text-[9px] sm:text-[11px] text-text-tertiary mt-0.5">words</div>
        </div>
        <div className="card p-3 sm:p-5 text-center group hover:scale-[1.02] transition-transform">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
            <TrendingUp size={11} className="text-warning sm:hidden" />
            <TrendingUp size={13} className="text-warning hidden sm:block" />
            <span className="text-[9px] sm:text-[11px] text-text-tertiary uppercase tracking-wider font-mono">
              Expansion
            </span>
          </div>
          <div className="text-lg sm:text-2xl font-bold font-display gradient-text">
            +{improvement}%
          </div>
          <div className="text-[9px] sm:text-[11px] text-text-tertiary mt-0.5">richer</div>
        </div>
      </div>

      {/* Before / After */}
      <div className="card p-4 sm:p-7">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-accent-light border border-accent/15 shrink-0">
            <BarChart3 size={13} className="text-accent sm:hidden" />
            <BarChart3 size={14} className="text-accent hidden sm:block" />
          </div>
          <h3 className="text-xs sm:text-sm font-semibold text-text font-body">
            Before vs After
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
          <div>
            <div className="text-[10px] sm:text-[11px] uppercase tracking-[2px] sm:tracking-[3px] text-danger font-mono mb-2 sm:mb-2.5 flex items-center gap-1.5 sm:gap-2">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-danger" />
              Before
            </div>
            <div className="p-3.5 sm:p-5 rounded-xl bg-danger-light border border-danger/15 font-mono text-xs sm:text-[13px] text-text-secondary leading-relaxed break-words">
              {badPrompt}
            </div>
          </div>
          <div>
            <div className="text-[10px] sm:text-[11px] uppercase tracking-[2px] sm:tracking-[3px] text-accent-text font-mono mb-2 sm:mb-2.5 flex items-center gap-1.5 sm:gap-2">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ background: 'var(--gradient-primary)' }} />
              After
            </div>
            <div className="p-3.5 sm:p-5 rounded-xl bg-accent-light border border-accent/15 font-mono text-xs sm:text-[13px] text-accent-text leading-relaxed max-h-[160px] sm:max-h-[200px] overflow-y-auto break-words">
              {result.slice(0, 500)}{result.length > 500 ? '...' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="w-full flex items-center justify-center gap-2 py-3 sm:py-4 rounded-xl
                   text-xs sm:text-sm font-body font-medium text-text-secondary
                   border border-border bg-surface hover:bg-surface-hover
                   hover:border-border-focus hover:shadow-sm transition-all duration-200"
      >
        <ArrowLeft size={14} />
        Back to Editor
      </button>
    </motion.div>
  );
}
