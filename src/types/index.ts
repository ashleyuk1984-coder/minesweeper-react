export enum CellState {
  HIDDEN = 'hidden',
  REVEALED = 'revealed',
  FLAGGED = 'flagged',
  QUESTIONED = 'questioned',
}

export enum GameState {
  PLAYING = 'playing',
  WON = 'won',
  LOST = 'lost',
  NOT_STARTED = 'not_started',
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  CUSTOM = 'custom',
}

export enum BoardShape {
  RECTANGLE = 'rectangle',
  HEXAGON = 'hexagon',
  TRIANGLE = 'triangle',
  DIAMOND = 'diamond',
  CROSS = 'cross',
  CIRCLE = 'circle',
  CUSTOM = 'custom',
}

export interface Coordinate {
  row: number;
  col: number;
}

export interface Cell {
  isMine: boolean;
  state: CellState;
  neighborMines: number;
  row: number;
  col: number;
  // For non-rectangular boards, some positions might not exist
  exists?: boolean;
  // Visual positioning for irregular shapes
  x?: number;
  y?: number;
}

export interface GameConfig {
  rows: number;
  cols: number;
  mines: number;
  boardShape?: BoardShape;
}

export interface BoardShapeConfig {
  shape: BoardShape;
  name: string;
  displayName: string;
  description: string;
  // Function to determine if a cell exists at given coordinates
  cellExists: (row: number, col: number, rows: number, cols: number) => boolean;
  // Function to get neighbors for a cell (accounting for shape)
  getNeighbors: (row: number, col: number, rows: number, cols: number) => Coordinate[];
  // CSS class for styling
  cssClass: string;
  // Grid layout properties
  gridLayout: {
    type: 'rectangle' | 'hexagon' | 'triangle' | 'custom';
    cellSize?: number;
    gap?: number;
    offsetEven?: boolean; // For hexagonal grids
  };
}

export interface GameStats {
  minesLeft: number;
  timeElapsed: number;
  gameState: GameState;
}

export interface PlayerStatistics {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  totalTime: number;
  bestTime: { [key in Difficulty]?: number };
  currentStreak: number;
  bestStreak: number;
  averageTime: number;
  winRate: number;
  lastPlayed: number;
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, GameConfig> = {
  [Difficulty.EASY]: { rows: 9, cols: 9, mines: 10, boardShape: BoardShape.RECTANGLE },
  [Difficulty.MEDIUM]: { rows: 16, cols: 16, mines: 40, boardShape: BoardShape.RECTANGLE },
  [Difficulty.HARD]: { rows: 16, cols: 30, mines: 99, boardShape: BoardShape.RECTANGLE },
  [Difficulty.CUSTOM]: { rows: 16, cols: 16, mines: 40, boardShape: BoardShape.RECTANGLE }, // Default for custom
};
