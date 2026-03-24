import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const messages = [
  'Analyzing your prompt...',
  'Applying framework structure...',
  'Enhancing with techniques...',
  'Polishing the output...',
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
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 4 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-5 p-8 rounded-xl
                   bg-surface border border-border shadow-lg max-w-sm w-[90%] text-center"
      >
        {/* Animated icon */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 rounded-full bg-accent flex items-center justify-center"
          >
            <Sparkles size={20} className="text-white" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-accent"
          />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-semibold text-text">
            Transforming your prompt
          </h3>
          <div className="h-5 overflow-hidden">
            <motion.p
              key={msgIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="text-sm text-text-tertiary"
            >
              {messages[msgIndex]}
            </motion.p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 rounded-full bg-surface-alt overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 12, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
