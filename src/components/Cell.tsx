import React from 'react';
import { Cell as CellType, CellState } from '../types';

interface CellProps {
  cell: CellType;
  onClick: (row: number, col: number) => void;
  onRightClick: (row: number, col: number) => void;
}

const Cell: React.FC<CellProps> = ({ cell, onClick, onRightClick }) => {
  const handleClick = () => {
    onClick(cell.row, cell.col);
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onRightClick(cell.row, cell.col);
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
      disabled={cell.state === CellState.REVEALED}
    >
      {getCellContent()}
    </button>
  );
};

export default Cell;