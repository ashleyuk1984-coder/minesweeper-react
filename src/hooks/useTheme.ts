import { useState, useEffect } from 'react';
import { Theme, themes, getTheme, applyTheme } from '../utils/themes';

const THEME_STORAGE_KEY = 'minesweeper-theme';

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
    } catch {
      return 'light';
    }
  });

  const changeTheme = (themeName: string) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, themeName);
      } catch (error) {
        console.warn('Failed to save theme preference:', error);
      }
    }
  };

  // Apply theme when it changes
  useEffect(() => {
    const theme = getTheme(currentTheme);
    applyTheme(theme);
  }, [currentTheme]);

  return {
    currentTheme,
    theme: getTheme(currentTheme),
    availableThemes: Object.values(themes),
    changeTheme,
  };
};