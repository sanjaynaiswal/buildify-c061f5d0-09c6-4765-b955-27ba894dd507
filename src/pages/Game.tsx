
import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext, Transaction, User } from '../App';
import Board from '../components/Board';
import './Game.css';

type GameMode = 'free' | 'paid' | 'tournament' | 'challenge' | 'guest';

interface GameState {
  history: Array<Array<string | null>>;
  currentMove: number;
  xIsNext: boolean;
  status: string;
  winningSquares: number[];
  isGameActive: boolean;
  entryFee: number;
  winAmount: number;
  opponent: {
    id: string;
    username: string;
    avatar: string;
  } | null;
}

const initialGameState: GameState = {
  history: [Array(9).fill(null)],
  currentMove: 0,
  xIsNext: true,
  status: 'Next player: X',
  winningSquares: [],
  isGameActive: false,
  entryFee: 0,
  winAmount: 0,
  opponent: null,
};

const Game = () => {
  const { mode } = useParams<{ mode: string }>();
  const gameMode = (mode || 'free') as GameMode;
  const { user, setUser, wallet, setWallet } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [gameState, setGameState] = useState<GameState>({
    ...initialGameState,
    entryFee: getEntryFee(gameMode),
    winAmount: getWinAmount(gameMode),
  });
  
  const [isWaitingForOpponent, setIsWaitingForOpponent] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [result, setResult] = useState<'win' | 'loss' | 'draw' | null>(null);
  
  // Set up game based on mode
  useEffect(() => {
    // Create a guest user if in guest mode and no user is logged in
    if (gameMode === 'guest' && !user) {
      const guestUser: User = {
        id: `guest-${Date.now()}`,
        username: `Guest${Math.floor(1000 + Math.random() * 9000)}`,
        email: '',
        avatar: 'https://via.placeholder.com/40',
        isGuest: true,
        stats: {
          wins: 0,
          losses: 0,
          draws: 0,
          elo: 1000
        }
      };
      setUser(guestUser);
    }
    
    if (gameMode !== 'free' && gameMode !== 'guest' && !user) {
      navigate('/login');
      return;
    }
    
    // Reset game state
    setGameState({
      ...initialGameState,
      entryFee: getEntryFee(gameMode),
      winAmount: getWinAmount(gameMode),
    });
    
    setIsWaitingForOpponent(false);
    setIsGameOver(false);
    setResult(null);
    
    // For paid modes, check if user has enough balance
    if (['paid', 'tournament', 'challenge'].includes(gameMode) && wallet.balance < getEntryFee(gameMode)) {
      alert('Insufficient balance. Please add money to your wallet.');
      navigate('/wallet');
      return;
    }
  }, [gameMode, user, wallet.balance, navigate, setUser]);
  
  function getEntryFee(mode: GameMode): number {
    switch (mode) {
      case 'paid': return 10;
      case 'tournament': return 50;
      case 'challenge': return 20;
      default: return 0;
    }
  }
  
  function getWinAmount(mode: GameMode): number {
    switch (mode) {
      case 'paid': return 18;
      case 'tournament': return 450;
      case 'challenge': return 36;
      default: return 0;
    }
  }
  
  const startGame = () => {
    // In a real app, this would connect to a backend to find an opponent
    if (['paid', 'tournament', 'challenge'].includes(gameMode)) {
      // Deduct entry fee
      if (user) {
        const newBalance = wallet.balance - gameState.entryFee;
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          type: 'loss',
          amount: gameState.entryFee,
          timestamp: new Date(),
          status: 'completed',
          details: `Entry fee for ${gameMode} game`,
        };
        
        setWallet({
          balance: newBalance,
          transactions: [newTransaction, ...wallet.transactions],
        });
      }
      
      setIsWaitingForOpponent(true);
      
      // Simulate finding an opponent
      setTimeout(() => {
        setIsWaitingForOpponent(false);
        setGameState(prev => ({
          ...prev,
          isGameActive: true,
          opponent: {
            id: 'ai-123',
            username: 'AI Opponent',
            avatar: 'https://via.placeholder.com/40',
          },
          // Randomly decide who goes first
          xIsNext: Math.random() > 0.5,
        }));
      }, 2000);
    } else {
      // Free or guest mode - start immediately
      setGameState(prev => ({
        ...prev,
        isGameActive: true,
        opponent: gameMode === 'guest' ? {
          id: 'ai-123',
          username: 'AI Opponent',
          avatar: 'https://via.placeholder.com/40',
        } : null,
        // Randomly decide who goes first in guest mode
        xIsNext: gameMode === 'guest' ? Math.random() > 0.5 : true,
      }));
    }
  };
  
  const handlePlay = (nextSquares: (string | null)[]) => {
    const nextHistory = [...gameState.history.slice(0, gameState.currentMove + 1), nextSquares];
    const nextMove = nextHistory.length - 1;
    const nextXIsNext = !gameState.xIsNext;
    
    const { winner, winningLine } = calculateWinner(nextSquares);
    let nextStatus;
    
    if (winner) {
      nextStatus = `Winner: ${winner}`;
      handleGameEnd(winner === 'X' ? 'win' : 'loss');
    } else if (nextSquares.every(square => square !== null)) {
      nextStatus = 'Game ended in a draw';
      handleGameEnd('draw');
    } else {
      nextStatus = `Next player: ${nextXIsNext ? 'X' : 'O'}`;
    }
    
    setGameState({
      ...gameState,
      history: nextHistory,
      currentMove: nextMove,
      xIsNext: nextXIsNext,
      status: nextStatus,
      winningSquares: winningLine || [],
    });
  };
  
  const handleGameEnd = (result: 'win' | 'loss' | 'draw') => {
    setIsGameOver(true);
    setResult(result);
    setGameState(prev => ({ ...prev, isGameActive: false }));
    
    // Handle rewards for paid games
    if (!['free', 'guest'].includes(gameMode) && user && !user.isGuest) {
      let winAmount = 0;
      let transactionType: 'win' | 'refund' = 'win';
      let details = '';
      
      if (result === 'win') {
        winAmount = gameState.winAmount;
        details = `Won ${gameMode} game`;
      } else if (result === 'draw') {
        winAmount = gameState.entryFee;
        transactionType = 'refund';
        details = `Entry fee refunded for draw in ${gameMode} game`;
      }
      
      if (winAmount > 0) {
        const newBalance = wallet.balance + winAmount;
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          type: transactionType,
          amount: winAmount,
          timestamp: new Date(),
          status: 'completed',
          details,
        };
        
        setWallet({
          balance: newBalance,
          transactions: [newTransaction, ...wallet.transactions],
        });
        
        // Update user stats
        if (user) {
          setUser({
            ...user,
            stats: {
              ...user.stats,
              wins: result === 'win' ? user.stats.wins + 1 : user.stats.wins,
              losses: result === 'loss' ? user.stats.losses + 1 : user.stats.losses,
              draws: result === 'draw' ? user.stats.draws + 1 : user.stats.draws,
              elo: result === 'win' 
                ? user.stats.elo + 15 
                : result === 'loss' 
                  ? user.stats.elo - 10 
                  : user.stats.elo,
            }
          });
        }
      }
    }
    
    // Update stats for guest users too, but don't affect wallet
    if ((gameMode === 'free' || gameMode === 'guest') && user) {
      setUser({
        ...user,
        stats: {
          ...user.stats,
          wins: result === 'win' ? user.stats.wins + 1 : user.stats.wins,
          losses: result === 'loss' ? user.stats.losses + 1 : user.stats.losses,
          draws: result === 'draw' ? user.stats.draws + 1 : user.stats.draws,
        }
      });
    }
  };
  
  const resetGame = () => {
    setGameState({
      ...initialGameState,
      entryFee: getEntryFee(gameMode),
      winAmount: getWinAmount(gameMode),
    });
    setIsGameOver(false);
    setResult(null);
  };
  
  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], winningLine: lines[i] };
      }
    }
    
    return { winner: null, winningLine: null };
  };
  
  const currentSquares = gameState.history[gameState.currentMove];
  
  return (
    <div className="game-page">
      <div className="game-header">
        <h1>ZeroCross - {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)} Mode</h1>
        {gameMode !== 'free' && (
          <div className="game-stakes">
            <div className="entry-fee">Entry: ₹{gameState.entryFee}</div>
            <div className="win-amount">Win: ₹{gameState.winAmount}</div>
          </div>
        )}
      </div>
      
      {!gameState.isGameActive && !isWaitingForOpponent && !isGameOver && (
        <div className="game-start-container">
          <div className="game-info-card">
            <h2>Ready to Play?</h2>
            {gameMode !== 'free' && (
              <p className="game-description">
                You'll be matched with a player of similar skill. 
                Entry fee of ₹{gameState.entryFee} will be deducted from your wallet.
              </p>
            )}
            <button 
              className="btn btn-primary start-game-btn"
              onClick={startGame}
            >
              Start Game
            </button>
          </div>
        </div>
      )}
      
      {isWaitingForOpponent && (
        <div className="waiting-container">
          <div className="spinner"></div>
          <p>Finding an opponent...</p>
        </div>
      )}
      
      {gameState.isGameActive && (
        <div className="game-container">
          {gameMode !== 'free' && gameState.opponent && (
            <div className="opponent-info">
              <div className="player-card">
                <img 
                  src={user?.avatar || 'https://via.placeholder.com/40'} 
                  alt={user?.username || 'You'} 
                  className="player-avatar"
                />
                <div className="player-name">You ({gameState.xIsNext ? 'X' : 'O'})</div>
              </div>
              
              <div className="vs-indicator">VS</div>
              
              <div className="player-card">
                <img 
                  src={gameState.opponent.avatar} 
                  alt={gameState.opponent.username} 
                  className="player-avatar"
                />
                <div className="player-name">{gameState.opponent.username} ({!gameState.xIsNext ? 'X' : 'O'})</div>
              </div>
            </div>
          )}
          
          <div className="game-status">{gameState.status}</div>
          
          <Board 
            xIsNext={gameState.xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
            winningSquares={gameState.winningSquares}
            gameMode={gameMode}
            isGameActive={gameState.isGameActive}
          />
        </div>
      )}
      
      {isGameOver && (
        <div className="game-over-container">
          <div className={`result-card ${result}`}>
            <h2 className="result-title">
              {result === 'win' 
                ? '🎉 You Won! 🎉' 
                : result === 'loss' 
                  ? '😔 You Lost' 
                  : '🤝 It\'s a Draw'}
            </h2>
            
            {!['free', 'guest'].includes(gameMode) && user && !user.isGuest && (
              <div className="result-details">
                {result === 'win' && (
                  <p>You won ₹{gameState.winAmount}!</p>
                )}
                {result === 'draw' && (
                  <p>Your entry fee of ₹{gameState.entryFee} has been refunded.</p>
                )}
              </div>
            )}
            
            {user?.isGuest && (
              <div className="guest-cta">
                <p>Create an account to play for real money and track your stats!</p>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('/register')}
                >
                  Sign Up Now
                </button>
              </div>
            )}
            
            <div className="action-buttons">
              <button 
                className="btn btn-primary"
                onClick={resetGame}
              >
                Play Again
              </button>
              
              <button 
                className="btn btn-outline"
                onClick={() => navigate('/')}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;