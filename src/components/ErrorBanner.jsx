import { AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ErrorBanner({ message, onDismiss }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          className="rounded-xl border border-danger/20 bg-danger-light p-3.5 sm:p-5 flex items-start gap-2.5 sm:gap-3.5
                     shadow-sm"
        >
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-danger/10 flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle size={12} className="text-danger sm:hidden" />
            <AlertCircle size={14} className="text-danger hidden sm:block" />
          </div>
          <p className="text-xs sm:text-sm text-text-secondary font-body flex-1 leading-relaxed pt-0.5 sm:pt-1 break-words">{message}</p>
          <button
            onClick={onDismiss}
            className="p-1 sm:p-1.5 rounded-lg text-text-tertiary hover:text-danger hover:bg-danger-light transition-all shrink-0"
          >
            <X size={13} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
