import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

function ClarificationCard({
  card,
  selected,
  onSelect,
  onClear,
}) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <motion.div variants={itemVariants} className="space-y-2 sm:space-y-3">
      {/* Card Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-xs sm:text-sm font-semibold text-text">
            {card.question}
          </h4>
          {card.description && (
            <p className="text-[10px] sm:text-xs text-text-tertiary mt-0.5">
              {card.description}
            </p>
          )}
        </div>
        {selected && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onClear(card.id)}
            className="flex-shrink-0 p-1 hover:bg-surface-alt rounded transition-colors"
            title="Clear selection"
          >
            <X size={14} className="text-text-tertiary hover:text-text" />
          </motion.button>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2">
        {card.options.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(card.id, option.id)}
            className={`
              relative w-full p-3 sm:p-4 rounded-lg border-2 transition-all duration-200
              text-left group flex items-start gap-3
              ${
                selected === option.id
                  ? 'border-accent bg-accent/10'
                  : 'border-border hover:border-accent/50 hover:bg-surface-alt'
              }
            `}
          >
            {/* Radio button or selection indicator */}
            <div className={`
              flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center mt-0.5
              transition-all
              ${selected === option.id ? 'bg-accent border-accent text-white' : 'border-border'}
            `}>
              {selected === option.id && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-semibold text-xs sm:text-sm text-text">
                {option.label}
              </div>
              {option.description && (
                <div className="text-[10px] sm:text-xs text-text-secondary mt-1">
                  {option.description}
                </div>
              )}
            </div>

            {/* Icon if provided */}
            {option.icon && (
              <span className="text-base sm:text-lg flex-shrink-0">
                {option.icon}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

export default function IdeaClarificationCards({
  cards,
  selections,
  onSelect,
  onClear,
}) {
  const hasAnySelection = Object.keys(selections).length > 0;

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-text-secondary">No clarification cards generated.</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Cards */}
      {cards.map((card) => (
        <ClarificationCard
          key={card.id}
          card={card}
          selected={selections[card.id] || null}
          onSelect={onSelect}
          onClear={onClear}
        />
      ))}

      {/* Info Box */}
      <div className="bg-surface-alt/50 border border-border/40 rounded-lg p-3 sm:p-4">
        <p className="text-[10px] sm:text-xs text-text-secondary leading-relaxed">
          💡 <strong>Tip:</strong> These questions are specific to your idea. Answer only what's relevant — no response is required.
        </p>
      </div>

      {/* Clear All Button */}
      <AnimatePresence>
        {hasAnySelection && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex justify-center pt-2"
          >
            <button
              onClick={() => {
                // Clear all selections
                Object.keys(selections).forEach(cardId => onClear(cardId));
              }}
              className="text-xs text-text-tertiary hover:text-text transition-colors underline"
            >
              Clear all selections
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
