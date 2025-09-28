import { BoardShape, BoardShapeConfig, Coordinate } from '../types';

// Standard rectangular neighbors (8 directions)
const getRectangleNeighbors = (row: number, col: number, rows: number, cols: number): Coordinate[] => {
  const neighbors: Coordinate[] = [];
  
  for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
    for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
      if (r !== row || c !== col) {
        neighbors.push({ row: r, col: c });
      }
    }
  }
  
  return neighbors;
};

// Hexagonal neighbors (6 directions)
const getHexagonNeighbors = (row: number, col: number, rows: number, cols: number): Coordinate[] => {
  const neighbors: Coordinate[] = [];
  
  // In a hexagonal grid, neighbors depend on whether the row is even or odd
  const isEvenRow = row % 2 === 0;
  
  // Define the 6 possible hexagonal directions
  const directions = isEvenRow 
    ? [
        [-1, -1], [-1, 0],  // Top-left, Top-right
        [0, -1],  [0, 1],   // Left, Right
        [1, -1],  [1, 0]    // Bottom-left, Bottom-right
      ]
    : [
        [-1, 0],  [-1, 1],  // Top-left, Top-right
        [0, -1],  [0, 1],   // Left, Right
        [1, 0],   [1, 1]    // Bottom-left, Bottom-right
      ];
  
  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;
    
    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
      neighbors.push({ row: newRow, col: newCol });
    }
  }
  
  return neighbors;
};

// Triangular neighbors (variable, depends on position)
const getTriangleNeighbors = (row: number, col: number, rows: number, cols: number): Coordinate[] => {
  const neighbors: Coordinate[] = [];
  
  // In a triangular grid, each cell has different neighbor patterns
  // This is a simplified version - in reality, triangular grids are quite complex
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];
  
  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;
    
    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
      // Check if the cell exists in the triangular shape
      if (triangleCellExists(newRow, newCol, rows, cols)) {
        neighbors.push({ row: newRow, col: newCol });
      }
    }
  }
  
  return neighbors;
};

// Helper functions for different shape validations
const rectangleCellExists = (row: number, col: number, rows: number, cols: number): boolean => {
  return row >= 0 && row < rows && col >= 0 && col < cols;
};

const hexagonCellExists = (row: number, col: number, rows: number, cols: number): boolean => {
  // Hexagonal shape - creates a hexagon within the rectangular grid
  const centerRow = Math.floor(rows / 2);
  const centerCol = Math.floor(cols / 2);
  const radius = Math.min(centerRow, centerCol);
  
  const distance = Math.abs(row - centerRow) + Math.abs(col - centerCol);
  return distance <= radius;
};

const triangleCellExists = (row: number, col: number, rows: number, cols: number): boolean => {
  // Triangular shape - creates a triangle
  const maxCol = cols - 1;
  const triangleWidth = Math.floor((maxCol * (rows - row)) / rows);
  const startCol = Math.floor((maxCol - triangleWidth) / 2);
  
  return col >= startCol && col <= startCol + triangleWidth;
};

const diamondCellExists = (row: number, col: number, rows: number, cols: number): boolean => {
  const centerRow = Math.floor(rows / 2);
  const centerCol = Math.floor(cols / 2);
  
  const distance = Math.abs(row - centerRow) + Math.abs(col - centerCol);
  const maxDistance = Math.min(centerRow, centerCol);
  
  return distance <= maxDistance;
};

const crossCellExists = (row: number, col: number, rows: number, cols: number): boolean => {
  const centerRow = Math.floor(rows / 2);
  const centerCol = Math.floor(cols / 2);
  const thickness = Math.max(1, Math.floor(Math.min(rows, cols) / 6));
  
  // Horizontal bar
  const inHorizontalBar = row >= centerRow - thickness && row <= centerRow + thickness;
  // Vertical bar
  const inVerticalBar = col >= centerCol - thickness && col <= centerCol + thickness;
  
  return inHorizontalBar || inVerticalBar;
};

const circleCellExists = (row: number, col: number, rows: number, cols: number): boolean => {
  const centerRow = rows / 2;
  const centerCol = cols / 2;
  const radius = Math.min(rows, cols) / 2.5;
  
  const distance = Math.sqrt(
    Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2)
  );
  
  return distance <= radius;
};

// Board shape configurations
export const BOARD_SHAPE_CONFIGS: Record<BoardShape, BoardShapeConfig> = {
  [BoardShape.RECTANGLE]: {
    shape: BoardShape.RECTANGLE,
    name: 'rectangle',
    displayName: '⬜ Rectangle',
    description: 'Classic rectangular Minesweeper board',
    cellExists: rectangleCellExists,
    getNeighbors: getRectangleNeighbors,
    cssClass: 'board-rectangle',
    gridLayout: {
      type: 'rectangle',
    },
  },
  
  [BoardShape.HEXAGON]: {
    shape: BoardShape.HEXAGON,
    name: 'hexagon',
    displayName: '⬢ Hexagon',
    description: 'Hexagonal board with 6-sided cells',
    cellExists: hexagonCellExists,
    getNeighbors: getHexagonNeighbors,
    cssClass: 'board-hexagon',
    gridLayout: {
      type: 'hexagon',
      offsetEven: true,
    },
  },
  
  [BoardShape.TRIANGLE]: {
    shape: BoardShape.TRIANGLE,
    name: 'triangle',
    displayName: '🔺 Triangle',
    description: 'Triangular board shape',
    cellExists: triangleCellExists,
    getNeighbors: getTriangleNeighbors,
    cssClass: 'board-triangle',
    gridLayout: {
      type: 'triangle',
    },
  },
  
  [BoardShape.DIAMOND]: {
    shape: BoardShape.DIAMOND,
    name: 'diamond',
    displayName: '♦️ Diamond',
    description: 'Diamond-shaped board',
    cellExists: diamondCellExists,
    getNeighbors: getRectangleNeighbors,
    cssClass: 'board-diamond',
    gridLayout: {
      type: 'custom',
    },
  },
  
  [BoardShape.CROSS]: {
    shape: BoardShape.CROSS,
    name: 'cross',
    displayName: '✚ Cross',
    description: 'Cross-shaped board',
    cellExists: crossCellExists,
    getNeighbors: getRectangleNeighbors,
    cssClass: 'board-cross',
    gridLayout: {
      type: 'custom',
    },
  },
  
  [BoardShape.CIRCLE]: {
    shape: BoardShape.CIRCLE,
    name: 'circle',
    displayName: '⭕ Circle',
    description: 'Circular board shape',
    cellExists: circleCellExists,
    getNeighbors: getRectangleNeighbors,
    cssClass: 'board-circle',
    gridLayout: {
      type: 'custom',
    },
  },
  
  [BoardShape.CUSTOM]: {
    shape: BoardShape.CUSTOM,
    name: 'custom',
    displayName: '🎨 Custom',
    description: 'User-defined custom shape',
    cellExists: rectangleCellExists, // Default to rectangle
    getNeighbors: getRectangleNeighbors,
    cssClass: 'board-custom',
    gridLayout: {
      type: 'custom',
    },
  },
};

// Utility functions
export const getBoardShapeConfig = (shape: BoardShape): BoardShapeConfig => {
  return BOARD_SHAPE_CONFIGS[shape] || BOARD_SHAPE_CONFIGS[BoardShape.RECTANGLE];
};

export const getAvailableBoardShapes = (): BoardShape[] => {
  return Object.values(BoardShape);
};

export const calculateActiveCells = (rows: number, cols: number, shape: BoardShape): number => {
  const config = getBoardShapeConfig(shape);
  let activeCells = 0;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (config.cellExists(row, col, rows, cols)) {
        activeCells++;
      }
    }
  }
  
  return activeCells;
};

export const adjustMineCountForShape = (originalMines: number, rows: number, cols: number, shape: BoardShape): number => {
  if (shape === BoardShape.RECTANGLE) {
    return originalMines; // No adjustment needed
  }
  
  const totalCells = rows * cols;
  const activeCells = calculateActiveCells(rows, cols, shape);
  const ratio = activeCells / totalCells;
  
  // Adjust mine count proportionally, but ensure at least 1 mine and not more than activeCells - 9
  return Math.max(1, Math.min(Math.floor(originalMines * ratio), activeCells - 9));
};