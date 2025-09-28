import { Cell, CellState, GameState, GameConfig } from '../types';

export const createEmptyBoard = (rows: number, cols: number): Cell[][] => {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      isMine: false,
      state: CellState.HIDDEN,
      neighborMines: 0,
      row,
      col,
    }))
  );
};

export const placeMines = (board: Cell[][], mineCount: number, excludeRow?: number, excludeCol?: number): Cell[][] => {
  const rows = board.length;
  const cols = board[0].length;
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  
  let minesPlaced = 0;
  const positions: Array<{ row: number; col: number }> = [];
  
  // Generate all possible positions
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (excludeRow !== undefined && excludeCol !== undefined) {
        // Don't place mines on the first clicked cell or its neighbors
        if (Math.abs(row - excludeRow) <= 1 && Math.abs(col - excludeCol) <= 1) {
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

export const calculateNeighborMines = (board: Cell[][]): Cell[][] => {
  const rows = board.length;
  const cols = board[0].length;
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!newBoard[row][col].isMine) {
        let count = 0;
        
        for (const [dr, dc] of directions) {
          const newRow = row + dr;
          const newCol = col + dc;
          
          if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            if (newBoard[newRow][newCol].isMine) {
              count++;
            }
          }
        }
        
        newBoard[row][col].neighborMines = count;
      }
    }
  }
  
  return newBoard;
};

export const revealCell = (board: Cell[][], row: number, col: number): Cell[][] => {
  const rows = board.length;
  const cols = board[0].length;
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  
  if (row < 0 || row >= rows || col < 0 || col >= cols) {
    return newBoard;
  }
  
  const cell = newBoard[row][col];
  
  if (cell.state !== CellState.HIDDEN) {
    return newBoard;
  }
  
  cell.state = CellState.REVEALED;
  
  // If it's an empty cell (no neighboring mines), reveal all neighbors
  if (!cell.isMine && cell.neighborMines === 0) {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];
    
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        const neighbor = newBoard[newRow][newCol];
        if (neighbor.state === CellState.HIDDEN) {
          const updatedBoard = revealCell(newBoard, newRow, newCol);
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
  
  cell.state = cell.state === CellState.FLAGGED ? CellState.HIDDEN : CellState.FLAGGED;
  return newBoard;
};

export const checkGameState = (board: Cell[][], config: GameConfig): GameState => {
  let revealedCells = 0;
  let flaggedMines = 0;
  let totalCells = config.rows * config.cols;
  
  for (let row = 0; row < config.rows; row++) {
    for (let col = 0; col < config.cols; col++) {
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
  
  // Win condition: all non-mine cells are revealed
  if (revealedCells === totalCells - config.mines) {
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