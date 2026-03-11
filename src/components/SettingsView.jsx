import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Eye, EyeOff, Info, Cpu, Shield, Check, Trash2 } from 'lucide-react';

const PROVIDERS = {
  anthropic: {
    label: 'Anthropic',
    models: ['claude-sonnet-4-6', 'claude-opus-4-6', 'claude-haiku-4-5'],
    link: 'https://console.anthropic.com/settings/keys',
    linkText: 'console.anthropic.com',
    placeholder: 'sk-ant-api03-...',
  },
  gemini: {
    label: 'Google Gemini',
    models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-2.0-flash-exp'],
    link: 'https://aistudio.google.com/app/apikey',
    linkText: 'aistudio.google.com',
    placeholder: 'AIza...',
  },
  openrouter: {
    label: 'OpenRouter',
    models: ['anthropic/claude-sonnet-4', 'google/gemini-2.5-pro', 'meta-llama/llama-3-8b-instruct', 'deepseek/deepseek-chat', 'openai/gpt-4o'],
    link: 'https://openrouter.ai/keys',
    linkText: 'openrouter.ai',
    placeholder: 'sk-or-...',
  },
};

const inputClass = `
  w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm text-text outline-none transition-all appearance-none
  bg-surface-alt border border-border/60
  focus:border-accent focus:ring-2 focus:ring-accent/15 focus:bg-surface
`;

export default function SettingsView({ provider, onProviderChange, model, onModelChange, apiKeys, onApiKeysChange, onClearAllKeys }) {
  const [visible, setVisible] = useState(false);

  const currentProviderInfo = PROVIDERS[provider] || PROVIDERS.anthropic;
  const isCustomModel = !currentProviderInfo.models.includes(model);

  const handleProviderChange = (e) => {
    const newProvider = e.target.value;
    onProviderChange(newProvider);
    onModelChange(PROVIDERS[newProvider].models[0]);
  };

  const currentKey = apiKeys[provider] || '';
  const savedProviders = Object.keys(PROVIDERS).filter((k) => apiKeys[k]?.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full space-y-4 sm:space-y-6"
    >
      {/* Top row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

        {/* Model Settings */}
        <div className="card p-5 sm:p-7">
          <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-7">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0"
                 style={{ background: 'var(--gradient-primary)' }}>
              <Cpu size={16} className="text-white sm:hidden" />
              <Cpu size={18} className="text-white hidden sm:block" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-text font-display">Model Settings</h3>
              <p className="text-[10px] sm:text-xs text-text-tertiary mt-0.5">Choose your AI provider and model</p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-5">
            <div>
              <label htmlFor="provider-select" className="block text-[10px] sm:text-xs font-semibold text-text-secondary mb-1.5 sm:mb-2">Provider</label>
              <select
                id="provider-select"
                value={provider}
                onChange={handleProviderChange}
                className={inputClass}
              >
                {Object.entries(PROVIDERS).map(([key, info]) => (
                  <option key={key} value={key}>{info.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="model-select" className="block text-[10px] sm:text-xs font-semibold text-text-secondary mb-1.5 sm:mb-2">Model</label>
              <select
                id="model-select"
                value={isCustomModel ? 'custom' : model}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    onModelChange('');
                  } else {
                    onModelChange(e.target.value);
                  }
                }}
                className={inputClass}
              >
                {currentProviderInfo.models.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
                <option value="custom">Custom Model ID...</option>
              </select>
            </div>

            {isCustomModel && (
              <div>
                <label htmlFor="custom-model" className="block text-[10px] sm:text-xs font-semibold text-text-secondary mb-1.5 sm:mb-2">Custom Model ID</label>
                <input
                  id="custom-model"
                  type="text"
                  value={model}
                  onChange={(e) => onModelChange(e.target.value)}
                  placeholder="e.g. mistral/mistral-7b-instruct"
                  className={inputClass}
                />
              </div>
            )}
          </div>
        </div>

        {/* API Key */}
        <div className="card p-5 sm:p-7">
          <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-7">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-accent/20 bg-accent-light flex items-center justify-center shrink-0">
              <Key size={16} className="text-accent sm:hidden" />
              <Key size={18} className="text-accent hidden sm:block" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-text font-display">{currentProviderInfo.label} API Key</h3>
              <p className="text-[10px] sm:text-xs text-text-tertiary mt-0.5">Saved to local storage</p>
            </div>
          </div>

          <div className="relative">
            <input
              id="api-key-input"
              type={visible ? 'text' : 'password'}
              value={currentKey}
              onChange={(e) => onApiKeysChange({ ...apiKeys, [provider]: e.target.value })}
              placeholder={currentProviderInfo.placeholder}
              className={`${inputClass} pr-12 font-mono`}
            />
            <button
              aria-label={visible ? 'Hide API key' : 'Show API key'}
              onClick={() => setVisible(!visible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-text-tertiary hover:text-accent hover:bg-accent-light transition-all"
            >
              {visible ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {/* Saved keys indicator */}
          {savedProviders.length > 0 && (
            <div className="mt-4 sm:mt-5 space-y-2">
              <div className="text-[10px] sm:text-xs font-semibold text-text-secondary mb-1.5">Saved Keys</div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {Object.entries(PROVIDERS).map(([key, info]) => {
                  const hasSaved = apiKeys[key]?.length > 0;
                  return (
                    <span
                      key={key}
                      className={`inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono px-2 sm:px-2.5 py-1 rounded-lg border ${
                        hasSaved
                          ? 'text-success bg-success-light border-success/20'
                          : 'text-text-tertiary bg-surface-alt border-border/40'
                      }`}
                    >
                      {hasSaved && <Check size={10} />}
                      {info.label}
                    </span>
                  );
                })}
              </div>
              {savedProviders.length > 0 && onClearAllKeys && (
                <button
                  onClick={onClearAllKeys}
                  className="flex items-center gap-1.5 text-[10px] sm:text-xs text-danger hover:text-danger/80 font-medium mt-2 transition-colors"
                >
                  <Trash2 size={11} />
                  Clear all saved keys
                </button>
              )}
            </div>
          )}

          <div className="flex items-start gap-2.5 sm:gap-3 mt-4 sm:mt-5 p-3 sm:p-4 rounded-xl bg-accent-light/50 border border-accent/15">
            <Shield size={13} className="text-accent shrink-0 mt-0.5" />
            <div className="text-[10px] sm:text-xs text-text-secondary leading-relaxed">
              <p className="mb-1 sm:mb-1.5">Your keys are saved in local storage and never sent to any third-party server.</p>
              <p>
                Get your key at{' '}
                <a href={currentProviderInfo.link} target="_blank" rel="noreferrer"
                  className="text-accent-text font-medium hover:underline underline-offset-2">
                  {currentProviderInfo.linkText}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="card p-5 sm:p-7">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-accent-light border border-accent/15 shrink-0">
            <Info size={13} className="text-accent sm:hidden" />
            <Info size={14} className="text-accent hidden sm:block" />
          </div>
          <h3 className="text-xs sm:text-sm font-semibold text-text font-display">About Prompt Studio</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 text-[10px] sm:text-xs text-text-secondary leading-relaxed font-body">
          <div className="p-3 sm:p-4 rounded-xl bg-surface-alt/50 border border-border/40">
            <p>Transforms vague prompts into polished, structured ones using proven prompt engineering frameworks.</p>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-surface-alt/50 border border-border/40">
            <p>Pick a framework (COSTAR, 6-Step, Markdown) and techniques (Zero-Shot, Few-Shot, Chain-of-Thought) to guide the rewrite.</p>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-surface-alt/50 border border-border/40">
            <p className="text-text-tertiary">Built with React · Vite · Tailwind CSS · Framer Motion</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
