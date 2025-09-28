import { Cell, CellState, GameState, GameConfig, BoardShape } from '../types';
import { getBoardShapeConfig, adjustMineCountForShape } from './boardShapes';

export const createEmptyBoard = (rows: number, cols: number, boardShape: BoardShape = BoardShape.RECTANGLE): Cell[][] => {
  const shapeConfig = getBoardShapeConfig(boardShape);
  
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => {
      const exists = shapeConfig.cellExists(row, col, rows, cols);
      return {
        isMine: false,
        state: CellState.HIDDEN,
        neighborMines: 0,
        row,
        col,
        exists,
      };
    })
  );
};

export const placeMines = (board: Cell[][], mineCount: number, excludeRow?: number, excludeCol?: number, boardShape: BoardShape = BoardShape.RECTANGLE): Cell[][] => {
  const rows = board.length;
  const cols = board[0].length;
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const shapeConfig = getBoardShapeConfig(boardShape);
  
  let minesPlaced = 0;
  const positions: Array<{ row: number; col: number }> = [];
  
  // Generate all possible positions (only for existing cells)
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Skip non-existent cells in the shape
      if (!shapeConfig.cellExists(row, col, rows, cols)) {
        continue;
      }
      
      if (excludeRow !== undefined && excludeCol !== undefined) {
        // Don't place mines on the first clicked cell or its neighbors
        const neighbors = shapeConfig.getNeighbors(excludeRow, excludeCol, rows, cols);
        const isFirstClickOrNeighbor = (row === excludeRow && col === excludeCol) ||
          neighbors.some(n => n.row === row && n.col === col);
        
        if (isFirstClickOrNeighbor) {
          continue;
        }
      }
      positions.push({ row, col });
    }
  }
  
  // Shuffle and select mine positions
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  
  // Place mines
  for (let i = 0; i < Math.min(mineCount, positions.length); i++) {
    const { row, col } = positions[i];
    newBoard[row][col].isMine = true;
    minesPlaced++;
  }
  
  return newBoard;
};

export const calculateNeighborMines = (board: Cell[][], boardShape: BoardShape = BoardShape.RECTANGLE): Cell[][] => {
  const rows = board.length;
  const cols = board[0].length;
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const shapeConfig = getBoardShapeConfig(boardShape);
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Skip non-existent cells
      if (!shapeConfig.cellExists(row, col, rows, cols)) {
        continue;
      }
      
      if (!newBoard[row][col].isMine) {
        let count = 0;
        
        // Use shape-specific neighbor calculation
        const neighbors = shapeConfig.getNeighbors(row, col, rows, cols);
        
        for (const neighbor of neighbors) {
          if (shapeConfig.cellExists(neighbor.row, neighbor.col, rows, cols) &&
              newBoard[neighbor.row][neighbor.col].isMine) {
            count++;
          }
        }
        
        newBoard[row][col].neighborMines = count;
      }
    }
  }
  
  return newBoard;
};

export const revealCell = (board: Cell[][], row: number, col: number, boardShape: BoardShape = BoardShape.RECTANGLE): Cell[][] => {
  const rows = board.length;
  const cols = board[0].length;
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const shapeConfig = getBoardShapeConfig(boardShape);
  
  if (row < 0 || row >= rows || col < 0 || col >= cols) {
    return newBoard;
  }
  
  // Check if cell exists in this shape
  if (!shapeConfig.cellExists(row, col, rows, cols)) {
    return newBoard;
  }
  
  const cell = newBoard[row][col];
  
  if (cell.state !== CellState.HIDDEN) {
    return newBoard;
  }
  
  cell.state = CellState.REVEALED;
  
  // If it's an empty cell (no neighboring mines), reveal all neighbors
  if (!cell.isMine && cell.neighborMines === 0) {
    const neighbors = shapeConfig.getNeighbors(row, col, rows, cols);
    
    for (const neighbor of neighbors) {
      if (shapeConfig.cellExists(neighbor.row, neighbor.col, rows, cols)) {
        const neighborCell = newBoard[neighbor.row][neighbor.col];
        if (neighborCell.state === CellState.HIDDEN) {
          const updatedBoard = revealCell(newBoard, neighbor.row, neighbor.col, boardShape);
          // Copy the updated state back
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              newBoard[r][c] = updatedBoard[r][c];
            }
          }
        }
      }
    }
  }
  
  return newBoard;
};

export const toggleFlag = (board: Cell[][], row: number, col: number): Cell[][] => {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const cell = newBoard[row][col];
  
  if (cell.state === CellState.REVEALED) {
    return newBoard;
  }
  
  // Cycle: HIDDEN → FLAGGED → QUESTIONED → HIDDEN
  switch (cell.state) {
    case CellState.HIDDEN:
      cell.state = CellState.FLAGGED;
      break;
    case CellState.FLAGGED:
      cell.state = CellState.QUESTIONED;
      break;
    case CellState.QUESTIONED:
      cell.state = CellState.HIDDEN;
      break;
    default:
      cell.state = CellState.FLAGGED;
  }
  
  return newBoard;
};

export const checkGameState = (board: Cell[][], config: GameConfig): GameState => {
  let revealedCells = 0;
  let flaggedMines = 0;
  let totalActiveCells = 0;
  
  const boardShape = config.boardShape || BoardShape.RECTANGLE;
  const shapeConfig = getBoardShapeConfig(boardShape);
  
  for (let row = 0; row < config.rows; row++) {
    for (let col = 0; col < config.cols; col++) {
      // Only count cells that exist in this shape
      if (!shapeConfig.cellExists(row, col, config.rows, config.cols)) {
        continue;
      }
      
      totalActiveCells++;
      const cell = board[row][col];
      
      if (cell.state === CellState.REVEALED) {
        if (cell.isMine) {
          return GameState.LOST;
        }
        revealedCells++;
      }
      
      if (cell.state === CellState.FLAGGED && cell.isMine) {
        flaggedMines++;
      }
    }
  }
  
  // Adjust mine count for the shape
  const adjustedMines = adjustMineCountForShape(config.mines, config.rows, config.cols, boardShape);
  
  // Win condition: all non-mine cells are revealed
  if (revealedCells === totalActiveCells - adjustedMines) {
    return GameState.WON;
  }
  
  return GameState.PLAYING;
};

export const getMinesLeft = (board: Cell[][], totalMines: number): number => {
  let flaggedCells = 0;
  
  for (const row of board) {
    for (const cell of row) {
      if (cell.state === CellState.FLAGGED) {
        flaggedCells++;
      }
    }
  }
  
  return totalMines - flaggedCells;
};

export const revealAllMines = (board: Cell[][]): Cell[][] => {
  return board.map(row =>
    row.map(cell => ({
      ...cell,
      state: cell.isMine ? CellState.REVEALED : cell.state,
    }))
  );
};

// Auto-flag all remaining mines when game is won
export const flagRemainingMines = (board: Cell[][]): Cell[][] => {
  return board.map(row =>
    row.map(cell => ({
      ...cell,
      state: cell.isMine && (cell.state === CellState.HIDDEN || cell.state === CellState.QUESTIONED) 
        ? CellState.FLAGGED 
        : cell.state,
    }))
  );
};

// Chording: reveal all unflagged neighbors if flagged count matches the number
export const chordReveal = (board: Cell[][], row: number, col: number, boardShape: BoardShape = BoardShape.RECTANGLE): Cell[][] => {
  const rows = board.length;
  const cols = board[0].length;
  let newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const shapeConfig = getBoardShapeConfig(boardShape);
  
  if (row < 0 || row >= rows || col < 0 || col >= cols) {
    return newBoard;
  }
  
  // Check if cell exists in this shape
  if (!shapeConfig.cellExists(row, col, rows, cols)) {
    return newBoard;
  }
  
  const cell = newBoard[row][col];
  
  // Only chord on revealed cells with numbers
  if (cell.state !== CellState.REVEALED || cell.isMine || cell.neighborMines === 0) {
    return newBoard;
  }
  
  // Count flagged neighbors using shape-specific neighbors
  let flaggedCount = 0;
  const neighbors = shapeConfig.getNeighbors(row, col, rows, cols);
  const validNeighbors: Array<{ row: number; col: number; cell: Cell }> = [];
  
  for (const neighbor of neighbors) {
    if (shapeConfig.cellExists(neighbor.row, neighbor.col, rows, cols)) {
      const neighborCell = newBoard[neighbor.row][neighbor.col];
      validNeighbors.push({ row: neighbor.row, col: neighbor.col, cell: neighborCell });
      
      if (neighborCell.state === CellState.FLAGGED) {
        flaggedCount++;
      }
    }
  }
  
  // Only chord if flagged count matches the number
  if (flaggedCount !== cell.neighborMines) {
    return newBoard;
  }
  
  // Reveal all unflagged neighbors
  for (const { row: nRow, col: nCol, cell: neighborCell } of validNeighbors) {
    if (neighborCell.state === CellState.HIDDEN) {
      newBoard = revealCell(newBoard, nRow, nCol, boardShape);
    }
  }
  
  return newBoard;
};
