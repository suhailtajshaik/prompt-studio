import { useRef, useEffect, useCallback } from 'react';
import { AlertTriangle, Mic, MicOff, Upload, X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EXAMPLE_PROMPTS } from '../data/constants';
import { analyzePrompt, getScoreClass } from '../data/analyzer';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { useFileUpload } from '../hooks/useFileUpload';
import IntentBadge from './IntentBadge';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export default function PromptInput({ value, onChange, intent, placeholder }) {
  const ref = useRef(null);
  const dropZoneRef = useRef(null);
  const analysis = analyzePrompt(value);
  const wordCount = value.split(/\s+/).filter(Boolean).length;

  // Speech-to-text
  const handleSpeechResult = useCallback((transcript, isInterim) => {
    onChange(transcript);
  }, [onChange]);

  const { listening, supported: speechSupported, toggle: toggleSpeech } = useSpeechToText(handleSpeechResult);

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
      ref.current.style.height = Math.max(160, ref.current.scrollHeight) + 'px';
    }
  }, [value]);

  // Drag & drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="space-y-3">
      {/* Main input card */}
      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-200",
          listening && "ring-2 ring-red-400/40 border-red-400/30"
        )}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <CardContent className="p-0">
          {/* Textarea */}
          <textarea
            ref={ref}
            className="w-full min-h-[160px] bg-transparent text-sm text-text
                       placeholder:text-text-tertiary/50 placeholder:font-body
                       font-mono leading-relaxed resize-none outline-none
                       px-5 pt-5 pb-3 border-none"
            placeholder={placeholder || "Describe what you need in plain language...\n\nExamples:\n  \"Write me a professional email to decline a meeting\"\n  \"Help me analyze sales data from last quarter\"\n  \"Create a Python script to rename files in bulk\""}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
          />

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-t border-border/50 bg-surface-alt/30">
            <div className="flex items-center gap-2">
              {/* File upload */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".txt,.md,.csv,.json,.pdf,.docx,.js,.py,.ts,.jsx,.tsx,.html,.css,.xml,.yaml,.yml"
                onChange={handleFileChange}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={openFilePicker}
                className="h-7 px-2 text-text-tertiary hover:text-accent gap-1.5 text-xs"
              >
                <Upload size={13} />
                <span className="hidden sm:inline">Upload</span>
              </Button>

              {/* Speech-to-text */}
              {speechSupported && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSpeech}
                  className={cn(
                    "h-7 px-2 gap-1.5 text-xs",
                    listening
                      ? "text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20"
                      : "text-text-tertiary hover:text-accent"
                  )}
                >
                  {listening ? <MicOff size={13} /> : <Mic size={13} />}
                  <span className="hidden sm:inline">
                    {listening ? 'Stop' : 'Speak'}
                  </span>
                </Button>
              )}

              {/* File attachment indicator */}
              <AnimatePresence>
                {fileName && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent-light border border-accent/15 text-xs text-accent-text"
                  >
                    <FileText size={11} />
                    <span className="max-w-[120px] truncate">{fileName}</span>
                    <button onClick={clearFile} className="hover:text-danger transition-colors">
                      <X size={11} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3">
              {/* Score badge */}
              {value.trim() && (
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${getScoreClass(analysis.score)}`}>
                  {analysis.score}/100
                </span>
              )}
              <Badge variant="outline" className="font-mono text-[11px]">
                {wordCount} words
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File upload error */}
      <AnimatePresence>
        {fileError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-danger bg-danger-light border border-danger/15 rounded-lg px-3 py-2"
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
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800/30 text-xs text-red-600 dark:text-red-400"
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
      )}

      {/* Issues - collapsible */}
      {value.trim() && analysis.issues.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle size={13} className="text-warning" />
            <span className="text-[11px] font-semibold text-warning uppercase tracking-wider">
              {analysis.issues.length} issue{analysis.issues.length > 1 ? 's' : ''} detected
            </span>
            <span className="text-[11px] text-text-tertiary">
              — will be auto-fixed during optimization
            </span>
          </div>
          <div className="grid gap-1.5">
            {analysis.issues.slice(0, 3).map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 px-3 py-2 rounded-lg text-xs border bg-surface-alt/50 border-border"
              >
                <span
                  className={cn(
                    "mt-1 w-1.5 h-1.5 rounded-full shrink-0",
                    item.severity === 'high' ? 'bg-danger' :
                    item.severity === 'medium' ? 'bg-warning' : 'bg-text-tertiary'
                  )}
                />
                <span className="text-text-secondary">{item.issue}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
