import { PlayerStatistics, Difficulty, GameState } from '../types';

const STATS_STORAGE_KEY = 'minesweeper-statistics';

const defaultStats: PlayerStatistics = {
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  totalTime: 0,
  bestTime: {},
  currentStreak: 0,
  bestStreak: 0,
  averageTime: 0,
  winRate: 0,
  lastPlayed: Date.now(),
};

export const getStatistics = (): PlayerStatistics => {
  try {
    const stored = localStorage.getItem(STATS_STORAGE_KEY);
    if (stored) {
      const stats = JSON.parse(stored);
      // Ensure all required fields exist (for backwards compatibility)
      return { ...defaultStats, ...stats };
    }
  } catch (error) {
    console.warn('Failed to load statistics:', error);
  }
  return { ...defaultStats };
};

export const saveStatistics = (stats: PlayerStatistics): void => {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.warn('Failed to save statistics:', error);
  }
};

export const updateStatistics = (
  gameState: GameState,
  difficulty: Difficulty,
  timeElapsed: number
): PlayerStatistics => {
  const stats = getStatistics();
  
  // Update basic counts
  stats.gamesPlayed++;
  stats.totalTime += timeElapsed;
  stats.lastPlayed = Date.now();
  
  if (gameState === GameState.WON) {
    stats.gamesWon++;
    stats.currentStreak++;
    stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak);
    
    // Update best time for this difficulty
    const currentBest = stats.bestTime[difficulty];
    if (!currentBest || timeElapsed < currentBest) {
      stats.bestTime[difficulty] = timeElapsed;
    }
  } else if (gameState === GameState.LOST) {
    stats.gamesLost++;
    stats.currentStreak = 0;
  }
  
  // Calculate derived stats
  stats.winRate = stats.gamesPlayed > 0 ? (stats.gamesWon / stats.gamesPlayed) * 100 : 0;
  stats.averageTime = stats.gamesWon > 0 ? stats.totalTime / stats.gamesWon : 0;
  
  saveStatistics(stats);
  return stats;
};

export const resetStatistics = (): PlayerStatistics => {
  const freshStats = { ...defaultStats, lastPlayed: Date.now() };
  saveStatistics(freshStats);
  return freshStats;
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const getDifficultyDisplayName = (difficulty: Difficulty): string => {
  switch (difficulty) {
    case Difficulty.EASY:
      return 'Easy';
    case Difficulty.MEDIUM:
      return 'Medium';
    case Difficulty.HARD:
      return 'Hard';
    case Difficulty.CUSTOM:
      return 'Custom';
    default:
      return 'Unknown';
  }
};