import { useState, useCallback, useEffect } from 'react';
import { Cell, GameState, GameConfig, Difficulty, DIFFICULTY_CONFIGS, PlayerStatistics } from '../types';
import {
  createEmptyBoard,
  placeMines,
  calculateNeighborMines,
  revealCell,
  toggleFlag,
  checkGameState,
  getMinesLeft,
  revealAllMines,
  chordReveal,
  flagRemainingMines,
} from '../utils/gameLogic';
import { getStatistics, updateStatistics, resetStatistics } from '../utils/statistics';

interface UseMinesweeperReturn {
  board: Cell[][];
  gameState: GameState;
  minesLeft: number;
  timeElapsed: number;
  difficulty: Difficulty;
  config: GameConfig;
  statistics: PlayerStatistics;
  onCellClick: (row: number, col: number) => void;
  onCellRightClick: (row: number, col: number) => void;
  onCellChord: (row: number, col: number) => void;
  resetGame: () => void;
  setDifficulty: (difficulty: Difficulty, customConfig?: GameConfig) => void;
  resetStatistics: () => void;
}

export const useMinesweeper = (initialDifficulty: Difficulty = Difficulty.EASY): UseMinesweeperReturn => {
  const [difficulty, setDifficultyState] = useState<Difficulty>(initialDifficulty);
  const [config, setConfig] = useState<GameConfig>(DIFFICULTY_CONFIGS[initialDifficulty]);
  const [board, setBoard] = useState<Cell[][]>(() => createEmptyBoard(config.rows, config.cols));
  const [gameState, setGameState] = useState<GameState>(GameState.NOT_STARTED);
  const [minesLeft, setMinesLeft] = useState<number>(config.mines);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isFirstClick, setIsFirstClick] = useState<boolean>(true);
  const [statistics, setStatistics] = useState<PlayerStatistics>(() => getStatistics());

  // Timer effect
  useEffect(() => {
    let interval: number | null = null;

    if (gameState === GameState.PLAYING && startTime) {
      interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [gameState, startTime]);

  // Update statistics when game ends
  useEffect(() => {
    if (gameState === GameState.WON || gameState === GameState.LOST) {
      const updatedStats = updateStatistics(gameState, difficulty, timeElapsed);
      setStatistics(updatedStats);
    }
  }, [gameState, difficulty, timeElapsed]);

  const resetGame = useCallback(() => {
    const newBoard = createEmptyBoard(config.rows, config.cols);
    setBoard(newBoard);
    setGameState(GameState.NOT_STARTED);
    setMinesLeft(config.mines);
    setTimeElapsed(0);
    setStartTime(null);
    setIsFirstClick(true);
  }, [config]);

  const setDifficulty = useCallback((newDifficulty: Difficulty, customConfig?: GameConfig) => {
    setDifficultyState(newDifficulty);
    const newConfig = customConfig || DIFFICULTY_CONFIGS[newDifficulty];
    setConfig(newConfig);
    
    const newBoard = createEmptyBoard(newConfig.rows, newConfig.cols);
    setBoard(newBoard);
    setGameState(GameState.NOT_STARTED);
    setMinesLeft(newConfig.mines);
    setTimeElapsed(0);
    setStartTime(null);
    setIsFirstClick(true);
  }, []);

  const initializeGame = useCallback((firstClickRow: number, firstClickCol: number) => {
    let newBoard = placeMines(board, config.mines, firstClickRow, firstClickCol);
    newBoard = calculateNeighborMines(newBoard);
    setBoard(newBoard);
    setGameState(GameState.PLAYING);
    setStartTime(Date.now());
    setIsFirstClick(false);
    return newBoard;
  }, [board, config.mines]);

  const onCellClick = useCallback((row: number, col: number) => {
    if (gameState === GameState.WON || gameState === GameState.LOST) {
      return;
    }

    let currentBoard = board;

    // Initialize game on first click
    if (isFirstClick) {
      currentBoard = initializeGame(row, col);
    }

    // Reveal the cell
    const newBoard = revealCell(currentBoard, row, col);
    setBoard(newBoard);

    // Check if game is over
    const newGameState = checkGameState(newBoard, config);
    
    if (newGameState === GameState.LOST) {
      setGameState(GameState.LOST);
      setBoard(revealAllMines(newBoard));
      audioSystem.playExplosion();
    } else if (newGameState === GameState.WON) {
      setGameState(GameState.WON);
      setBoard(flagRemainingMines(newBoard));
      audioSystem.playVictory();
    } else if (!isFirstClick) {
      setGameState(GameState.PLAYING);
    }

    // Update mines left
    setMinesLeft(getMinesLeft(newBoard, config.mines));
  }, [board, gameState, isFirstClick, config, initializeGame]);

  const onCellRightClick = useCallback((row: number, col: number) => {
    if (gameState === GameState.WON || gameState === GameState.LOST || gameState === GameState.NOT_STARTED) {
      return;
    }

    const newBoard = toggleFlag(board, row, col);
    setBoard(newBoard);
    setMinesLeft(getMinesLeft(newBoard, config.mines));
  }, [board, gameState, config.mines]);

  const onCellChord = useCallback((row: number, col: number) => {
    if (gameState !== GameState.PLAYING) {
      return;
    }

    const newBoard = chordReveal(board, row, col);
    setBoard(newBoard);

    // Check if game is over after chording
    const newGameState = checkGameState(newBoard, config);
    
    if (newGameState === GameState.LOST) {
      setGameState(GameState.LOST);
      setBoard(revealAllMines(newBoard));
      audioSystem.playExplosion();
    } else if (newGameState === GameState.WON) {
      setGameState(GameState.WON);
      setBoard(flagRemainingMines(newBoard));
      audioSystem.playVictory();
    }

    // Update mines left
    setMinesLeft(getMinesLeft(newBoard, config.mines));
  }, [board, gameState, config]);

  const handleResetStatistics = useCallback(() => {
    const freshStats = resetStatistics();
    setStatistics(freshStats);
  }, []);

  return {
    board,
    gameState,
    minesLeft,
    timeElapsed,
    difficulty,
    config,
    statistics,
    onCellClick,
    onCellRightClick,
    onCellChord,
    resetGame,
    setDifficulty,
    resetStatistics: handleResetStatistics,
  };
};