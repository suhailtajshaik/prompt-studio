import { useState, useCallback } from 'react';

/**
 * Hook for managing smart clarification answers
 */
export function useSmartClarifications() {
  const [answers, setAnswers] = useState({});

  const answerQuestion = useCallback((questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  }, []);

  const clearAnswers = useCallback(() => {
    setAnswers({});
  }, []);

  const getAnswerText = useCallback((questionId, questions) => {
    const answer = answers[questionId];
    if (!answer || !questions) return '';

    for (const question of questions) {
      if (question.id === questionId) {
        const option = question.options?.find(opt => opt.id === answer);
        return option?.label || answer;
      }
    }
    return '';
  }, [answers]);

  return {
    answers,
    answerQuestion,
    clearAnswers,
    getAnswerText,
    hasAnswers: Object.keys(answers).length > 0,
  };
}
