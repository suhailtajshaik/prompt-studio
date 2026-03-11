import { useState } from 'react';
import { AlertCircle, X, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ErrorBanner({ message, details, onDismiss }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          className="rounded-xl border border-danger/20 bg-danger-light p-3.5 sm:p-5 shadow-sm"
        >
          <div className="flex items-start gap-2.5 sm:gap-3.5">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-danger/10 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle size={12} className="text-danger sm:hidden" />
              <AlertCircle size={14} className="text-danger hidden sm:block" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-text-secondary font-body leading-relaxed pt-0.5 sm:pt-1 break-words">
                {message}
              </p>
              {details && (
                <button
                  onClick={() => setShowDetails((v) => !v)}
                  className="mt-2 flex items-center gap-1.5 text-[11px] sm:text-xs text-text-tertiary
                             hover:text-text-secondary transition-colors font-body"
                >
                  {showDetails ? <EyeOff size={12} /> : <Eye size={12} />}
                  {showDetails ? 'Hide details' : 'View details'}
                </button>
              )}
            </div>
            <button
              onClick={onDismiss}
              className="p-1 sm:p-1.5 rounded-lg text-text-tertiary hover:text-danger hover:bg-danger-light transition-all shrink-0"
            >
              <X size={13} />
            </button>
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
                <pre className="mt-3 ml-8 sm:ml-10 text-[10px] sm:text-[11px] text-text-tertiary font-mono
                              bg-surface-alt/50 rounded-lg p-2.5 sm:p-3 whitespace-pre-wrap break-words
                              border border-border/50 leading-relaxed">
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
