import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const messages = [
  'Analyzing your prompt…',
  'Applying framework structure…',
  'Enhancing with techniques…',
  'Polishing the output…',
];

export default function TransformingOverlay() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-6 p-8 sm:p-10 rounded-2xl
                   bg-surface border border-border shadow-xl max-w-sm w-[90%] text-center"
      >
        {/* Animated icon */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <Sparkles size={24} className="text-white" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full"
            style={{ background: 'var(--gradient-primary)' }}
          />
        </div>

        {/* Cycling status messages */}
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-semibold font-heading text-text-primary">
            Transforming your prompt
          </h3>
          <div className="h-5 overflow-hidden">
            <motion.p
              key={msgIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-text-secondary font-body"
            >
              {messages[msgIndex]}
            </motion.p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full bg-surface-alt overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--gradient-primary)' }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 12, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
