import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, ChevronDown, ChevronUp, Copy, Check, ArrowRight, Zap, Cpu } from 'lucide-react';
import PromptInput from './PromptInput';
import ErrorBanner from './ErrorBanner';
import { useAgentDecompose } from '../hooks/useAgentDecompose';

const AGENT_COLORS = ['#6366f1', '#00d4aa', '#e8b931', '#f97316', '#ec4899', '#3b82f6'];

const PROVIDERS = {
  anthropic: {
    label: 'Anthropic',
    models: ['claude-sonnet-4-6', 'claude-opus-4-6', 'claude-haiku-4-5'],
  },
  gemini: {
    label: 'Google Gemini',
    models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash'],
  },
  openrouter: {
    label: 'OpenRouter',
    models: ['anthropic/claude-sonnet-4', 'google/gemini-2.5-pro', 'deepseek/deepseek-chat', 'openai/gpt-4o'],
  },
  localai: {
    label: 'LocalAI',
    models: ['llama-3.2-1b-instruct:q4_k_m'],
  },
};

const selectClass = `
  px-3 py-2 rounded-lg text-xs text-text outline-none transition-all appearance-none
  bg-surface-alt border border-border/60
  focus:border-accent focus:ring-2 focus:ring-accent/15 focus:bg-surface
`;

export default function AgentModeView({ provider: initialProvider, model: initialModel, apiKeys }) {
  const [input, setInput] = useState('');
  const [provider, setProvider] = useState(initialProvider || 'anthropic');
  const [model, setModel] = useState(initialModel || PROVIDERS[initialProvider]?.models[0] || 'claude-sonnet-4-6');
  const [refinedOpen, setRefinedOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { refinedPrompt, agentPlan, loading, step, error, decompose, reset } = useAgentDecompose();

  const handleProviderChange = (e) => {
    const p = e.target.value;
    setProvider(p);
    setModel(PROVIDERS[p]?.models[0] || '');
  };

  const handleDecompose = () => {
    const key = apiKeys[provider] || '';
    decompose(input, provider, model, key);
  };

  const canRun = input.trim() && !loading && (!!apiKeys[provider] || provider === 'localai');

  const copyBlueprint = async () => {
    if (!agentPlan) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(agentPlan, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-light border border-accent/20 text-xs font-medium text-accent-text">
          <Bot size={14} />
          Agent Mode
        </div>
        <h2 className="text-lg sm:text-xl font-display font-bold text-text">
          From vague thought <span className="text-text-tertiary">→</span> agent execution blueprint
        </h2>
        <p className="text-xs text-text-tertiary max-w-md mx-auto">
          Enter a rough idea. The AI will refine it, then decompose it into a multi-agent execution plan.
        </p>
      </div>

      {/* Input */}
      <PromptInput value={input} onChange={setInput} />

      {/* Provider / Model selector — compact inline */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-[10px] sm:text-xs font-semibold text-text-secondary">Provider</label>
          <select value={provider} onChange={handleProviderChange} className={selectClass}>
            {Object.entries(PROVIDERS).map(([key, info]) => (
              <option key={key} value={key}>{info.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[10px] sm:text-xs font-semibold text-text-secondary">Model</label>
          <select value={model} onChange={(e) => setModel(e.target.value)} className={selectClass}>
            {(PROVIDERS[provider]?.models || []).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}
      <ErrorBanner message={error?.message} details={error?.details} onDismiss={reset} />

      {/* Decompose button */}
      <motion.button
        whileHover={canRun ? { scale: 1.01 } : {}}
        whileTap={canRun ? { scale: 0.98 } : {}}
        onClick={handleDecompose}
        disabled={!canRun}
        className={`
          relative w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl
          text-sm sm:text-base font-display font-semibold
          transition-all duration-200 overflow-hidden
          ${canRun
            ? 'text-white shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30'
            : 'bg-surface-alt text-text-tertiary/50 cursor-not-allowed border border-border/40'
          }
        `}
        style={canRun ? { background: 'var(--gradient-primary)' } : undefined}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <span className="spinner w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
              {step === 'refining' ? 'Refining prompt...' : 'Decomposing into agents...'}
            </>
          ) : (
            <>
              <Zap size={16} />
              Decompose into Agents
              <ArrowRight size={16} />
            </>
          )}
        </span>
      </motion.button>

      {/* Progress indicator */}
      <AnimatePresence>
        {(step || agentPlan) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 sm:gap-3"
          >
            <StepBadge label="Clarity Refine" done={step === 'decomposing' || step === 'done'} active={step === 'refining'} />
            <ArrowRight size={14} className="text-text-tertiary" />
            <StepBadge label="Agent Decomposition" done={step === 'done'} active={step === 'decomposing'} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {agentPlan && step === 'done' && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Refined Prompt — collapsible */}
            {refinedPrompt && (
              <div className="card p-4 sm:p-5">
                <button
                  onClick={() => setRefinedOpen(!refinedOpen)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-accent-text">Refined Prompt</span>
                    <span className="text-[10px] text-text-tertiary">(Step 1 output)</span>
                  </div>
                  {refinedOpen ? <ChevronUp size={14} className="text-text-tertiary" /> : <ChevronDown size={14} className="text-text-tertiary" />}
                </button>
                <AnimatePresence>
                  {refinedOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <pre className="mt-3 p-3 sm:p-4 rounded-lg bg-surface-alt text-xs text-text-secondary whitespace-pre-wrap font-mono leading-relaxed border border-border/40">
                        {refinedPrompt}
                      </pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Goal */}
            {agentPlan.goal && (
              <div className="card p-5 sm:p-7 text-center">
                <div className="text-[10px] sm:text-xs font-semibold text-accent-text mb-2 uppercase tracking-wider">Primary Goal</div>
                <p className="text-base sm:text-lg font-display font-bold text-text leading-snug">{agentPlan.goal}</p>
              </div>
            )}

            {/* Pipeline Summary */}
            {agentPlan.pipeline_summary && (
              <div className="card p-4 sm:p-5">
                <div className="text-[10px] sm:text-xs font-semibold text-accent-text mb-2 uppercase tracking-wider">Pipeline Summary</div>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{agentPlan.pipeline_summary}</p>
              </div>
            )}

            {/* Agent Cards */}
            <div className="space-y-3 sm:space-y-4">
              {agentPlan.agents.map((agent, idx) => (
                <AgentCard key={agent.id || idx} agent={agent} index={idx} />
              ))}
            </div>

            {/* Copy Blueprint */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={copyBlueprint}
              className="w-full py-3 rounded-xl border border-border/60 bg-surface hover:bg-surface-alt
                         text-xs sm:text-sm font-medium text-text transition-all
                         flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-success" />
                  <span className="text-success">Copied to clipboard!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy Blueprint JSON
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StepBadge({ label, done, active }) {
  return (
    <span className={`
      inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all
      ${done
        ? 'bg-success-light text-success border border-success/20'
        : active
          ? 'bg-accent-light text-accent-text border border-accent/20 animate-pulse'
          : 'bg-surface-alt text-text-tertiary border border-border/40'
      }
    `}>
      {done && <Check size={10} />}
      {active && <span className="spinner w-3 h-3 border-[1.5px] border-accent/30 border-t-accent rounded-full" />}
      {label}
    </span>
  );
}

function AgentCard({ agent, index }) {
  const color = AGENT_COLORS[index % AGENT_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="card p-4 sm:p-5 overflow-hidden"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3">
        <span
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
          style={{ backgroundColor: color }}
        >
          {agent.id || index + 1}
        </span>
        <div>
          <h4 className="text-xs sm:text-sm font-display font-bold text-text">{agent.name}</h4>
          <p className="text-[10px] sm:text-xs text-text-secondary italic">{agent.role}</p>
        </div>
      </div>

      {/* Responsibilities */}
      {agent.responsibilities?.length > 0 && (
        <div className="mb-3">
          <div className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">Responsibilities</div>
          <ul className="space-y-1">
            {agent.responsibilities.map((r, i) => (
              <li key={i} className="text-[10px] sm:text-xs text-text-secondary flex items-start gap-1.5">
                <span className="text-text-tertiary mt-0.5">•</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tools */}
      {agent.tools?.length > 0 && (
        <div className="mb-3">
          <div className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">Tools</div>
          <div className="flex flex-wrap gap-1.5">
            {agent.tools.map((tool, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-accent-light text-accent-text border border-accent/15"
              >
                <Cpu size={9} />
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Input → Output */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3">
        <div className="flex-1 p-2.5 rounded-lg bg-surface-alt border border-border/40">
          <div className="text-[10px] font-semibold text-text-tertiary mb-1">Input</div>
          <p className="text-[10px] sm:text-xs text-text-secondary">{agent.input}</p>
        </div>
        <ArrowRight size={14} className="text-text-tertiary mx-auto sm:mx-0 shrink-0 rotate-90 sm:rotate-0" />
        <div className="flex-1 p-2.5 rounded-lg bg-surface-alt border border-border/40">
          <div className="text-[10px] font-semibold text-text-tertiary mb-1">Output</div>
          <p className="text-[10px] sm:text-xs text-text-secondary">{agent.output}</p>
        </div>
      </div>

      {/* Handoff */}
      {agent.handoff && (
        <p className="text-[10px] text-text-tertiary">
          <span className="font-semibold">Handoff:</span> {agent.handoff}
        </p>
      )}

      {/* Connections */}
      {(agent.receives_from || agent.sends_to) && (
        <div className="flex flex-wrap gap-3 mt-2 text-[10px] text-text-tertiary">
          {agent.receives_from && (
            <span>← Receives from: <span className="font-medium text-text-secondary">{agent.receives_from}</span></span>
          )}
          {agent.sends_to && (
            <span>→ Sends to: <span className="font-medium text-text-secondary">{agent.sends_to}</span></span>
          )}
        </div>
      )}
    </motion.div>
  );
}
