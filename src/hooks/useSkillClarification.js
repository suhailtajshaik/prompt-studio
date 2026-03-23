import { useState, useCallback } from 'react';
import { CLARIFICATION_CATEGORIES } from '../data/clarificationOptions';

/**
 * Hook for managing skill generation clarification selections
 */
export function useSkillClarification() {
  const [selections, setSelections] = useState({});
  const [showClarification, setShowClarification] = useState(false);

  const selectOption = useCallback((category, optionId) => {
    const categoryData = CLARIFICATION_CATEGORIES[category];
    if (!categoryData) return;

    setSelections((prev) => {
      if (categoryData.multiSelect) {
        // For multi-select, toggle the option
        const current = prev[category] || [];
        const updated = current.includes(optionId)
          ? current.filter(id => id !== optionId)
          : [...current, optionId];
        return { ...prev, [category]: updated };
      } else {
        // For single select, replace the option
        return { ...prev, [category]: optionId };
      }
    });
  }, []);

  const clearCategory = useCallback((category) => {
    setSelections((prev) => {
      const updated = { ...prev };
      delete updated[category];
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSelections({});
  }, []);

  const isSelected = useCallback((category, optionId) => {
    const selected = selections[category];
    if (!selected) return false;
    
    if (Array.isArray(selected)) {
      return selected.includes(optionId);
    }
    return selected === optionId;
  }, [selections]);

  const hasSelections = useCallback(() => {
    return Object.keys(selections).length > 0;
  }, [selections]);

  return {
    selections,
    showClarification,
    setShowClarification,
    selectOption,
    clearCategory,
    clearAll,
    isSelected,
    hasSelections,
  };
}
