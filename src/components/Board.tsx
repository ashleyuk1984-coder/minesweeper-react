import React from 'react';
import { Cell as CellType } from '../types';
import Cell from './Cell';

interface BoardProps {
  board: CellType[][];
  onCellClick: (row: number, col: number) => void;
  onCellRightClick: (row: number, col: number) => void;
  onCellChord: (row: number, col: number) => void;
  animationsEnabled?: boolean;
}

const Board: React.FC<BoardProps> = ({ board, onCellClick, onCellRightClick, onCellChord, animationsEnabled = true }) => {
  if (!board || board.length === 0) {
    return <div className="board-loading">Loading...</div>;
  }

  return (
    <div 
      className="board"
      style={{
        gridTemplateColumns: `repeat(${board[0].length}, 1fr)`,
        gridTemplateRows: `repeat(${board.length}, 1fr)`,
      }}
    >
      {board.map((row) =>
        row.map((cell) => (
          <Cell
            key={`${cell.row}-${cell.col}`}
            cell={cell}
            onClick={onCellClick}
            onRightClick={onCellRightClick}
            onChord={onCellChord}
            animationsEnabled={animationsEnabled}
          />
        ))
      )}
    </div>
  );
};

export default Board;