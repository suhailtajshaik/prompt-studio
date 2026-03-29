import { useRef, useEffect, useCallback } from 'react';
import { AlertTriangle, Mic, MicOff, Upload, X, FileText, Sparkles, ArrowUp, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EXAMPLE_PROMPTS } from '../data/constants';
import { analyzePrompt, getScoreClass } from '../data/analyzer';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { useFileUpload } from '../hooks/useFileUpload';
import IntentBadge from './IntentBadge';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

export default function PromptInput({ value, onChange, intent, placeholder, onSubmit, canSubmit, hasApiKey }) {
  const ref = useRef(null);
  const analysis = analyzePrompt(value);
  const wordCount = value.split(/\s+/).filter(Boolean).length;

  // Speech-to-text
  const existingTextRef = useRef('');
  const handleSpeechResult = useCallback((transcript) => {
    const base = existingTextRef.current;
    const separator = base && !base.endsWith(' ') ? ' ' : '';
    onChange(base + separator + transcript);
  }, [onChange]);

  const { listening, supported: speechSupported, toggle: toggleSpeechRaw } = useSpeechToText(handleSpeechResult);
  const toggleSpeech = useCallback(() => {
    if (!listening) {
      existingTextRef.current = value;
    }
    toggleSpeechRaw();
  }, [listening, value, toggleSpeechRaw]);

  // File upload
  const handleFileText = useCallback((text, fileName) => {
    onChange((prev) => {
      const prefix = prev ? prev + '\n\n--- Content from ' + fileName + ' ---\n\n' : '';
      return prefix + text;
    });
  }, [onChange]);

  const {
    fileName, error: fileError, inputRef: fileInputRef,
    openFilePicker, handleFileChange, handleDrop, clearFile,
  } = useFileUpload(handleFileText);

  // Auto-resize textarea
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = Math.max(140, ref.current.scrollHeight) + 'px';
    }
  }, [value]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="space-y-3">
      {/* Main input card */}
      <div
        className={cn(
          "relative rounded-2xl border bg-surface overflow-hidden transition-all duration-300",
          "shadow-sm hover:shadow-md",
          listening
            ? "border-red-400/40 ring-2 ring-red-400/20"
            : "border-border hover:border-border-focus gradient-border float-glow"
        )}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Textarea */}
        <textarea
          ref={ref}
          className="w-full min-h-[140px] bg-transparent text-[14px] sm:text-sm text-text
                     placeholder:text-text-tertiary/50 placeholder:font-body
                     font-mono leading-relaxed resize-none outline-none
                     px-4 sm:px-6 pt-5 pb-3 border-none"
          placeholder={placeholder || "Describe what you need in plain language...\n\ne.g. \"Write a professional email to decline a meeting\"\n     \"Help me analyze sales data from last quarter\""}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
        />

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between gap-2 px-3 sm:px-5 py-2.5 border-t border-border/40 bg-surface-alt/30">
          <div className="flex items-center gap-1.5">
            {/* File upload */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".txt,.md,.csv,.json,.pdf,.docx,.js,.py,.ts,.jsx,.tsx,.html,.css,.xml,.yaml,.yml"
              onChange={handleFileChange}
            />
            <button
              onClick={openFilePicker}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                         text-text-tertiary hover:text-accent hover:bg-accent-light transition-all duration-150"
            >
              <Upload size={13} />
              <span className="hidden sm:inline">Upload</span>
            </button>

            {/* Speech-to-text */}
            {speechSupported && (
              <button
                onClick={toggleSpeech}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150",
                  listening
                    ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                    : "text-text-tertiary hover:text-accent hover:bg-accent-light"
                )}
              >
                {listening ? <MicOff size={13} /> : <Mic size={13} />}
                <span className="hidden sm:inline">
                  {listening ? 'Stop' : 'Speak'}
                </span>
              </button>
            )}

            {/* Clear / Reset */}
            {value.trim() && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => { onChange(''); clearFile(); }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                           text-text-tertiary hover:text-danger hover:bg-danger-light transition-all duration-150"
                title="Clear prompt"
              >
                <RotateCcw size={13} />
                <span className="hidden sm:inline">Clear</span>
              </motion.button>
            )}

            {/* File attachment indicator */}
            <AnimatePresence>
              {fileName && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent-light border border-accent/15 text-xs text-accent-text font-medium"
                >
                  <FileText size={11} />
                  <span className="max-w-[100px] sm:max-w-[120px] truncate">{fileName}</span>
                  <button onClick={clearFile} className="hover:text-danger transition-colors">
                    <X size={11} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Score indicator - always visible when there's text */}
            <AnimatePresence>
              {value.trim() && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-lg whitespace-nowrap ${getScoreClass(analysis.score)}`}
                >
                  {analysis.score}/100
                </motion.span>
              )}
            </AnimatePresence>

            <Badge variant="outline" className="font-mono text-[11px] rounded-lg whitespace-nowrap hidden sm:inline-flex">
              {wordCount} words
            </Badge>

            {/* Submit / Send button - always present */}
            <motion.button
              onClick={canSubmit && hasApiKey ? onSubmit : undefined}
              disabled={!value.trim() || !canSubmit || !hasApiKey}
              whileHover={canSubmit && hasApiKey && value.trim() ? { scale: 1.08 } : {}}
              whileTap={canSubmit && hasApiKey && value.trim() ? { scale: 0.9 } : {}}
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0",
                value.trim() && canSubmit && hasApiKey
                  ? "text-white cursor-pointer shadow-sm hover:shadow-md"
                  : value.trim() && !hasApiKey
                    ? "bg-warning/15 text-warning cursor-not-allowed border border-warning/25"
                    : "bg-surface-alt text-text-tertiary/30 cursor-not-allowed"
              )}
              style={value.trim() && canSubmit && hasApiKey ? { background: 'var(--gradient-accent)' } : undefined}
              title={!value.trim() ? 'Type a prompt first' : !hasApiKey ? 'Add an API key first' : 'Optimize prompt'}
            >
              <ArrowUp size={16} strokeWidth={2.5} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* File upload error */}
      <AnimatePresence>
        {fileError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-danger bg-danger-light border border-danger/15 rounded-xl px-4 py-2.5"
          >
            {fileError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Listening indicator */}
      <AnimatePresence>
        {listening && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800/30 text-xs text-red-600 dark:text-red-400"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Listening... speak naturally, your words will appear above
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto-detected intent */}
      <IntentBadge intent={intent} />

      {/* Example chips - only show when empty */}
      {!value.trim() && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-2.5"
        >
          <span className="text-xs text-text-tertiary font-medium flex items-center gap-1.5">
            <Sparkles size={11} />
            Try an example
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {EXAMPLE_PROMPTS.map((ex) => (
              <button
                key={ex.label}
                onClick={() => onChange(ex.bad)}
                className="group text-left px-3.5 py-2.5 rounded-xl border border-border bg-surface
                           hover:border-accent/30 hover:bg-accent-light/50 hover:shadow-sm
                           transition-all duration-200"
              >
                <span className="text-xs font-semibold text-text group-hover:text-accent transition-colors">
                  {ex.label}
                </span>
                <p className="text-[11px] text-text-tertiary mt-0.5 line-clamp-1">
                  {ex.bad}
                </p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Issues */}
      {value.trim() && analysis.issues.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={12} className="text-warning" />
            <span className="text-[11px] font-semibold text-warning uppercase tracking-wider">
              {analysis.issues.length} issue{analysis.issues.length > 1 ? 's' : ''} detected
            </span>
            <span className="text-[11px] text-text-tertiary">
              — auto-fixed during optimization
            </span>
          </div>
          <div className="grid gap-1.5">
            {analysis.issues.slice(0, 3).map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 px-3.5 py-2 rounded-xl text-xs border bg-surface-alt/50 border-border"
              >
                <span
                  className={cn(
                    "mt-1.5 w-1.5 h-1.5 rounded-full shrink-0",
                    item.severity === 'high' ? 'bg-danger' :
                    item.severity === 'medium' ? 'bg-warning' : 'bg-text-tertiary'
                  )}
                />
                <span className="text-text-secondary">{item.issue}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
