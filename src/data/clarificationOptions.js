/**
 * Skill Generation Clarification Options
 * Card-based UI options for refining skill generation
 */

export const CLARIFICATION_CATEGORIES = {
  purpose: {
    label: 'Primary Purpose',
    description: 'What is the main function of this module?',
    multiSelect: false,
    options: [
      { id: 'data-processing', label: 'Data Processing', icon: '📊' },
      { id: 'api-service', label: 'API Service', icon: '🌐' },
      { id: 'utility', label: 'Utility/Helper', icon: '🔧' },
      { id: 'cli-tool', label: 'CLI Tool', icon: '⌨️' },
      { id: 'database', label: 'Database/Storage', icon: '💾' },
      { id: 'ml-model', label: 'ML/AI Integration', icon: '🤖' },
    ],
  },
  features: {
    label: 'Key Features',
    description: 'What capabilities should it include?',
    multiSelect: true,
    options: [
      { id: 'error-handling', label: 'Error Handling', icon: '⚠️' },
      { id: 'logging', label: 'Logging/Monitoring', icon: '📝' },
      { id: 'caching', label: 'Caching', icon: '⚡' },
      { id: 'validation', label: 'Data Validation', icon: '✓' },
      { id: 'async', label: 'Async/Concurrent', icon: '🔄' },
      { id: 'config', label: 'Configuration', icon: '⚙️' },
    ],
  },
  performance: {
    label: 'Performance Profile',
    description: 'What are your performance priorities?',
    multiSelect: false,
    options: [
      { id: 'standard', label: 'Standard', icon: '⚖️', desc: 'Balanced approach' },
      { id: 'high-perf', label: 'High-Performance', icon: '🚀', desc: 'Speed optimized' },
      { id: 'optimized-size', label: 'Optimized Size', icon: '📦', desc: 'Minimal dependencies' },
      { id: 'memory-efficient', label: 'Memory Efficient', icon: '🧠', desc: 'Low memory footprint' },
    ],
  },
  testing: {
    label: 'Testing Requirements',
    description: 'What testing coverage do you need?',
    multiSelect: false,
    options: [
      { id: 'comprehensive', label: 'Comprehensive', icon: '✅', desc: 'Full unit + integration tests' },
      { id: 'unit-only', label: 'Unit Tests Only', icon: '🧪', desc: 'Unit test coverage' },
      { id: 'minimal', label: 'Minimal', icon: '📍', desc: 'Basic example' },
      { id: 'none', label: 'None', icon: '⏭️', desc: 'Skip tests' },
    ],
  },
  documentation: {
    label: 'Documentation Level',
    description: 'How detailed should the documentation be?',
    multiSelect: false,
    options: [
      { id: 'comprehensive', label: 'Comprehensive', icon: '📚', desc: 'Full API docs + examples' },
      { id: 'standard', label: 'Standard', icon: '📖', desc: 'README + basic usage' },
      { id: 'minimal', label: 'Minimal', icon: '📄', desc: 'Basic README only' },
    ],
  },
};

/**
 * Build clarification context string for system prompt
 */
export function buildClarificationContext(selections) {
  if (!selections || Object.keys(selections).length === 0) {
    return '';
  }

  let context = 'User Preferences:\n';

  Object.entries(selections).forEach(([category, selected]) => {
    if (!selected || (Array.isArray(selected) && selected.length === 0)) return;

    const categoryData = CLARIFICATION_CATEGORIES[category];
    if (!categoryData) return;

    const selectedLabels = Array.isArray(selected)
      ? selected.map(id => {
          const option = categoryData.options.find(o => o.id === id);
          return option?.label || id;
        }).join(', ')
      : (() => {
          const option = categoryData.options.find(o => o.id === selected);
          return option?.label || selected;
        })();

    context += `- ${categoryData.label}: ${selectedLabels}\n`;
  });

  return context;
}

/**
 * Get category order for display
 */
export const CATEGORY_ORDER = ['purpose', 'features', 'performance', 'testing', 'documentation'];
