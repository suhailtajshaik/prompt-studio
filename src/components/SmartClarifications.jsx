import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { generateClarifications } from '../data/smartClarifications';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

function QuestionCard({ question, answer, onAnswer }) {
  const selectedOption = question.options?.find(opt => opt.id === answer);

  return (
    <motion.div variants={itemVariants} className="space-y-3">
      {/* Question Header */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-text">
          ❓ {question.text}
        </h3>
        {question.hint && (
          <p className="text-xs text-text-tertiary italic">
            {question.hint}
          </p>
        )}
      </div>

      {/* Selected Answer */}
      {selectedOption && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg p-2.5 flex items-start gap-2">
          <div className="text-lg">✓</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-accent-text">
              {selectedOption.label}
            </p>
            {selectedOption.desc && (
              <p className="text-[10px] text-text-secondary mt-0.5">
                {selectedOption.desc}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Options */}
      <div className="grid gap-2">
        {question.options?.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onAnswer(question.id, option.id)}
            className={`
              relative p-2.5 rounded-lg border-2 transition-all text-left
              ${
                answer === option.id
                  ? 'border-accent bg-accent/10'
                  : 'border-border hover:border-accent/50 hover:bg-surface-alt/50'
              }
            `}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-text">
                  {option.label}
                </p>
                {option.desc && (
                  <p className="text-[10px] text-text-secondary mt-1">
                    {option.desc}
                  </p>
                )}
              </div>
              {answer === option.id && (
                <div className="flex-shrink-0 text-lg">✓</div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

export default function SmartClarifications({
  description,
  answers,
  onAnswer,
  onClear,
}) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Generate questions when description changes
  useEffect(() => {
    if (!description?.trim()) {
      setQuestions([]);
      return;
    }

    setLoading(true);
    // Simulate brief processing time for intent detection
    const timer = setTimeout(() => {
      const generated = generateClarifications(description);
      setQuestions(generated);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [description]);

  if (!description?.trim()) {
    return null;
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 text-xs text-text-secondary"
      >
        <span className="spinner w-3 h-3 border border-text-tertiary border-t-text-secondary rounded-full" />
        Analyzing your skill...
      </motion.div>
    );
  }

  if (questions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-2 p-3 rounded-lg bg-surface-alt/50 border border-border/40"
      >
        <AlertCircle size={14} className="flex-shrink-0 mt-1 text-text-tertiary" />
        <p className="text-[11px] text-text-tertiary">
          This skill description is clear enough! You can generate directly.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <h3 className="text-xs font-semibold text-text">
            Quick clarifications ({questions.length})
          </h3>
          <p className="text-[10px] text-text-tertiary">
            Help us generate exactly what you need
          </p>
        </div>
        {Object.keys(answers).length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={onClear}
            className="text-[10px] text-text-tertiary hover:text-text transition-colors underline flex-shrink-0"
          >
            Clear
          </motion.button>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-4 pl-1">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            answer={answers[question.id]}
            onAnswer={onAnswer}
          />
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-accent/5 border border-accent/20 rounded-lg p-2.5">
        <p className="text-[10px] text-text-secondary leading-relaxed">
          💡 These questions help us understand your needs better. Answers are optional.
        </p>
      </div>
    </motion.div>
  );
}
