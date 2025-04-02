import React, { useRef, useEffect } from 'react';
import { BLOCK_SIZE } from '../constants';
import type { Tetromino } from '../hooks/useGameBoard';

interface NextPieceProps {
  tetromino: Tetromino;
}

export const NextPiece: React.FC<NextPieceProps> = ({ tetromino }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const size = 5 * BLOCK_SIZE; // Increased size to accommodate all pieces

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Calculate centering offsets
    const shapeWidth = tetromino.shape[0].length * BLOCK_SIZE;
    const shapeHeight = tetromino.shape.length * BLOCK_SIZE;
    const offsetX = (size - shapeWidth) / 2;
    const offsetY = (size - shapeHeight) / 2;

    // Draw the next tetromino with glow effect
    ctx.fillStyle = tetromino.color;
    ctx.shadowColor = tetromino.color;
    ctx.shadowBlur = 15;
    tetromino.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const posX = x * BLOCK_SIZE + offsetX;
          const posY = y * BLOCK_SIZE + offsetY;
          ctx.fillRect(posX, posY, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
          
          // Add highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.fillRect(posX, posY, BLOCK_SIZE - 1, BLOCK_SIZE / 4);
          ctx.fillStyle = tetromino.color;
        }
      });
    });
    ctx.shadowBlur = 0;
  }, [tetromino, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="rounded-lg"
    />
  );
};