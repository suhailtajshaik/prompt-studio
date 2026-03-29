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
        {/* Animated orbs */}
        <div className="relative w-20 h-20">
          {/* Center icon */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-accent"
              style={{ background: 'var(--gradient-accent)' }}
            >
              <Sparkles size={22} className="text-white" />
            </div>
          </motion.div>

          {/* Orbiting dots */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 w-2.5 h-2.5 -ml-1.25 -mt-1.25 rounded-full bg-accent"
              style={{ opacity: 0.3 + i * 0.2 }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 2.5 + i * 0.5,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.3,
              }}
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-accent"
                style={{
                  transform: `translateX(${28 + i * 6}px)`,
                }}
              />
            </motion.div>
          ))}

          {/* Pulse ring */}
          <motion.div
            animate={{ scale: [1, 1.8], opacity: [0.2, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            className="absolute inset-0 rounded-2xl border-2 border-accent"
          />
        </div>

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
                className="text-sm text-text-tertiary"
              >
                {messages[msgIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full bg-surface-alt overflow-hidden">
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
