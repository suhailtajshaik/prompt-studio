import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader, ArrowRight, Wand2 } from 'lucide-react';
import PromptInput from './PromptInput';
import ErrorBanner from './ErrorBanner';
import IdeaClarificationCards from './IdeaClarificationCards';
import { useIdeaToPRD } from '../hooks/useIdeaToPRD';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export default function IdeaToPRDModal({ isOpen, onClose, apiKeys, provider, model }) {
  const [step, setStep] = useState(1); // 1: idea input, 2: clarifications, 3: review
  const [idea, setIdea] = useState('');
  const [clarifications, setClarifications] = useState(null);
  const [selections, setSelections] = useState({});
  
  const { 
    prd, 
    loading, 
    error, 
    generateClarifications,
    generatePRD,
    reset 
  } = useIdeaToPRD();

  const handleSubmitIdea = async () => {
    if (!idea.trim()) return;
    setStep(2);
    // Generate smart clarifications based on the idea
    const result = await generateClarifications(idea, provider, model, apiKeys[provider]);
    if (result) {
      setClarifications(result);
    } else {
      setStep(1); // Go back if clarification generation fails
    }
  };

  const handleSelectOption = (cardId, optionId) => {
    setSelections((prev) => ({
      ...prev,
      [cardId]: optionId,
    }));
  };

  const handleClearSelection = (cardId) => {
    setSelections((prev) => {
      const updated = { ...prev };
      delete updated[cardId];
      return updated;
    });
  };

  const handleGeneratePRD = async () => {
    if (!clarifications) return;
    setStep(3);
    await generatePRD(idea, clarifications, selections, provider, model, apiKeys[provider]);
  };

  const handleClose = () => {
    setStep(1);
    setIdea('');
    setClarifications(null);
    setSelections({});
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="bg-surface rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-surface border-b border-border/40 px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Wand2 size={16} className="text-accent" />
            </div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-text">
              Idea to PRD
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-surface-alt rounded-lg transition-colors"
          >
            <X size={20} className="text-text-tertiary" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 sm:px-8 py-6 sm:py-8 space-y-6">
          <ErrorBanner message={error?.message} details={error?.details} onDismiss={reset} />

          <AnimatePresence mode="wait">
            {/* Step 1: Idea Input */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <p className="text-xs text-text-tertiary uppercase font-semibold tracking-wider">
                    Step 1 of 3
                  </p>
                  <h3 className="text-base sm:text-lg font-semibold text-text">
                    What's your product idea?
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto">
                    Describe your feature request, product, or idea. Be as detailed or vague as you'd like.
                  </p>
                </div>

                <PromptInput
                  value={idea}
                  onChange={setIdea}
                  placeholder="e.g., A mobile app for tracking daily water intake with reminders and social leaderboards, or an AI-powered tool for..."
                />

                <motion.button
                  whileHover={idea.trim() ? { scale: 1.01 } : {}}
                  whileTap={idea.trim() ? { scale: 0.98 } : {}}
                  onClick={handleSubmitIdea}
                  disabled={!idea.trim() || loading}
                  className={`
                    relative w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl
                    text-sm sm:text-base font-display font-semibold
                    transition-all duration-200 overflow-hidden
                    ${idea.trim() && !loading
                      ? 'text-white shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30'
                      : 'bg-surface-alt text-text-tertiary/50 cursor-not-allowed border border-border/40'
                    }
                  `}
                  style={idea.trim() && !loading ? { background: 'var(--gradient-primary)' } : undefined}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <span className="spinner w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                        Analyzing idea...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight size={16} />
                      </>
                    )}
                  </span>
                </motion.button>
              </motion.div>
            )}

            {/* Step 2: Smart Clarifications */}
            {step === 2 && clarifications && (
              <motion.div
                key="step2"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <p className="text-xs text-text-tertiary uppercase font-semibold tracking-wider">
                    Step 2 of 3
                  </p>
                  <h3 className="text-base sm:text-lg font-semibold text-text">
                    Quick clarifications
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto">
                    Answer a few quick questions to help us generate a more tailored PRD.
                  </p>
                </div>

                <IdeaClarificationCards
                  cards={clarifications}
                  selections={selections}
                  onSelect={handleSelectOption}
                  onClear={handleClearSelection}
                />

                <div className="flex gap-3 sm:gap-4">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setStep(1);
                      setClarifications(null);
                      setSelections({});
                    }}
                    className="flex-1 py-3 px-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base
                               border border-border hover:bg-surface-alt transition-all duration-200
                               text-text-secondary"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGeneratePRD}
                    disabled={loading}
                    className={`
                      flex-1 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl
                      text-sm sm:text-base font-display font-semibold
                      transition-all duration-200 overflow-hidden text-white
                      shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30
                    `}
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <span className="spinner w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                          Generating PRD...
                        </>
                      ) : (
                        <>
                          Generate PRD
                          <ArrowRight size={16} />
                        </>
                      )}
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 3: PRD Result */}
            {step === 3 && prd && (
              <motion.div
                key="step3"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <p className="text-xs text-text-tertiary uppercase font-semibold tracking-wider">
                    Step 3 of 3
                  </p>
                  <h3 className="text-base sm:text-lg font-semibold text-text">
                    Your PRD is ready
                  </h3>
                </div>

                <div className="card p-5 sm:p-6 space-y-4 max-h-96 overflow-y-auto">
                  <div
                    className="text-xs sm:text-sm text-text-secondary leading-relaxed prose-sm
                               prose-headings:font-semibold prose-headings:text-text prose-headings:mt-4
                               prose-p:m-0 prose-ul:m-0 prose-ol:m-0 prose-ul:pl-4 prose-ol:pl-4
                               prose-li:m-0 prose-strong:text-accent-text"
                    dangerouslySetInnerHTML={{
                      __html: prd.html || '<p>No PRD content generated</p>',
                    }}
                  />
                </div>

                <div className="flex gap-3 sm:gap-4">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handleClose();
                    }}
                    className="flex-1 py-3 px-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base
                               border border-border hover:bg-surface-alt transition-all duration-200
                               text-text-secondary"
                  >
                    Close
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      // Copy to clipboard
                      navigator.clipboard.writeText(prd.markdown);
                      // TODO: Show success toast
                    }}
                    className={`
                      flex-1 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl
                      text-sm sm:text-base font-display font-semibold
                      transition-all duration-200 overflow-hidden text-white
                      shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30
                    `}
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    Copy PRD
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Loading State */}
            {loading && step === 2 && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 gap-4"
              >
                <div className="spinner w-8 h-8 border-3 border-accent/20 border-t-accent rounded-full" />
                <p className="text-sm text-text-secondary">Analyzing your idea...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
