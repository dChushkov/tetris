import React, { useEffect, useCallback } from 'react';
import { GameBoard } from './components/GameBoard';
import { NextPiece } from './components/NextPiece';
import { useGameBoard } from './hooks/useGameBoard';
import { useGameLoop } from './hooks/useGameLoop';
import { Pause, Play, RotateCcw, Gamepad2 } from 'lucide-react';

function App() {
  const {
    board,
    createTetromino,
    isValidMove,
    rotateTetromino,
    mergeTetromino,
    clearLines,
    resetBoard
  } = useGameBoard();

  const {
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
  } = useGameLoop(createTetromino, isValidMove, mergeTetromino, clearLines, resetBoard);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Prevent scrolling with arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
      event.preventDefault();
    }

    if (gameOver) return;

    switch (event.key) {
      case 'ArrowLeft':
        moveLeft();
        break;
      case 'ArrowRight':
        moveRight();
        break;
      case 'ArrowDown':
        moveDown();
        break;
      case 'ArrowUp':
        setCurrentTetromino(prev => rotateTetromino(prev));
        break;
      case ' ':
        hardDrop();
        break;
      case 'p':
        setIsPaused(prev => !prev);
        break;
      default:
        break;
    }
  }, [gameOver, moveLeft, moveRight, moveDown, rotateTetromino, hardDrop, setIsPaused, setCurrentTetromino]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handlePlayAgain = () => {
    resetGame();
  };

  return (
    <div className="min-h-screen cyber-bg text-white flex items-center justify-center overflow-hidden">
      <div className="flex flex-col items-center space-y-4 p-8 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-8">
          <Gamepad2 size={40} className="text-green-400" />
          <h1 className="text-5xl font-bold game-title bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            TETRIS
          </h1>
        </div>
        
        <div className="flex gap-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="game-board-container p-2">
              <GameBoard board={board} currentTetromino={currentTetromino} />
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setIsPaused(prev => !prev)}
                className="neon-button px-6 py-3 bg-gradient-to-r from-green-600 to-green-800 rounded-lg hover:from-green-500 hover:to-green-700 flex items-center gap-2 transform hover:scale-105 transition-all"
              >
                {isPaused ? <Play size={24} /> : <Pause size={24} />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              
              <button
                onClick={resetGame}
                className="neon-button px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 rounded-lg hover:from-red-500 hover:to-red-700 flex items-center gap-2 transform hover:scale-105 transition-all"
              >
                <RotateCcw size={24} />
                Reset
              </button>
            </div>
          </div>
          
          <div className="flex flex-col space-y-6">
            <div className="game-panel p-6">
              <h2 className="text-xl font-semibold mb-4 text-green-400">Next Piece</h2>
              <NextPiece tetromino={nextTetromino} />
            </div>
            
            <div className="game-panel p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-green-400">Score</h2>
                <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                  {score.toString().padStart(6, '0')}
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-green-400">Level</h2>
                <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                  {level}
                </p>
              </div>
            </div>
            
            <div className="game-panel p-6">
              <h2 className="text-xl font-semibold mb-4 text-green-400">Controls</h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-gray-800 rounded text-sm">←→</span>
                  <span>Move</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-gray-800 rounded text-sm">↑</span>
                  <span>Rotate</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-gray-800 rounded text-sm">↓</span>
                  <span>Soft Drop</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-gray-800 rounded text-sm">Space</span>
                  <span>Hard Drop</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-gray-800 rounded text-sm">P</span>
                  <span>Pause</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {gameOver && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="game-panel p-8 text-center transform scale-110">
              <h2 className="text-4xl font-bold mb-6 game-title">Game Over!</h2>
              <p className="text-2xl mb-6">Final Score: {score}</p>
              <button
                onClick={handlePlayAgain}
                className="neon-button px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg hover:from-blue-500 hover:to-blue-700 transform hover:scale-105 transition-all"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;