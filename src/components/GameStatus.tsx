import React from 'react';
import { GameState, Difficulty } from '../types';

interface GameStatusProps {
  gameState: GameState;
  minesLeft: number;
  timeElapsed: number;
  difficulty: Difficulty;
  onReset: () => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

const GameStatus: React.FC<GameStatusProps> = ({
  gameState,
  minesLeft,
  timeElapsed,
  difficulty,
  onReset,
  onDifficultyChange,
}) => {
  const getGameStatusMessage = () => {
    switch (gameState) {
      case GameState.WON:
        return '🎉 You Won!';
      case GameState.LOST:
        return '💥 Game Over';
      case GameState.PLAYING:
        return '🎮 Playing...';
      default:
        return '🎯 Ready to Play';
    }
  };

  const getStatusEmoji = () => {
    switch (gameState) {
      case GameState.WON:
        return '😎';
      case GameState.LOST:
        return '😵';
      case GameState.PLAYING:
        return '🙂';
      default:
        return '🙂';
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyDisplayName = (diff: Difficulty) => {
    switch (diff) {
      case Difficulty.EASY:
        return 'Easy';
      case Difficulty.MEDIUM:
        return 'Medium';
      case Difficulty.HARD:
        return 'Hard';
      case Difficulty.CUSTOM:
        return 'Custom';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="game-status">
      <div className="game-info">
        <div className="status-message">
          {getGameStatusMessage()}
        </div>
        
        <div className="game-stats">
          <div className="stat-item">
            <span className="stat-icon">💣</span>
            <span className="stat-value">{minesLeft}</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-icon">⏱️</span>
            <span className="stat-value">{formatTime(timeElapsed)}</span>
          </div>
        </div>
      </div>

      <div className="game-controls">
        <button
          className={`reset-button ${getStatusEmoji()}`}
          onClick={onReset}
          title="New Game"
        >
          {getStatusEmoji()}
        </button>

        <div className="difficulty-selector">
          <label htmlFor="difficulty">Difficulty:</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
          >
            <option value={Difficulty.EASY}>Easy (9×9, 10 mines)</option>
            <option value={Difficulty.MEDIUM}>Medium (16×16, 40 mines)</option>
            <option value={Difficulty.HARD}>Hard (16×30, 99 mines)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default GameStatus;