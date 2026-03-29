import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { KeyRound, ArrowRight } from 'lucide-react';
import Navbar from './components/Navbar';
import PromptInput from './components/PromptInput';
import AdvancedControls from './components/AdvancedControls';
import TransformButton from './components/TransformButton';
import ResultView from './components/ResultView';
import LearnView from './components/LearnView';
import SettingsView from './components/SettingsView';
import AppearanceView from './components/AppearanceView';
import ErrorBanner from './components/ErrorBanner';
import TransformingOverlay from './components/TransformingOverlay';
import { useTransform } from './hooks/useTransform';
import { useTheme } from './hooks/useTheme';
import { useApiKeys } from './hooks/useApiKeys';
import { useIntentDetection } from './hooks/useIntentDetection';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

export default function App() {
  const [page, setPage] = useState('studio');
  const [badPrompt, setBadPrompt] = useState('');
  const [dark, setDark, themeId, setThemeId, currentTheme] = useTheme();

  const [provider, setProvider] = useState('anthropic');
  const [model, setModel] = useState('claude-sonnet-4-6');
  const { apiKeys, setApiKeys, clearAllKeys } = useApiKeys();

  const { result, loading, error, usedConfig, transform, autoTransform, reset } = useTransform();
  const intent = useIntentDetection(badPrompt);

  // Snapshot of the prompt at submit time — frozen so ResultView's "Before" panel
  // doesn't go blank if the user edits/clears the textarea afterward.
  const [submittedPrompt, setSubmittedPrompt] = useState('');

  // Advanced mode: manual framework + technique overrides
  const [manualFramework, setManualFramework] = useState(null);
  const [manualTechniques, setManualTechniques] = useState(null);

  // Sync auto-detected values as defaults when intent changes (only if not overridden)
  const autoFramework = intent?.primary?.framework || 'costar';
  const autoTechniques = intent?.primary?.techniques || ['zero-shot'];

  // Effective values: manual overrides take priority over auto-detected
  const isOverridden = manualFramework !== null || manualTechniques !== null;
  const effectiveFramework = manualFramework ?? autoFramework;
  const effectiveTechniques = manualTechniques ?? autoTechniques;

  const handleFrameworkChange = useCallback((id) => {
    setManualFramework(id);
  }, []);

  const handleTechniqueToggle = useCallback((id) => {
    setManualTechniques((prev) => {
      const current = prev ?? autoTechniques;
      return current.includes(id)
        ? current.filter((t) => t !== id)
        : [...current, id];
    });
  }, [autoTechniques]);

  const handleResetToAuto = useCallback(() => {
    setManualFramework(null);
    setManualTechniques(null);
  }, []);

  // Immediately lock the current auto-detected values into manual overrides
  // so the picker opens pre-filled and isOverridden flips to true right away.
  const handleEnterManual = useCallback(() => {
    setManualFramework(autoFramework);
    setManualTechniques(autoTechniques);
  }, [autoFramework, autoTechniques]);

  const handleTransform = useCallback(async () => {
    setSubmittedPrompt(badPrompt); // snapshot before any async state change
    if (isOverridden) {
      await transform(badPrompt, effectiveFramework, effectiveTechniques, provider, model, apiKeys[provider]);
    } else {
      await autoTransform(badPrompt, intent, provider, model, apiKeys[provider]);
    }
  }, [badPrompt, intent, provider, model, apiKeys, transform, autoTransform, isOverridden, effectiveFramework, effectiveTechniques]);

  const handleKeyDown = useCallback((e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (badPrompt.trim() && !loading) {
        handleTransform();
      }
    }
  }, [badPrompt, loading, handleTransform]);

  const handleNewPrompt = useCallback(() => {
    setBadPrompt('');
    setSubmittedPrompt('');
    reset();
    handleResetToAuto();
  }, [reset, handleResetToAuto]);

  return (
    <div className="min-h-screen bg-bg" onKeyDown={handleKeyDown}>
      <Navbar
        active={page}
        onChange={setPage}
        dark={dark}
        onToggleTheme={() => setDark((d) => !d)}
        currentTheme={currentTheme}
      />

      {/* Main content — offset by sidebar width on desktop, consistent max-width for all pages */}
      <main className="md:ml-56 px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 md:pb-10">
        <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {/* STUDIO PAGE */}
          {page === 'studio' && (
            <motion.div
              key="studio"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-5"
            >
              {/* Hero text - only when no result */}
              {!result && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="text-center mb-8"
                >
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text tracking-tight">
                    Turn <span className="gradient-text">bad prompts</span> into great ones
                  </h1>
                  <p className="text-sm sm:text-base text-text-secondary mt-2.5 max-w-xl mx-auto leading-relaxed">
                    Paste your rough prompt and we'll optimize it using proven frameworks
                    and techniques — automatically.
                  </p>
                </motion.div>
              )}

              <PromptInput
                value={badPrompt}
                onChange={setBadPrompt}
                intent={intent}
                onSubmit={handleTransform}
                canSubmit={!!badPrompt.trim() && !loading}
                hasApiKey={!!apiKeys[provider]}
              />

              {/* Advanced controls */}
              <AdvancedControls
                framework={effectiveFramework}
                onFrameworkChange={handleFrameworkChange}
                techniques={effectiveTechniques}
                onTechniqueToggle={handleTechniqueToggle}
                intent={intent}
                isOverridden={isOverridden}
                onResetToAuto={handleResetToAuto}
                onEnterManual={handleEnterManual}
              />

              <ErrorBanner message={error?.message} details={error?.details} onDismiss={reset} />

              {!apiKeys[provider] && (
                <motion.button
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setPage('settings')}
                  className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl
                             border border-accent/20 bg-accent-light hover:bg-accent-light/80
                             text-sm font-medium text-accent-text hover:text-accent
                             transition-all duration-200 active:scale-[0.98]"
                >
                  <KeyRound size={16} />
                  <span>Add API key in Settings to get started</span>
                  <ArrowRight size={14} className="opacity-50" />
                </motion.button>
              )}

              <TransformButton
                onClick={handleTransform}
                disabled={!badPrompt.trim() || loading || !apiKeys[provider]}
                loading={loading}
                hasApiKey={!!apiKeys[provider]}
                intent={intent}
                isOverridden={isOverridden}
                framework={effectiveFramework}
              />

              {/* Inline result */}
              <AnimatePresence>
                {result && !loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ResultView
                      result={result}
                      badPrompt={submittedPrompt}
                      frameworkId={usedConfig?.frameworkId}
                      techniqueIds={usedConfig?.techniqueIds || []}
                      intent={intent}
                      onNewPrompt={handleNewPrompt}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* LEARN PAGE */}
          {page === 'learn' && (
            <motion.div
              key="learn"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <header className="mb-8">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text tracking-tight">
                  Learn
                </h1>
                <p className="text-sm sm:text-base text-text-secondary mt-1.5">
                  Explore frameworks, techniques, and intent categories
                </p>
              </header>
              <LearnView />
            </motion.div>
          )}

          {/* APPEARANCE PAGE */}
          {page === 'appearance' && (
            <motion.div
              key="appearance"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <header className="mb-8">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text tracking-tight">
                  Appearance
                </h1>
                <p className="text-sm sm:text-base text-text-secondary mt-1.5">
                  Choose a theme that fits your workflow and style.
                </p>
              </header>
              <AppearanceView themeId={themeId} onThemeChange={setThemeId} />
            </motion.div>
          )}

          {/* SETTINGS PAGE */}
          {page === 'settings' && (
            <motion.div
              key="settings"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <header className="mb-8">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text tracking-tight">
                  API Keys
                </h1>
                <p className="text-sm sm:text-base text-text-secondary mt-1.5">
                  Configure providers, models, and API keys
                </p>
              </header>
              <SettingsView
                provider={provider}
                onProviderChange={setProvider}
                model={model}
                onModelChange={setModel}
                apiKeys={apiKeys}
                onApiKeysChange={setApiKeys}
                onClearAllKeys={clearAllKeys}
              />
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {loading && <TransformingOverlay />}
      </AnimatePresence>
    </div>
  );
}
