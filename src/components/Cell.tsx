import React, { useRef, useEffect } from 'react';
import { Cell as CellType, CellState } from '../types';
import { audioSystem } from '../utils/audioSystem';
import { particleSystem } from '../utils/particleSystem';

interface CellProps {
  cell: CellType;
  onClick: (row: number, col: number) => void;
  onRightClick: (row: number, col: number) => void;
  onChord: (row: number, col: number) => void;
}

const Cell: React.FC<CellProps> = ({ cell, onClick, onRightClick, onChord }) => {
  const cellRef = useRef<HTMLButtonElement>(null);
  const prevStateRef = useRef(cell.state);
  
  // Track state changes for particle effects
  useEffect(() => {
    if (prevStateRef.current !== cell.state && cellRef.current) {
      const center = particleSystem.getElementCenter(cellRef.current);
      
      // Trigger effects based on state change
      if (cell.state === CellState.REVEALED) {
        if (cell.isMine) {
          // Explosion effect for mines
          particleSystem.explosion(center.x, center.y, 1.5);
        } else {
          // Dust effect for normal reveals
          particleSystem.dust(center.x, center.y, 0.8);
        }
      }
    }
    
    prevStateRef.current = cell.state;
  }, [cell.state, cell.isMine]);

  const handleClick = () => {
    // Only prevent clicks on revealed cells if they don't have numbers (for chording)
    if (cell.state === CellState.REVEALED && cell.neighborMines === 0) {
      return; // Don't allow normal clicks on revealed empty cells
    }
    onClick(cell.row, cell.col);
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Add particle effect for flagging
    if (cellRef.current && cell.state === CellState.HIDDEN) {
      const center = particleSystem.getElementCenter(cellRef.current);
      particleSystem.dust(center.x, center.y, 0.3);
    }
    
    // Play appropriate sound based on current state
    if (cell.state === CellState.HIDDEN) {
      audioSystem.playFlag();
    } else if (cell.state === CellState.FLAGGED) {
      audioSystem.playQuestion();
    } else if (cell.state === CellState.QUESTIONED) {
      audioSystem.playCellClick();
    }
    
    onRightClick(cell.row, cell.col);
  };

  const handleMiddleClick = (e: React.MouseEvent) => {
    if (e.button === 1) { // Middle mouse button
      e.preventDefault();
      audioSystem.playChord();
      onChord(cell.row, cell.col);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Handle both left and right buttons pressed simultaneously
    if (e.buttons === 3) { // Both left (1) and right (2) buttons = 3
      e.preventDefault();
      audioSystem.playChord();
      onChord(cell.row, cell.col);
    }
  };

  const getCellContent = () => {
    if (cell.state === CellState.FLAGGED) {
      return '🚩';
    }
    
    if (cell.state === CellState.QUESTIONED) {
      return '❓';
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
      } else if (cell.state === CellState.QUESTIONED) {
        baseClass += ' questioned';
      }
    }
    
    return baseClass;
  };

  return (
    <button
      ref={cellRef}
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