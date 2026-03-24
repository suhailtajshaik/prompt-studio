import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import PromptInput from './components/PromptInput';
import FrameworkPicker from './components/FrameworkPicker';
import TechniquePicker from './components/TechniquePicker';
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

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
};

const PAGE_TITLES = {
  build: { title: 'Build', subtitle: 'Transform your prompts with AI-powered frameworks' },
  result: { title: 'Result', subtitle: 'Your transformed prompt is ready' },
  learn: { title: 'Learn', subtitle: 'Explore frameworks and prompting techniques' },
  settings: { title: 'Settings', subtitle: 'Configure providers, models, and API keys' },
};

export default function App() {
  const [tab, setTab] = useState('build');
  const [badPrompt, setBadPrompt] = useState('');
  const [framework, setFramework] = useState('costar');
  const [techniques, setTechniques] = useState(['zero-shot']);
  const [dark, setDark] = useTheme();

  const [provider, setProvider] = useState('anthropic');
  const [model, setModel] = useState('claude-sonnet-4-6');
  const { apiKeys, setApiKeys, clearAllKeys } = useApiKeys();

  const { result, loading, error, transform, reset } = useTransform();

  const toggleTechnique = useCallback((id) => {
    setTechniques((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }, []);

  const handleTransform = useCallback(async () => {
    const success = await transform(badPrompt, framework, techniques, provider, model, apiKeys[provider]);
    if (success) setTab('result');
  }, [badPrompt, framework, techniques, provider, model, apiKeys, transform]);

  const handleKeyDown = useCallback((e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (badPrompt.trim() && !loading) {
        handleTransform();
      }
    }
  }, [badPrompt, loading, handleTransform]);

  const currentPage = PAGE_TITLES[tab] || PAGE_TITLES.build;

  return (
    <div className="min-h-screen bg-bg" onKeyDown={handleKeyDown}>
      {/* Sidebar */}
      <Sidebar
        active={tab}
        onChange={setTab}
        hasResult={!!result}
        dark={dark}
        onToggleTheme={() => setDark((d) => !d)}
      />

      {/* Main content area */}
      <main className="md:pl-[240px] min-h-screen pb-20 md:pb-0 transition-all duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Page header */}
          <header className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-semibold text-text tracking-tight">
              {currentPage.title}
            </h1>
            <p className="text-sm text-text-tertiary mt-1">
              {currentPage.subtitle}
            </p>
          </header>

          <AnimatePresence mode="wait">
            {/* BUILD TAB */}
            {tab === 'build' && (
              <motion.div
                key="build"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-5"
              >
                <PromptInput value={badPrompt} onChange={setBadPrompt} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <FrameworkPicker selected={framework} onSelect={setFramework} />
                  <TechniquePicker selected={techniques} onToggle={toggleTechnique} />
                </div>

                <ErrorBanner message={error?.message} details={error?.details} onDismiss={reset} />

                {!apiKeys[provider] && (
                  <ApiKeyBanner
                    provider={provider}
                    onAddKey={(key) => setApiKeys({ ...apiKeys, [provider]: key })}
                    onGoToSettings={() => setTab('settings')}
                  />
                )}

                <TransformButton
                  onClick={handleTransform}
                  disabled={!badPrompt.trim() || loading || !apiKeys[provider]}
                  loading={loading}
                  hasApiKey={!!apiKeys[provider]}
                />

                {result && !loading && (
                  <motion.button
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setTab('result')}
                    className="w-full text-center py-3 text-sm font-medium
                             text-accent-text hover:text-accent-hover transition-colors"
                  >
                    Prompt ready — click to view result
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* RESULT TAB */}
            {tab === 'result' && result && (
              <motion.div
                key="result"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <ResultView
                  result={result}
                  badPrompt={badPrompt}
                  frameworkId={framework}
                  techniqueIds={techniques}
                  onBack={() => setTab('build')}
                />
              </motion.div>
            )}

            {/* LEARN TAB */}
            {tab === 'learn' && (
              <motion.div
                key="learn"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <LearnView />
              </motion.div>
            )}

            {/* SETTINGS TAB */}
            {tab === 'settings' && (
              <motion.div
                key="settings"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
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
