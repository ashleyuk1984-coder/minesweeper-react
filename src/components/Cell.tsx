import React from 'react';
import { Cell as CellType, CellState } from '../types';

interface CellProps {
  cell: CellType;
  onClick: (row: number, col: number) => void;
  onRightClick: (row: number, col: number) => void;
  onChord: (row: number, col: number) => void;
}

const Cell: React.FC<CellProps> = ({ cell, onClick, onRightClick, onChord }) => {
  const handleClick = () => {
    onClick(cell.row, cell.col);
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onRightClick(cell.row, cell.col);
  };

  const handleMiddleClick = (e: React.MouseEvent) => {
    if (e.button === 1) { // Middle mouse button
      e.preventDefault();
      onChord(cell.row, cell.col);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Handle both left and right buttons pressed simultaneously
    if (e.buttons === 3) { // Both left (1) and right (2) buttons = 3
      e.preventDefault();
      onChord(cell.row, cell.col);
    }
  };

  const getCellContent = () => {
    if (cell.state === CellState.FLAGGED) {
      return '🚩';
    }
    
    if (cell.state === CellState.REVEALED) {
      if (cell.isMine) {
        return '💣';
      }
      
      if (cell.neighborMines > 0) {
        return cell.neighborMines.toString();
      }
    }
    
    return '';
  };

  const getCellClass = () => {
    let baseClass = 'cell';
    
    if (cell.state === CellState.REVEALED) {
      baseClass += ' revealed';
      if (cell.isMine) {
        baseClass += ' mine';
      } else if (cell.neighborMines > 0) {
        baseClass += ` number-${cell.neighborMines}`;
      }
    } else {
      baseClass += ' hidden';
      if (cell.state === CellState.FLAGGED) {
        baseClass += ' flagged';
      }
    }
    
    return baseClass;
  };

  return (
    <button
      className={getCellClass()}
      onClick={handleClick}
      onContextMenu={handleRightClick}
      onMouseDown={handleMouseDown}
      onAuxClick={handleMiddleClick}
      disabled={false} // Allow chording on revealed cells
    >
      {getCellContent()}
    </button>
  );
};

export default Cell;