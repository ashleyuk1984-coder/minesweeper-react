import React from 'react';
import { Difficulty } from '../types';
import { useMinesweeper } from '../hooks/useMinesweeper';
import Board from './Board';
import GameStatus from './GameStatus';

const Game: React.FC = () => {
  const {
    board,
    gameState,
    minesLeft,
    timeElapsed,
    difficulty,
    onCellClick,
    onCellRightClick,
    onCellChord,
    resetGame,
    setDifficulty,
  } = useMinesweeper(Difficulty.EASY);

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
  };

  return (
    <div className="game">
      <header className="game-header">
        <h1>💣 Minesweeper</h1>
        <p>Left-click to reveal, right-click to flag, middle-click/both buttons to chord</p>
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
        <p>Made with React & TypeScript</p>
      </footer>
    </div>
  );
};

export default Game;