import React, { useState } from 'react';
import { Difficulty } from '../types';
import { useMinesweeper } from '../hooks/useMinesweeper';
import Board from './Board';
import GameStatus from './GameStatus';
import Statistics from './Statistics';

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

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
  };

  return (
    <div className="game">
      <header className="game-header">
        <h1>💣 Minesweeper</h1>
        <p>Left-click to reveal • Right-click to cycle Flag→?→Clear • Middle-click/both buttons to chord</p>
      </header>

      <GameStatus
        gameState={gameState}
        minesLeft={minesLeft}
        timeElapsed={timeElapsed}
        difficulty={difficulty}
        onReset={resetGame}
        onDifficultyChange={handleDifficultyChange}
      />

      <div className="game-board-container">
        <Board
          board={board}
          onCellClick={onCellClick}
          onCellRightClick={onCellRightClick}
          onCellChord={onCellChord}
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