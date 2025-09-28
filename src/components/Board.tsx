import React from 'react';
import { Cell as CellType, BoardShape } from '../types';
import { getBoardShapeConfig } from '../utils/boardShapes';
import Cell from './Cell';

interface BoardProps {
  board: CellType[][];
  onCellClick: (row: number, col: number) => void;
  onCellRightClick: (row: number, col: number) => void;
  onCellChord: (row: number, col: number) => void;
  animationsEnabled?: boolean;
  boardShape?: BoardShape;
}

const Board: React.FC<BoardProps> = ({ 
  board, 
  onCellClick, 
  onCellRightClick, 
  onCellChord, 
  animationsEnabled = true, 
  boardShape = BoardShape.RECTANGLE 
}) => {
  if (!board || board.length === 0) {
    return <div className="board-loading">Loading...</div>;
  }

  const shapeConfig = getBoardShapeConfig(boardShape);

  return (
    <div 
      className={`board ${shapeConfig.cssClass}`}
      style={{
        gridTemplateColumns: `repeat(${board[0].length}, 1fr)`,
        gridTemplateRows: `repeat(${board.length}, 1fr)`,
      }}
    >
      {board.map((row) =>
        row.map((cell) => {
          // Skip rendering cells that don't exist in this shape
          const cellExists = shapeConfig.cellExists(cell.row, cell.col, board.length, board[0].length);
          
          return (
            <Cell
              key={`${cell.row}-${cell.col}`}
              cell={cell}
              onClick={onCellClick}
              onRightClick={onCellRightClick}
              onChord={onCellChord}
              animationsEnabled={animationsEnabled}
              exists={cellExists}
            />
          );
        })
      )}
    </div>
  );
};

export default Board;