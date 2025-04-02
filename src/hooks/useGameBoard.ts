import { useState, useCallback } from 'react';
import { BOARD_WIDTH, BOARD_HEIGHT, TETROMINOES } from '../constants';

export type BoardCell = {
  filled: boolean;
  color: string;
};

export type Tetromino = {
  shape: number[][];
  color: string;
  position: { x: number; y: number };
};

export const useGameBoard = () => {
  const createEmptyBoard = () => 
    Array(BOARD_HEIGHT).fill(null).map(() =>
      Array(BOARD_WIDTH).fill(null).map(() => ({ filled: false, color: '' }))
    );

  const [board, setBoard] = useState<BoardCell[][]>(createEmptyBoard);

  const createTetromino = useCallback((): Tetromino => {
    const tetrominoTypes = Object.keys(TETROMINOES);
    const randomType = tetrominoTypes[Math.floor(Math.random() * tetrominoTypes.length)] as keyof typeof TETROMINOES;
    const tetromino = TETROMINOES[randomType];
    
    return {
      shape: tetromino.shape,
      color: tetromino.color,
      position: { x: Math.floor(BOARD_WIDTH / 2) - Math.floor(tetromino.shape[0].length / 2), y: 0 }
    };
  }, []);

  const isValidMove = useCallback((tetromino: Tetromino, offsetX: number, offsetY: number): boolean => {
    return tetromino.shape.every((row, dy) =>
      row.every((cell, dx) => {
        if (cell === 0) return true;
        
        const newX = tetromino.position.x + dx + offsetX;
        const newY = tetromino.position.y + dy + offsetY;
        
        return (
          newX >= 0 &&
          newX < BOARD_WIDTH &&
          newY >= 0 &&
          newY < BOARD_HEIGHT &&
          !board[newY][newX].filled
        );
      })
    );
  }, [board]);

  const rotateTetromino = useCallback((tetromino: Tetromino): Tetromino => {
    const rotated = {
      ...tetromino,
      shape: tetromino.shape[0].map((_, index) =>
        tetromino.shape.map(row => row[index]).reverse()
      )
    };
    
    return isValidMove(rotated, 0, 0) ? rotated : tetromino;
  }, [isValidMove]);

  const mergeTetromino = useCallback((tetromino: Tetromino): void => {
    setBoard(prev => {
      const newBoard = prev.map(row => [...row]);
      
      tetromino.shape.forEach((row, dy) => {
        row.forEach((cell, dx) => {
          if (cell === 1) {
            const boardY = tetromino.position.y + dy;
            const boardX = tetromino.position.x + dx;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              newBoard[boardY][boardX] = { filled: true, color: tetromino.color };
            }
          }
        });
      });
      
      return newBoard;
    });
  }, []);

  const clearLines = useCallback((): number => {
    let linesCleared = 0;
    
    setBoard(prev => {
      const newBoard = prev.filter(row => !row.every(cell => cell.filled));
      linesCleared = BOARD_HEIGHT - newBoard.length;
      
      while (newBoard.length < BOARD_HEIGHT) {
        newBoard.unshift(Array(BOARD_WIDTH).fill(null).map(() => ({ filled: false, color: '' })));
      }
      
      return newBoard;
    });
    
    return linesCleared;
  }, []);

  const resetBoard = useCallback(() => {
    setBoard(createEmptyBoard());
  }, []);

  return {
    board,
    createTetromino,
    isValidMove,
    rotateTetromino,
    mergeTetromino,
    clearLines,
    resetBoard
  };
};