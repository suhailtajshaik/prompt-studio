import { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';

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
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-accent/20 p-4 sm:p-5"
      style={{ background: 'var(--gradient-card)' }}
    >
      <div className="flex items-start gap-3 sm:gap-3.5">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0"
             style={{ background: 'var(--gradient-primary)' }}>
          <KeyRound size={15} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs sm:text-sm font-semibold text-text font-body">
            Add your {PROVIDER_LABELS[provider]} API key to get started
          </h4>
          <p className="text-[10px] sm:text-xs text-text-tertiary mt-1 leading-relaxed">
            Your key stays in your browser and is never sent to any third party.
          </p>

          {/* Inline key input */}
          <div className="flex items-center gap-2 mt-3">
            <div className="relative flex-1">
              <input
                type={visible ? 'text' : 'password'}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={PROVIDER_PLACEHOLDERS[provider]}
                className="w-full px-3 py-2 sm:py-2.5 pr-9 rounded-lg text-xs sm:text-sm font-mono
                           bg-surface border border-border/60 text-text outline-none
                           focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
              />
              <button
                onClick={() => setVisible(!visible)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-accent transition-colors"
              >
                {visible ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
            <button
              onClick={handleSave}
              disabled={!key.trim()}
              className={`shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold
                         transition-all duration-200 ${
                           saved
                             ? 'bg-success-light text-success border border-success/20'
                             : key.trim()
                               ? 'text-white shadow-sm hover:shadow-md'
                               : 'bg-surface-alt text-text-tertiary border border-border cursor-not-allowed'
                         }`}
              style={!saved && key.trim() ? { background: 'var(--gradient-primary)' } : undefined}
            >
              {saved ? (
                <span className="flex items-center gap-1.5"><Check size={12} /> Saved</span>
              ) : (
                'Save'
              )}
            </button>
          </div>

          <button
            onClick={onGoToSettings}
            className="flex items-center gap-1.5 mt-2.5 text-[10px] sm:text-xs text-accent-text hover:text-accent
                       font-medium transition-colors"
          >
            Or configure in Settings <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
