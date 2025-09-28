import React, { useState, useEffect } from 'react';
import { Difficulty, BoardShape, DIFFICULTY_CONFIGS } from '../types';
import { useMinesweeper } from '../hooks/useMinesweeper';
import { useTheme } from '../hooks/useTheme';
import Board from './Board';
import GameStatus from './GameStatus';
import Statistics from './Statistics';
import ThemeSelector from './ThemeSelector';
import AudioControls from './AudioControls';
import { AnimationControls } from './AnimationControls';
import { BoardShapeSelector } from './BoardShapeSelector';
import { cellAnimationManager, animationUtils } from '../utils/animationSystem';

const Game: React.FC = () => {
  const {
    board,
    gameState,
    minesLeft,
    timeElapsed,
    difficulty,
    statistics,
    onCellClick,
    onCellRightClick,
    onCellChord,
    resetGame,
    setDifficulty,
    resetStatistics,
  } = useMinesweeper(Difficulty.EASY);

  const [showStats, setShowStats] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    // Check for reduced motion preference and localStorage
    const savedPreference = localStorage.getItem('minesweeper-animations');
    if (savedPreference !== null) {
      return JSON.parse(savedPreference);
    }
    // Default to false if user prefers reduced motion
    return !animationUtils.respectsReducedMotion();
  });
  const [boardShape, setBoardShape] = useState<BoardShape>(() => {
    const savedShape = localStorage.getItem('minesweeper-boardShape');
    return savedShape ? (savedShape as BoardShape) : BoardShape.RECTANGLE;
  });

  const { currentTheme, availableThemes, changeTheme } = useTheme();
  
  // Save animation preference to localStorage
  useEffect(() => {
    localStorage.setItem('minesweeper-animations', JSON.stringify(animationsEnabled));
    cellAnimationManager.updateSettings({ enabled: animationsEnabled });
  }, [animationsEnabled]);
  
  // Save board shape preference to localStorage
  useEffect(() => {
    localStorage.setItem('minesweeper-boardShape', boardShape);
  }, [boardShape]);

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
  };
  
  const handleBoardShapeChange = (newShape: BoardShape) => {
    setBoardShape(newShape);
    // Update the config with the new board shape and reset the game
    const newConfig = { ...DIFFICULTY_CONFIGS[difficulty], boardShape: newShape };
    setDifficulty(difficulty, newConfig);
  };

  return (
    <div className="game">
      <header className="game-header">
        <h1>💣 Minesweeper</h1>
        <p>Left-click to reveal • Right-click to cycle Flag→?→Clear • Middle-click/both buttons to chord</p>
      </header>

        <div className="game-controls-row">
          <GameStatus
            gameState={gameState}
            minesLeft={minesLeft}
            timeElapsed={timeElapsed}
            difficulty={difficulty}
            onReset={resetGame}
            onDifficultyChange={handleDifficultyChange}
          />
          <div className="secondary-controls">
            <ThemeSelector
              currentTheme={currentTheme}
              availableThemes={availableThemes}
              onThemeChange={changeTheme}
            />
            <BoardShapeSelector
              currentShape={boardShape}
              onShapeChange={handleBoardShapeChange}
              disabled={gameState === 'playing'}
            />
            <AudioControls />
            <AnimationControls
              animationsEnabled={animationsEnabled}
              onToggleAnimations={setAnimationsEnabled}
            />
          </div>
        </div>

      <div className="game-board-container">
        <Board
          board={board}
          onCellClick={onCellClick}
          onCellRightClick={onCellRightClick}
          onCellChord={onCellChord}
          animationsEnabled={animationsEnabled}
          boardShape={boardShape}
        />
      </div>

      <footer className="game-footer">
        <div className="footer-content">
          <p>Made with React & TypeScript</p>
          <button 
            className="stats-button"
            onClick={() => setShowStats(true)}
            title="View Statistics"
          >
            📊 Stats
          </button>
        </div>
      </footer>

      <Statistics
        statistics={statistics}
        isVisible={showStats}
        onClose={() => setShowStats(false)}
        onReset={() => {
          resetStatistics();
          setShowStats(false);
        }}
      />
    </div>
  );
};

export default Game;