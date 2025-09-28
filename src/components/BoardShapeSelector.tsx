import React from 'react';
import { BoardShape } from '../types';
import { BOARD_SHAPE_CONFIGS } from '../utils/boardShapes';

interface BoardShapeSelectorProps {
  currentShape: BoardShape;
  onShapeChange: (shape: BoardShape) => void;
  disabled?: boolean;
}

export const BoardShapeSelector: React.FC<BoardShapeSelectorProps> = ({
  currentShape,
  onShapeChange,
  disabled = false,
}) => {
  const handleShapeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newShape = event.target.value as BoardShape;
    onShapeChange(newShape);
  };

  return (
    <div className="board-shape-selector">
      <label htmlFor="board-shape-select" className="shape-label">
        Board Shape:
      </label>
      <select
        id="board-shape-select"
        value={currentShape}
        onChange={handleShapeChange}
        disabled={disabled}
        className="shape-select"
        title="Choose the shape of the minefield"
      >
        {Object.values(BoardShape).map((shape) => {
          const config = BOARD_SHAPE_CONFIGS[shape];
          return (
            <option key={shape} value={shape}>
              {config.displayName}
            </option>
          );
        })}
      </select>
      <div className="shape-description">
        {BOARD_SHAPE_CONFIGS[currentShape].description}
      </div>
    </div>
  );
};