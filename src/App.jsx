import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import PromptInput from './components/PromptInput';
import AdvancedControls from './components/AdvancedControls';
import TransformButton from './components/TransformButton';
import ResultView from './components/ResultView';
import LearnView from './components/LearnView';
import SettingsView from './components/SettingsView';
import ErrorBanner from './components/ErrorBanner';
import ApiKeyBanner from './components/ApiKeyBanner';
import TransformingOverlay from './components/TransformingOverlay';
import { useTransform } from './hooks/useTransform';
import { useTheme } from './hooks/useTheme';
import { useApiKeys } from './hooks/useApiKeys';
import { useIntentDetection } from './hooks/useIntentDetection';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
};

export default function App() {
  const [page, setPage] = useState('studio');
  const [badPrompt, setBadPrompt] = useState('');
  const [dark, setDark] = useTheme();

  const [provider, setProvider] = useState('anthropic');
  const [model, setModel] = useState('claude-sonnet-4-6');
  const { apiKeys, setApiKeys, clearAllKeys } = useApiKeys();

  const { result, loading, error, usedConfig, transform, autoTransform, reset } = useTransform();
  const intent = useIntentDetection(badPrompt);

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

  const handleTransform = useCallback(async () => {
    if (isOverridden) {
      // Use manual selections
      await transform(badPrompt, effectiveFramework, effectiveTechniques, provider, model, apiKeys[provider]);
    } else {
      // Use auto-mode
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
      />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
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
                <div className="text-center mb-6">
                  <h1 className="text-2xl sm:text-3xl font-semibold text-text tracking-tight">
                    Describe what you need
                  </h1>
                  <p className="text-sm text-text-tertiary mt-2 max-w-lg mx-auto">
                    Type, speak, or upload a document. We'll detect your intent and generate
                    an optimized, ready-to-use prompt automatically.
                  </p>
                </div>
              )}

              <PromptInput
                value={badPrompt}
                onChange={setBadPrompt}
                intent={intent}
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
              />

              <ErrorBanner message={error?.message} details={error?.details} onDismiss={reset} />

              {!apiKeys[provider] && (
                <ApiKeyBanner
                  provider={provider}
                  onAddKey={(key) => setApiKeys({ ...apiKeys, [provider]: key })}
                  onGoToSettings={() => setPage('settings')}
                />
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
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ResultView
                      result={result}
                      badPrompt={badPrompt}
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
              <header className="mb-6">
                <h1 className="text-xl sm:text-2xl font-semibold text-text tracking-tight">
                  Learn
                </h1>
                <p className="text-sm text-text-tertiary mt-1">
                  Explore frameworks, techniques, and intent categories
                </p>
              </header>
              <LearnView />
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
              <header className="mb-6">
                <h1 className="text-xl sm:text-2xl font-semibold text-text tracking-tight">
                  Settings
                </h1>
                <p className="text-sm text-text-tertiary mt-1">
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
      </main>

      <AnimatePresence>
        {loading && <TransformingOverlay />}
      </AnimatePresence>
    </div>
  );
}
