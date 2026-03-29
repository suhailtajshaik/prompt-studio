import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const messages = [
  'Analyzing your prompt...',
  'Detecting intent & context...',
  'Applying framework structure...',
  'Enhancing with techniques...',
  'Polishing the output...',
];

export default function TransformingOverlay() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/70 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-6 p-8 sm:p-10 rounded-3xl
                   bg-surface border border-border shadow-xl max-w-sm w-[90%] text-center"
      >
        {/* Icon + spinner ring */}
        <div className="relative flex items-center justify-center w-20 h-20">
          {/* Outer spinning arc ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent 75%, var(--color-accent) 100%)',
              padding: '2px',
              borderRadius: '9999px',
            }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{ background: 'var(--color-surface)' }}
            />
          </motion.div>

          {/* Slow counter-spin faint ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            className="absolute rounded-full"
            style={{
              inset: 4,
              background: 'conic-gradient(from 180deg, transparent 60%, var(--color-accent) 100%)',
              opacity: 0.25,
              borderRadius: '9999px',
            }}
          />

          {/* Static centered icon — does NOT rotate */}
          <div
            className="relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: 'var(--gradient-accent)' }}
          >
            {/* Subtle pulse glow behind icon */}
            <motion.div
              animate={{ scale: [1, 1.35], opacity: [0.35, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 rounded-2xl"
              style={{ background: 'var(--gradient-accent)' }}
            />
            <Sparkles size={20} className="text-white relative" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-text">
            Transforming your prompt
          </h3>
          <div className="h-5 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={msgIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="text-sm text-text-secondary"
              >
                {messages[msgIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 rounded-full bg-surface-alt overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--gradient-accent)' }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 15, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
