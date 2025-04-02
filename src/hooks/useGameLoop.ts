import { useState, useEffect, useCallback } from 'react';
import { SPEEDS, POINTS } from '../constants';
import type { Tetromino } from './useGameBoard';

export const useGameLoop = (
  createTetromino: () => Tetromino,
  isValidMove: (tetromino: Tetromino, offsetX: number, offsetY: number) => boolean,
  mergeTetromino: (tetromino: Tetromino) => void,
  clearLines: () => number,
  resetBoard: () => void
) => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTetromino, setCurrentTetromino] = useState<Tetromino>(createTetromino);
  const [nextTetromino, setNextTetromino] = useState<Tetromino>(createTetromino);

  const moveDown = useCallback(() => {
    if (isValidMove(currentTetromino, 0, 1)) {
      setCurrentTetromino(prev => ({
        ...prev,
        position: { ...prev.position, y: prev.position.y + 1 }
      }));
      return true;
    }
    return false;
  }, [currentTetromino, isValidMove]);

  const moveLeft = useCallback(() => {
    if (isValidMove(currentTetromino, -1, 0)) {
      setCurrentTetromino(prev => ({
        ...prev,
        position: { ...prev.position, x: prev.position.x - 1 }
      }));
    }
  }, [currentTetromino, isValidMove]);

  const moveRight = useCallback(() => {
    if (isValidMove(currentTetromino, 1, 0)) {
      setCurrentTetromino(prev => ({
        ...prev,
        position: { ...prev.position, x: prev.position.x + 1 }
      }));
    }
  }, [currentTetromino, isValidMove]);

  const hardDrop = useCallback(() => {
    let distance = 0;
    while (isValidMove(currentTetromino, 0, distance + 1)) {
      distance++;
    }
    setCurrentTetromino(prev => ({
      ...prev,
      position: { ...prev.position, y: prev.position.y + distance }
    }));
    setScore(prev => prev + distance * 2);
  }, [currentTetromino, isValidMove]);

  const spawnNewTetromino = useCallback(() => {
    mergeTetromino(currentTetromino);
    const linesCleared = clearLines();
    
    if (linesCleared > 0) {
      const basePoints = POINTS[linesCleared as keyof typeof POINTS];
      const levelMultiplier = level;
      setScore(prev => prev + basePoints * levelMultiplier);
      setLevel(prev => Math.min(10, Math.floor(1 + Math.floor(score / 1000))));
    }
    
    setCurrentTetromino(nextTetromino);
    setNextTetromino(createTetromino());
    
    if (!isValidMove(nextTetromino, 0, 0)) {
      setGameOver(true);
    }
  }, [currentTetromino, nextTetromino, mergeTetromino, clearLines, createTetromino, isValidMove, score, level]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const interval = setInterval(() => {
      if (!moveDown()) {
        spawnNewTetromino();
      }
    }, SPEEDS[level as keyof typeof SPEEDS]);

    return () => clearInterval(interval);
  }, [gameOver, isPaused, level, moveDown, spawnNewTetromino]);

  const resetGame = useCallback(() => {
    resetBoard();
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setIsPaused(false);
    const newCurrentTetromino = createTetromino();
    const newNextTetromino = createTetromino();
    setCurrentTetromino(newCurrentTetromino);
    setNextTetromino(newNextTetromino);
  }, [createTetromino, resetBoard]);

  return {
    score,
    level,
    gameOver,
    isPaused,
    currentTetromino,
    nextTetromino,
    setCurrentTetromino,
    moveLeft,
    moveRight,
    moveDown,
    hardDrop,
    setIsPaused,
    resetGame
  };
};