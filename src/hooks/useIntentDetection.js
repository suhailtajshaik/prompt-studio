import { useState, useEffect, useRef } from 'react';
import { detectIntent } from '../data/intents';

/**
 * Hook that auto-detects user intent from input text with debouncing.
 * Returns the detected intent category, confidence, and auto-selected config.
 */
export function useIntentDetection(text, debounceMs = 300) {
  const [intent, setIntent] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!text || !text.trim()) {
      setIntent(null);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      const detected = detectIntent(text);
      setIntent(detected);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, debounceMs]);

  return intent;
}
