
import { useState, useEffect } from 'react';
import Square from './Square';
import './Board.css';

interface BoardProps {
  xIsNext: boolean;
  squares: (string | null)[];
  onPlay: (nextSquares: (string | null)[]) => void;
  winningSquares: number[];
  gameMode: 'free' | 'paid' | 'tournament' | 'challenge';
  isGameActive: boolean;
}

const Board = ({ xIsNext, squares, onPlay, winningSquares, gameMode, isGameActive }: BoardProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isGameActive && gameMode !== 'free') {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time's up - auto-play a random empty square or forfeit
            const emptySquares = squares.map((square, index) => 
              square === null ? index : null
            ).filter(index => index !== null) as number[];
            
            if (emptySquares.length > 0) {
              const randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)];
              const nextSquares = squares.slice();
              nextSquares[randomIndex] = xIsNext ? 'X' : 'O';
              onPlay(nextSquares);
            }
            return 15; // Reset timer
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [xIsNext, isGameActive, gameMode, squares, onPlay]);

  // Reset timer when turn changes
  useEffect(() => {
    setTimeLeft(15);
  }, [xIsNext]);

  const handleClick = (i: number) => {
    if (!isGameActive || squares[i] || winningSquares.length > 0) {
      return;
    }
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  };

  const renderSquare = (i: number) => {
    const isWinningSquare = winningSquares.includes(i);
    
    return (
      <Square
        value={squares[i]}
        onClick={() => handleClick(i)}
        isWinning={isWinningSquare}
        isAnimating={isAnimating}
      />
    );
  };

  return (
    <div className="board-container">
      {gameMode !== 'free' && (
        <div className="timer-container">
          <div 
            className={`timer ${timeLeft <= 5 ? 'timer-warning' : ''}`}
            style={{ width: `${(timeLeft / 15) * 100}%` }}
          ></div>
        </div>
      )}
      
      <div className="board">
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
    </div>
  );
};

export default Board;