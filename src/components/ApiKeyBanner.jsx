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
      className="rounded-lg border border-accent/20 bg-accent-light p-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
          <KeyRound size={14} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-text">
            Add your {PROVIDER_LABELS[provider]} API key
          </h4>
          <p className="text-xs text-text-tertiary mt-0.5 leading-relaxed">
            Your key stays in your browser and is never sent to any third party.
          </p>

          <div className="flex items-center gap-2 mt-3">
            <div className="relative flex-1">
              <input
                type={visible ? 'text' : 'password'}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={PROVIDER_PLACEHOLDERS[provider]}
                className="w-full px-3 py-2 pr-9 rounded-lg text-sm font-mono
                           bg-surface border border-border text-text outline-none
                           focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
              />
              <button
                onClick={() => setVisible(!visible)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-accent transition-colors"
              >
                {visible ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
            <Button
              onClick={handleSave}
              disabled={!key.trim()}
              variant={saved ? 'outline' : 'default'}
              size="sm"
              className="shrink-0"
            >
              {saved ? (
                <span className="flex items-center gap-1.5 text-success"><Check size={12} /> Saved</span>
              ) : (
                'Save'
              )}
            </Button>
          </div>

          <button
            onClick={onGoToSettings}
            className="flex items-center gap-1.5 mt-2 text-xs text-accent-text hover:text-accent font-medium transition-colors"
          >
            Or configure in Settings <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
