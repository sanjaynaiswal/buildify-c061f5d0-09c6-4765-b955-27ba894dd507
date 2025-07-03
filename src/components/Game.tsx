
import { useState, useEffect } from 'react';
import Board from './Board';
import ScoreBoard from './ScoreBoard';
import './Game.css';

type Player = 'X' | 'O' | null;
type BoardState = Player[];

const Game = () => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [scores, setScores] = useState<{ X: number; O: number; ties: number }>({
    X: 0,
    O: 0,
    ties: 0,
  });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<Player>(null);
  const [winningCombination, setWinningCombination] = useState<number[] | null>(null);

  const winningPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  useEffect(() => {
    checkWinner();
  }, [board]);

  const handleClick = (index: number) => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const checkWinner = () => {
    for (const pattern of winningPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setGameOver(true);
        setWinner(board[a]);
        setWinningCombination(pattern);
        updateScores(board[a]);
        return;
      }
    }

    // Check for a tie
    if (!board.includes(null) && !gameOver) {
      setGameOver(true);
      setWinner(null);
      updateScores(null);
    }
  };

  const updateScores = (player: Player) => {
    if (player === 'X') {
      setScores({ ...scores, X: scores.X + 1 });
    } else if (player === 'O') {
      setScores({ ...scores, O: scores.O + 1 });
    } else {
      setScores({ ...scores, ties: scores.ties + 1 });
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameOver(false);
    setWinner(null);
    setWinningCombination(null);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0, ties: 0 });
    resetGame();
  };

  return (
    <div className="game">
      <h1 className="game-title">ZeroCross</h1>
      <p className="game-subtitle">Tic-Tac-Toe Game</p>
      
      <ScoreBoard scores={scores} />
      
      <div className="game-status">
        {gameOver ? (
          winner ? (
            <p>Winner: <span className={winner === 'X' ? 'x-text' : 'o-text'}>{winner}</span></p>
          ) : (
            <p>Game ended in a tie!</p>
          )
        ) : (
          <p>Next player: <span className={isXNext ? 'x-text' : 'o-text'}>{isXNext ? 'X' : 'O'}</span></p>
        )}
      </div>
      
      <Board 
        squares={board} 
        onClick={handleClick} 
        winningCombination={winningCombination}
      />
      
      <div className="game-controls">
        <button className="reset-button" onClick={resetGame}>
          New Game
        </button>
        <button className="reset-scores-button" onClick={resetScores}>
          Reset Scores
        </button>
      </div>
    </div>
  );
};

export default Game;