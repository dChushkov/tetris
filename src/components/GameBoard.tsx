import React, { useRef, useEffect } from 'react';
import { BLOCK_SIZE, BOARD_WIDTH, BOARD_HEIGHT } from '../constants';
import type { BoardCell, Tetromino } from '../hooks/useGameBoard';

interface GameBoardProps {
  board: BoardCell[][];
  currentTetromino: Tetromino;
}

export const GameBoard: React.FC<GameBoardProps> = ({ board, currentTetromino }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawBoard = (ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw background grid
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= BOARD_WIDTH; i++) {
      ctx.beginPath();
      ctx.moveTo(i * BLOCK_SIZE, 0);
      ctx.lineTo(i * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);
      ctx.stroke();
    }
    for (let i = 0; i <= BOARD_HEIGHT; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * BLOCK_SIZE);
      ctx.lineTo(BOARD_WIDTH * BLOCK_SIZE, i * BLOCK_SIZE);
      ctx.stroke();
    }

    // Draw the placed blocks with glow effect
    board.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell.filled) {
          ctx.fillStyle = cell.color;
          ctx.shadowColor = cell.color;
          ctx.shadowBlur = 10;
          ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
          
          // Add highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE / 4);
          
          ctx.shadowBlur = 0;
        }
      });
    });

    // Draw the current tetromino with glow effect
    ctx.fillStyle = currentTetromino.color;
    ctx.shadowColor = currentTetromino.color;
    ctx.shadowBlur = 15;
    currentTetromino.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const posX = (currentTetromino.position.x + x) * BLOCK_SIZE;
          const posY = (currentTetromino.position.y + y) * BLOCK_SIZE;
          ctx.fillRect(posX, posY, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
          
          // Add highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.fillRect(posX, posY, BLOCK_SIZE - 1, BLOCK_SIZE / 4);
          ctx.fillStyle = currentTetromino.color;
        }
      });
    });
    ctx.shadowBlur = 0;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawBoard(ctx);
  }, [board, currentTetromino]);

  return (
    <canvas
      ref={canvasRef}
      width={BOARD_WIDTH * BLOCK_SIZE}
      height={BOARD_HEIGHT * BLOCK_SIZE}
      className="rounded-lg"
    />
  );
};