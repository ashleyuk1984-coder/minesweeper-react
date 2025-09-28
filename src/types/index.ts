export enum CellState {
  HIDDEN = 'hidden',
  REVEALED = 'revealed',
  FLAGGED = 'flagged',
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

export interface Cell {
  isMine: boolean;
  state: CellState;
  neighborMines: number;
  row: number;
  col: number;
}

export interface GameConfig {
  rows: number;
  cols: number;
  mines: number;
}

export interface GameStats {
  minesLeft: number;
  timeElapsed: number;
  gameState: GameState;
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, GameConfig> = {
  [Difficulty.EASY]: { rows: 9, cols: 9, mines: 10 },
  [Difficulty.MEDIUM]: { rows: 16, cols: 16, mines: 40 },
  [Difficulty.HARD]: { rows: 16, cols: 30, mines: 99 },
  [Difficulty.CUSTOM]: { rows: 16, cols: 16, mines: 40 }, // Default for custom
};