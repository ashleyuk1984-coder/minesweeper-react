export interface Theme {
  name: string;
  displayName: string;
  colors: {
    // Background and container
    background: string;
    gameBackground: string;
    cardBackground: string;
    boardBackground: string;
    
    // Text colors
    primaryText: string;
    secondaryText: string;
    titleGradient: string;
    
    // Cell colors
    hiddenCell: string;
    hiddenCellHover: string;
    revealedCell: string;
    flaggedCell: string;
    questionedCell: string;
    mineCell: string;
    
    // Number colors
    number1: string;
    number2: string;
    number3: string;
    number4: string;
    number5: string;
    number6: string;
    number7: string;
    number8: string;
    
    // UI elements
    buttonGradient: string;
    buttonHover: string;
    resetButton: string;
    resetButtonHover: string;
    
    // Borders and shadows
    borderColor: string;
    shadowColor: string;
    
    // Animation colors
    rippleColor: string;
    hoverGlow: string;
    cellShadowHover: string;
  };
}

export const themes: Record<string, Theme> = {
  light: {
    name: 'light',
    displayName: '☀️ Light',
    colors: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      gameBackground: 'rgba(255, 255, 255, 0.95)',
      cardBackground: 'linear-gradient(145deg, #f8f9fa, #ffffff)',
      boardBackground: 'linear-gradient(145deg, #95a5a6, #7f8c8d)',
      
      primaryText: '#2c3e50',
      secondaryText: '#7f8c8d',
      titleGradient: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
      
      hiddenCell: 'linear-gradient(145deg, #e1e8ed, #d3dae1)',
      hiddenCellHover: 'linear-gradient(145deg, #d3dae1, #c5cdd4)',
      revealedCell: '#ffffff',
      flaggedCell: 'linear-gradient(145deg, #ffeaa7, #fdcb6e)',
      questionedCell: 'linear-gradient(145deg, #a8e6cf, #88d8a3)',
      mineCell: 'linear-gradient(145deg, #e74c3c, #c0392b)',
      
      number1: '#1e90ff',
      number2: '#32cd32',
      number3: '#ff4500',
      number4: '#9932cc',
      number5: '#dc143c',
      number6: '#20b2aa',
      number7: '#2c3e50',
      number8: '#696969',
      
      buttonGradient: 'linear-gradient(145deg, #3498db, #2980b9)',
      buttonHover: 'linear-gradient(145deg, #2980b9, #21618c)',
      resetButton: 'linear-gradient(145deg, #3498db, #2980b9)',
      resetButtonHover: 'linear-gradient(145deg, #2980b9, #21618c)',
      
      borderColor: 'rgba(255, 255, 255, 0.3)',
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      
      rippleColor: 'rgba(52, 152, 219, 0.6)',
      hoverGlow: 'rgba(52, 152, 219, 0.3)',
      cellShadowHover: 'rgba(0, 0, 0, 0.18)',
    },
  },
  dark: {
    name: 'dark',
    displayName: '🌙 Dark',
    colors: {
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      gameBackground: 'rgba(20, 20, 30, 0.95)',
      cardBackground: 'linear-gradient(145deg, #2c2c3e, #1e1e2e)',
      boardBackground: 'linear-gradient(145deg, #3c3c4e, #2c2c3e)',
      
      primaryText: '#e8eaed',
      secondaryText: '#9aa0a6',
      titleGradient: 'linear-gradient(135deg, #64b5f6, #81c784, #ffb74d)',
      
      hiddenCell: 'linear-gradient(145deg, #4a4a5e, #3a3a4e)',
      hiddenCellHover: 'linear-gradient(145deg, #5a5a6e, #4a4a5e)',
      revealedCell: '#2a2a3a',
      flaggedCell: 'linear-gradient(145deg, #ff7043, #f4511e)',
      questionedCell: 'linear-gradient(145deg, #66bb6a, #4caf50)',
      mineCell: 'linear-gradient(145deg, #f44336, #d32f2f)',
      
      number1: '#64b5f6',
      number2: '#81c784',
      number3: '#ffb74d',
      number4: '#ba68c8',
      number5: '#f06292',
      number6: '#4db6ac',
      number7: '#90a4ae',
      number8: '#a1887f',
      
      buttonGradient: 'linear-gradient(145deg, #5c6bc0, #3f51b5)',
      buttonHover: 'linear-gradient(145deg, #3f51b5, #303f9f)',
      resetButton: 'linear-gradient(145deg, #5c6bc0, #3f51b5)',
      resetButtonHover: 'linear-gradient(145deg, #3f51b5, #303f9f)',
      
      borderColor: 'rgba(255, 255, 255, 0.1)',
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      
      rippleColor: 'rgba(92, 107, 192, 0.6)',
      hoverGlow: 'rgba(92, 107, 192, 0.4)',
      cellShadowHover: 'rgba(0, 0, 0, 0.4)',
    },
  },
  neon: {
    name: 'neon',
    displayName: '⚡ Neon',
    colors: {
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a1a0a 100%)',
      gameBackground: 'rgba(10, 10, 15, 0.95)',
      cardBackground: 'linear-gradient(145deg, #1a1a25, #0f0f1a)',
      boardBackground: 'linear-gradient(145deg, #2a2a35, #1a1a25)',
      
      primaryText: '#00ff88',
      secondaryText: '#888899',
      titleGradient: 'linear-gradient(135deg, #00ff88, #ff0088, #0088ff)',
      
      hiddenCell: 'linear-gradient(145deg, #2a2a35, #1a1a25)',
      hiddenCellHover: 'linear-gradient(145deg, #3a3a45, #2a2a35)',
      revealedCell: '#0f0f1a',
      flaggedCell: 'linear-gradient(145deg, #ff0088, #cc0066)',
      questionedCell: 'linear-gradient(145deg, #00ff88, #00cc66)',
      mineCell: 'linear-gradient(145deg, #ff4444, #ff0000)',
      
      number1: '#00aaff',
      number2: '#00ff44',
      number3: '#ff4400',
      number4: '#aa00ff',
      number5: '#ff0044',
      number6: '#00ffaa',
      number7: '#ffaa00',
      number8: '#ff00aa',
      
      buttonGradient: 'linear-gradient(145deg, #00ff88, #00cc66)',
      buttonHover: 'linear-gradient(145deg, #00cc66, #009944)',
      resetButton: 'linear-gradient(145deg, #ff0088, #cc0066)',
      resetButtonHover: 'linear-gradient(145deg, #cc0066, #aa0044)',
      
      borderColor: 'rgba(0, 255, 136, 0.3)',
      shadowColor: 'rgba(0, 255, 136, 0.2)',
      
      rippleColor: 'rgba(0, 255, 136, 0.8)',
      hoverGlow: 'rgba(0, 255, 136, 0.4)',
      cellShadowHover: 'rgba(0, 255, 136, 0.3)',
    },
  },
  ocean: {
    name: 'ocean',
    displayName: '🌊 Ocean',
    colors: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #2196f3 100%)',
      gameBackground: 'rgba(240, 248, 255, 0.95)',
      cardBackground: 'linear-gradient(145deg, #e3f2fd, #bbdefb)',
      boardBackground: 'linear-gradient(145deg, #81d4fa, #4fc3f7)',
      
      primaryText: '#0d47a1',
      secondaryText: '#1976d2',
      titleGradient: 'linear-gradient(135deg, #2196f3, #03a9f4, #00bcd4)',
      
      hiddenCell: 'linear-gradient(145deg, #b3e5fc, #81d4fa)',
      hiddenCellHover: 'linear-gradient(145deg, #81d4fa, #4fc3f7)',
      revealedCell: '#ffffff',
      flaggedCell: 'linear-gradient(145deg, #ff7043, #ff5722)',
      questionedCell: 'linear-gradient(145deg, #4db6ac, #009688)',
      mineCell: 'linear-gradient(145deg, #f44336, #d32f2f)',
      
      number1: '#1976d2',
      number2: '#388e3c',
      number3: '#f57c00',
      number4: '#7b1fa2',
      number5: '#d32f2f',
      number6: '#00796b',
      number7: '#455a64',
      number8: '#5d4037',
      
      buttonGradient: 'linear-gradient(145deg, #2196f3, #1976d2)',
      buttonHover: 'linear-gradient(145deg, #1976d2, #1565c0)',
      resetButton: 'linear-gradient(145deg, #00bcd4, #0097a7)',
      resetButtonHover: 'linear-gradient(145deg, #0097a7, #00838f)',
      
      borderColor: 'rgba(255, 255, 255, 0.4)',
      shadowColor: 'rgba(33, 150, 243, 0.2)',
      
      rippleColor: 'rgba(33, 150, 243, 0.6)',
      hoverGlow: 'rgba(33, 150, 243, 0.3)',
      cellShadowHover: 'rgba(33, 150, 243, 0.2)',
    },
  },
};

export const getTheme = (themeName: string): Theme => {
  return themes[themeName] || themes.light;
};

export const applyTheme = (theme: Theme): void => {
  const root = document.documentElement;
  
  // Apply CSS custom properties
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });
};