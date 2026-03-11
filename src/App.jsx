import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import TabBar from './components/TabBar';
import PromptInput from './components/PromptInput';
import FrameworkPicker from './components/FrameworkPicker';
import TechniquePicker from './components/TechniquePicker';
import TransformButton from './components/TransformButton';
import ResultView from './components/ResultView';
import LearnView from './components/LearnView';
import SettingsView from './components/SettingsView';
import ErrorBanner from './components/ErrorBanner';
import { useTransform } from './hooks/useTransform';
import { useTheme } from './hooks/useTheme';
import { useApiKeys } from './hooks/useApiKeys';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
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

  return (
    <div className="min-h-screen bg-bg relative" onKeyDown={handleKeyDown}>
      {/* Ambient background blobs */}
      <div className="ambient-bg" />

      <div className="relative z-10 w-full px-4 sm:px-6 md:w-[85%] lg:w-[70%] xl:w-[60%] mx-auto py-6 sm:py-10 md:py-14">
        <Header dark={dark} onToggle={() => setDark((d) => !d)} />

        <TabBar active={tab} onChange={setTab} hasResult={!!result} />

        <AnimatePresence mode="wait">
          {/* BUILD TAB */}
          {tab === 'build' && (
            <motion.div
              key="build"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6 sm:space-y-8"
            >
              <PromptInput value={badPrompt} onChange={setBadPrompt} />

              <FrameworkPicker selected={framework} onSelect={setFramework} />

              <TechniquePicker selected={techniques} onToggle={toggleTechnique} />

              <ErrorBanner message={error} onDismiss={reset} />

              <TransformButton
                onClick={handleTransform}
                disabled={!badPrompt.trim() || loading}
                loading={loading}
              />

              {result && !loading && (
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setTab('result')}
                  className="w-full text-center py-3.5 text-sm font-body font-medium
                           gradient-text hover:opacity-80 transition-opacity"
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

        <footer className="mt-12 sm:mt-20 pt-6 sm:pt-8 border-t border-border/50 text-center">
          <p className="text-xs text-text-tertiary/70 font-body">
            Prompt Studio · Built with React + Vite + Tailwind ·{' '}
            <a
              href="https://www.promptingguide.ai"
              target="_blank"
              rel="noreferrer"
              className="text-accent-text hover:text-accent transition-colors"
            >
              promptingguide.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
