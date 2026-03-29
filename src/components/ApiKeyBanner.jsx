import { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { Button } from './ui/button';

const PROVIDER_LABELS = {
  anthropic: 'Anthropic',
  gemini: 'Google Gemini',
  openrouter: 'OpenRouter',
};

const PROVIDER_PLACEHOLDERS = {
  anthropic: 'sk-ant-api03-...',
  gemini: 'AIza...',
  openrouter: 'sk-or-...',
};

export default function ApiKeyBanner({ provider, onAddKey, onGoToSettings }) {
  const [key, setKey] = useState('');
  const [visible, setVisible] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!key.trim()) return;
    onAddKey(key.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-accent/20 bg-accent-light p-4 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
             style={{ background: 'var(--gradient-accent)' }}>
          <KeyRound size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-text">
            Add your {PROVIDER_LABELS[provider]} API key
          </h4>
          <p className="text-xs text-text-tertiary mt-0.5 leading-relaxed">
            Your key stays in your browser and is never sent to any third party.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-3">
            <div className="relative flex-1">
              <input
                type={visible ? 'text' : 'password'}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={PROVIDER_PLACEHOLDERS[provider]}
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl text-sm font-mono
                           bg-surface border border-border text-text outline-none
                           focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
              />
              <button
                onClick={() => setVisible(!visible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-accent transition-colors"
              >
                {visible ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <Button
              onClick={handleSave}
              disabled={!key.trim()}
              variant={saved ? 'outline' : 'default'}
              size="sm"
              className="shrink-0 rounded-xl h-10 sm:h-auto"
            >
              {saved ? (
                <span className="flex items-center gap-1.5 text-success"><Check size={12} /> Saved</span>
              ) : (
                'Save Key'
              )}
            </Button>
          </div>

          <button
            onClick={onGoToSettings}
            className="flex items-center gap-1.5 mt-2.5 text-xs text-accent-text hover:text-accent font-medium transition-colors"
          >
            Or configure in Settings <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
