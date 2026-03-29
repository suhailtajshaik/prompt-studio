import { useState, useEffect, useCallback } from 'react';
import { getTheme, applyTheme, restoreTheme, DARK_PAIRS } from '../data/themes';

export function useTheme() {
  const [themeId, setThemeId] = useState(() => restoreTheme());

  // Re-apply whenever themeId changes
  useEffect(() => {
    applyTheme(themeId);
  }, [themeId]);

  const currentTheme = getTheme(themeId);
  const dark = currentTheme.dark;

  // Toggle between the light ↔ dark variant of the same family
  const setDark = useCallback(() => {
    setThemeId((prev) => DARK_PAIRS[prev] || prev);
  }, []);

  return [dark, setDark, themeId, setThemeId, currentTheme];
}
