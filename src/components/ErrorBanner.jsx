import { useState } from 'react';
import { AlertCircle, X, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';

export default function ErrorBanner({ message, details, onDismiss }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          className="rounded-2xl border border-danger/20 bg-danger-light p-4 sm:p-5"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-danger/10 flex items-center justify-center shrink-0">
              <AlertCircle size={14} className="text-danger" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-secondary leading-relaxed pt-0.5 break-words">
                {message}
              </p>
              {details && (
                <button
                  onClick={() => setShowDetails((v) => !v)}
                  className="mt-2 flex items-center gap-1.5 text-xs text-text-tertiary hover:text-text-secondary transition-colors"
                >
                  {showDetails ? <EyeOff size={12} /> : <Eye size={12} />}
                  {showDetails ? 'Hide details' : 'View details'}
                </button>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-xl text-text-tertiary hover:text-danger"
              onClick={onDismiss}
            >
              <X size={14} />
            </Button>
          </div>
          <AnimatePresence>
            {details && showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <pre className="mt-3 ml-11 text-[11px] text-text-tertiary font-mono
                              bg-surface-alt rounded-xl p-3.5 whitespace-pre-wrap break-words
                              border border-border leading-relaxed">
                  {details}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
