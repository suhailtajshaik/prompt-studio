import { useState } from 'react';
import { Key, Eye, EyeOff, Info, Cpu, Shield, Check, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

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

const selectClass = `w-full px-3.5 py-2.5 rounded-xl text-sm text-text outline-none transition-all
  bg-surface-alt border border-border
  focus:border-accent focus:ring-2 focus:ring-accent/15 focus:bg-surface appearance-none cursor-pointer`;

const inputClass = `w-full px-3.5 py-2.5 rounded-xl text-sm text-text outline-none transition-all
  bg-surface-alt border border-border
  focus:border-accent focus:ring-2 focus:ring-accent/15 focus:bg-surface`;

export default function SettingsView({ provider, onProviderChange, model, onModelChange, apiKeys, onApiKeysChange, onClearAllKeys }) {
  const [visible, setVisible] = useState(false);

  const currentProviderInfo = PROVIDERS[provider] || PROVIDERS.anthropic;
  const getModelId = (m) => (typeof m === 'object' ? m.id : m);
  const getModelLabel = (m) => (typeof m === 'object' ? m.label : m);
  const modelIds = currentProviderInfo.models.map(getModelId);
  const isCustomModel = !modelIds.includes(model);

  const handleProviderChange = (e) => {
    const newProvider = e.target.value;
    onProviderChange(newProvider);
    onModelChange(getModelId(PROVIDERS[newProvider].models[0]));
  };

  const currentKey = apiKeys[provider] || '';
  const savedProviders = Object.keys(PROVIDERS).filter((k) => apiKeys[k]?.length > 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Model Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                   style={{ background: 'var(--gradient-accent)' }}>
                <Cpu size={16} className="text-white" />
              </div>
              <div>
                <CardTitle>Model Settings</CardTitle>
                <CardDescription>Choose your AI provider and model</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="provider-select" className="block text-xs font-medium text-text-secondary mb-1.5">
                Provider
              </label>
              <select
                id="provider-select"
                value={provider}
                onChange={handleProviderChange}
                className={selectClass}
              >
                {Object.entries(PROVIDERS).map(([key, info]) => (
                  <option key={key} value={key}>{info.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="model-select" className="block text-xs font-medium text-text-secondary mb-1.5">
                Model
              </label>
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
                className={selectClass}
              >
                {currentProviderInfo.models.map(m => (
                  <option key={getModelId(m)} value={getModelId(m)}>{getModelLabel(m)}</option>
                ))}
                <option value="custom">Custom Model ID...</option>
              </select>
            </div>

            {isCustomModel && (
              <div>
                <label htmlFor="custom-model" className="block text-xs font-medium text-text-secondary mb-1.5">
                  Custom Model ID
                </label>
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
          </CardContent>
        </Card>

        {/* API Key */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-accent-light border border-accent/15 flex items-center justify-center">
                <Key size={16} className="text-accent" />
              </div>
              <div>
                <CardTitle>{currentProviderInfo.label} API Key</CardTitle>
                <CardDescription>Saved to local storage only</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <input
                id="api-key-input"
                type={visible ? 'text' : 'password'}
                value={currentKey}
                onChange={(e) => onApiKeysChange({ ...apiKeys, [provider]: e.target.value })}
                placeholder={currentProviderInfo.placeholder}
                className={`${inputClass} pr-10 font-mono`}
              />
              <button
                aria-label={visible ? 'Hide API key' : 'Show API key'}
                onClick={() => setVisible(!visible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-text-tertiary hover:text-accent transition-colors"
              >
                {visible ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {savedProviders.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-medium text-text-secondary">Saved Keys</span>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(PROVIDERS).map(([key, info]) => {
                    const hasSaved = apiKeys[key]?.length > 0;
                    return (
                      <Badge
                        key={key}
                        variant={hasSaved ? 'success' : 'outline'}
                        className="text-[11px] gap-1 rounded-lg"
                      >
                        {hasSaved && <Check size={10} />}
                        {info.label}
                      </Badge>
                    );
                  })}
                </div>
                {onClearAllKeys && (
                  <button
                    onClick={onClearAllKeys}
                    className="flex items-center gap-1.5 text-xs text-danger hover:text-danger/80 font-medium mt-1 transition-colors"
                  >
                    <Trash2 size={12} />
                    Clear all saved keys
                  </button>
                )}
              </div>
            )}

            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-accent-light/50 border border-accent/10">
              <Shield size={14} className="text-accent shrink-0 mt-0.5" />
              <div className="text-xs text-text-secondary leading-relaxed">
                <p className="mb-1">Keys are saved in local storage and never sent to any third-party server.</p>
                <p>
                  Get your key at{' '}
                  <a href={currentProviderInfo.link} target="_blank" rel="noreferrer"
                    className="text-accent-text font-medium hover:underline underline-offset-2">
                    {currentProviderInfo.linkText}
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* About */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-accent-light">
              <Info size={16} className="text-accent" />
            </div>
            <CardTitle>About Prompt Studio</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-text-secondary leading-relaxed">
            <div className="p-4 rounded-xl bg-surface-alt border border-border">
              Transforms vague prompts into polished, structured ones using proven prompt engineering frameworks.
            </div>
            <div className="p-4 rounded-xl bg-surface-alt border border-border">
              Pick a framework (COSTAR, 6-Step, Markdown) and techniques (Zero-Shot, Few-Shot, Chain-of-Thought) to guide the rewrite.
            </div>
            <div className="p-4 rounded-xl bg-surface-alt border border-border text-text-tertiary">
              Built with React, Vite, Tailwind CSS, and Framer Motion.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
