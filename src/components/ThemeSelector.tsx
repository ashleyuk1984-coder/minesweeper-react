import React from 'react';
import { Theme } from '../utils/themes';

interface ThemeSelectorProps {
  currentTheme: string;
  availableThemes: Theme[];
  onThemeChange: (themeName: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  availableThemes,
  onThemeChange,
}) => {
  return (
    <div className="theme-selector">
      <label htmlFor="theme-select" className="theme-label">
        🎨 Theme:
      </label>
      <select
        id="theme-select"
        value={currentTheme}
        onChange={(e) => onThemeChange(e.target.value)}
        className="theme-select"
      >
        {availableThemes.map((theme) => (
          <option key={theme.name} value={theme.name}>
            {theme.displayName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSelector;