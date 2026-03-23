import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { CLARIFICATION_CATEGORIES, CATEGORY_ORDER } from '../data/clarificationOptions';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

function OptionButton({
  option,
  isSelected,
  onClick,
  isMultiSelect,
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`
        relative p-3 sm:p-4 rounded-lg border-2 transition-all duration-200
        text-left group
        ${
          isSelected
            ? 'border-accent bg-accent/10'
            : 'border-border hover:border-accent/50 hover:bg-surface-alt'
        }
      `}
    >
      {/* Multi-select checkbox */}
      {isMultiSelect && (
        <div className={`
          absolute top-2 right-2 sm:top-3 sm:right-3 w-4 h-4 sm:w-5 sm:h-5
          rounded border-2 flex items-center justify-center text-xs font-bold
          transition-all
          ${isSelected ? 'bg-accent border-accent text-white' : 'border-border'}
        `}>
          {isSelected && '✓'}
        </div>
      )}

      <div className="flex items-start gap-2">
        <span className="text-lg sm:text-xl flex-shrink-0 mt-0.5">{option.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-xs sm:text-sm text-text">
            {option.label}
          </div>
          {option.desc && (
            <div className="text-[10px] sm:text-xs text-text-secondary mt-1">
              {option.desc}
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}

function CategorySection({
  categoryId,
  categoryData,
  selections,
  onSelect,
  onClear,
}) {
  const isMultiSelect = categoryData.multiSelect;
  const selected = selections[categoryId] || (isMultiSelect ? [] : null);
  const hasSelection = isMultiSelect ? selected.length > 0 : selected !== null;

  return (
    <motion.div variants={itemVariants} className="space-y-2 sm:space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-text">
            {categoryData.label}
          </h3>
          <p className="text-[10px] sm:text-xs text-text-tertiary mt-0.5">
            {categoryData.description}
          </p>
        </div>
        {hasSelection && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onClear(categoryId)}
            className="flex-shrink-0 p-1 hover:bg-surface-alt rounded transition-colors"
            title="Clear selection"
          >
            <X size={14} className="text-text-tertiary hover:text-text" />
          </motion.button>
        )}
      </div>

      {/* Options Grid */}
      <div className={`
        grid gap-2 sm:gap-3
        ${categoryData.options.length <= 3
          ? 'grid-cols-2 sm:grid-cols-3'
          : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3'
        }
      `}>
        {categoryData.options.map((option) => (
          <OptionButton
            key={option.id}
            option={option}
            isSelected={
              isMultiSelect
                ? selected.includes(option.id)
                : selected === option.id
            }
            onClick={() => onSelect(categoryId, option.id)}
            isMultiSelect={isMultiSelect}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function SkillClarificationCards({
  selections,
  onSelect,
  onClear,
  onClearAll,
}) {
  const hasAnySelection = Object.keys(selections).length > 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 sm:space-y-8"
    >
      {/* Section Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-accent-light border border-accent/20 text-xs font-medium text-accent-text">
          ✨ Refine Your Skill
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-text">
          Tell us about your skill (optional)
        </h3>
        <p className="text-xs text-text-tertiary">
          These preferences will help generate a more tailored module
        </p>
      </div>

      {/* Categories */}
      <div className="space-y-6 sm:space-y-8">
        {CATEGORY_ORDER.map((categoryId) => (
          <CategorySection
            key={categoryId}
            categoryId={categoryId}
            categoryData={CLARIFICATION_CATEGORIES[categoryId]}
            selections={selections}
            onSelect={onSelect}
            onClear={onClear}
          />
        ))}
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
              onClick={onClearAll}
              className="text-xs text-text-tertiary hover:text-text transition-colors underline"
            >
              Clear all selections
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Box */}
      <div className="bg-surface-alt/50 border border-border/40 rounded-lg p-3 sm:p-4">
        <p className="text-[10px] sm:text-xs text-text-secondary leading-relaxed">
          💡 <strong>Tip:</strong> Selections are optional. The system will generate a quality skill regardless of your choices, but these preferences help ensure the result matches your needs.
        </p>
      </div>
    </motion.div>
  );
}
