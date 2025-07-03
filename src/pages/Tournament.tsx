
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext, Transaction } from '../App';
import './Tournament.css';

interface TournamentPlayer {
  id: string;
  username: string;
  avatar: string;
  elo: number;
}

interface TournamentMatch {
  id: string;
  round: number;
  player1: TournamentPlayer | null;
  player2: TournamentPlayer | null;
  winner: TournamentPlayer | null;
  status: 'pending' | 'in_progress' | 'completed';
  startTime?: Date;
}

interface Tournament {
  id: string;
  name: string;
  entryFee: number;
  prizePool: number;
  maxPlayers: number;
  startTime: Date;
  status: 'registering' | 'in_progress' | 'completed';
  players: TournamentPlayer[];
  matches: TournamentMatch[];
  winner: TournamentPlayer | null;
}

const Tournament = () => {
  const { user, wallet, setWallet } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [activeTournament, setActiveTournament] = useState<Tournament | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Fetch tournaments
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const now = new Date();
      const upcomingTournament: Tournament = {
        id: 'tournament-1',
        name: 'Daily Championship',
        entryFee: 50,
        prizePool: 450,
        maxPlayers: 8,
        startTime: new Date(now.getTime() + 30 * 60000), // 30 minutes from now
        status: 'registering',
        players: generateRandomPlayers(3), // 3 players already registered
        matches: [],
        winner: null,
      };
      
      const inProgressTournament: Tournament = {
        id: 'tournament-2',
        name: 'Weekly Masters',
        entryFee: 100,
        prizePool: 1200,
        maxPlayers: 16,
        startTime: new Date(now.getTime() - 60 * 60000), // Started 1 hour ago
        status: 'in_progress',
        players: generateRandomPlayers(16),
        matches: generateTournamentMatches(16),
        winner: null,
      };
      
      const completedTournament: Tournament = {
        id: 'tournament-3',
        name: 'Weekend Challenge',
        entryFee: 75,
        prizePool: 900,
        maxPlayers: 8,
        startTime: new Date(now.getTime() - 24 * 60 * 60000), // Started yesterday
        status: 'completed',
        players: generateRandomPlayers(8),
        matches: generateCompletedMatches(8),
        winner: {
          id: 'player-1',
          username: 'Champion123',
          avatar: 'https://via.placeholder.com/40',
          elo: 1850,
        },
      };
      
      setTournaments([upcomingTournament, inProgressTournament, completedTournament]);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const generateRandomPlayers = (count: number): TournamentPlayer[] => {
    const players: TournamentPlayer[] = [];
    
    for (let i = 0; i < count; i++) {
      players.push({
        id: `player-${i + 1}`,
        username: `Player${i + 1}`,
        avatar: 'https://via.placeholder.com/40',
        elo: 1000 + Math.floor(Math.random() * 500),
      });
    }
    
    return players;
  };
  
  const generateTournamentMatches = (playerCount: number): TournamentMatch[] => {
    const matches: TournamentMatch[] = [];
    const rounds = Math.log2(playerCount);
    
    // Generate first round matches
    for (let i = 0; i < playerCount / 2; i++) {
      matches.push({
        id: `match-r1-${i + 1}`,
        round: 1,
        player1: {
          id: `player-${i * 2 + 1}`,
          username: `Player${i * 2 + 1}`,
          avatar: 'https://via.placeholder.com/40',
          elo: 1000 + Math.floor(Math.random() * 500),
        },
        player2: {
          id: `player-${i * 2 + 2}`,
          username: `Player${i * 2 + 2}`,
          avatar: 'https://via.placeholder.com/40',
          elo: 1000 + Math.floor(Math.random() * 500),
        },
        winner: Math.random() > 0.5 ? {
          id: `player-${i * 2 + 1}`,
          username: `Player${i * 2 + 1}`,
          avatar: 'https://via.placeholder.com/40',
          elo: 1000 + Math.floor(Math.random() * 500),
        } : {
          id: `player-${i * 2 + 2}`,
          username: `Player${i * 2 + 2}`,
          avatar: 'https://via.placeholder.com/40',
          elo: 1000 + Math.floor(Math.random() * 500),
        },
        status: 'completed',
      });
    }
    
    // Generate subsequent rounds
    for (let round = 2; round <= rounds; round++) {
      const matchesInRound = playerCount / Math.pow(2, round);
      
      for (let i = 0; i < matchesInRound; i++) {
        const status = round === 2 ? (i < matchesInRound / 2 ? 'completed' : 'in_progress') : 'pending';
        
        matches.push({
          id: `match-r${round}-${i + 1}`,
          round,
          player1: round === 2 ? matches.find(m => m.round === round - 1 && Math.floor(i / 2) === Math.floor((parseInt(m.id.split('-')[2]) - 1) / 2))?.winner || null : null,
          player2: round === 2 ? matches.find(m => m.round === round - 1 && Math.floor(i / 2) === Math.floor((parseInt(m.id.split('-')[2]) - 1) / 2) + matchesInRound * 2)?.winner || null : null,
          winner: status === 'completed' ? {
            id: `player-${Math.floor(Math.random() * playerCount) + 1}`,
            username: `Player${Math.floor(Math.random() * playerCount) + 1}`,
            avatar: 'https://via.placeholder.com/40',
            elo: 1000 + Math.floor(Math.random() * 500),
          } : null,
          status,
        });
      }
    }
    
    return matches;
  };
  
  const generateCompletedMatches = (playerCount: number): TournamentMatch[] => {
    const matches: TournamentMatch[] = [];
    const rounds = Math.log2(playerCount);
    
    // Generate all rounds with completed matches
    for (let round = 1; round <= rounds; round++) {
      const matchesInRound = playerCount / Math.pow(2, round);
      
      for (let i = 0; i < matchesInRound; i++) {
        matches.push({
          id: `match-r${round}-${i + 1}`,
          round,
          player1: {
            id: `player-${i * 2 + 1}`,
            username: `Player${i * 2 + 1}`,
            avatar: 'https://via.placeholder.com/40',
            elo: 1000 + Math.floor(Math.random() * 500),
          },
          player2: {
            id: `player-${i * 2 + 2}`,
            username: `Player${i * 2 + 2}`,
            avatar: 'https://via.placeholder.com/40',
            elo: 1000 + Math.floor(Math.random() * 500),
          },
          winner: Math.random() > 0.5 ? {
            id: `player-${i * 2 + 1}`,
            username: `Player${i * 2 + 1}`,
            avatar: 'https://via.placeholder.com/40',
            elo: 1000 + Math.floor(Math.random() * 500),
          } : {
            id: `player-${i * 2 + 2}`,
            username: `Player${i * 2 + 2}`,
            avatar: 'https://via.placeholder.com/40',
            elo: 1000 + Math.floor(Math.random() * 500),
          },
          status: 'completed',
        });
      }
    }
    
    // Set the final winner
    matches[matches.length - 1].winner = {
      id: 'player-1',
      username: 'Champion123',
      avatar: 'https://via.placeholder.com/40',
      elo: 1850,
    };
    
    return matches;
  };
  
  const handleRegister = (tournament: Tournament) => {
    if (wallet.balance < tournament.entryFee) {
      setError(`Insufficient balance. Please add at least ₹${tournament.entryFee - wallet.balance} to your wallet.`);
      return;
    }
    
    setIsRegistering(true);
    
    // Simulate API call
    setTimeout(() => {
      // Deduct entry fee
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'loss',
        amount: tournament.entryFee,
        timestamp: new Date(),
        status: 'completed',
        details: `Entry fee for ${tournament.name} tournament`,
      };
      
      setWallet({
        balance: wallet.balance - tournament.entryFee,
        transactions: [newTransaction, ...wallet.transactions],
      });
      
      // Add user to tournament
      const updatedTournament = { ...tournament };
      if (user) {
        updatedTournament.players.push({
          id: user.id,
          username: user.username,
          avatar: user.avatar,
          elo: user.stats.elo,
        });
      }
      
      setTournaments(prev => 
        prev.map(t => t.id === tournament.id ? updatedTournament : t)
      );
      
      setActiveTournament(updatedTournament);
      setIsRegistering(false);
    }, 1500);
  };
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };
  
  const getTimeRemaining = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    
    if (diff <= 0) return 'Starting now';
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    
    return `${minutes}m`;
  };
  
  const renderTournamentList = () => {
    if (isLoading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading tournaments...</p>
        </div>
      );
    }
    
    if (tournaments.length === 0) {
      return (
        <div className="empty-state">
          <p>No tournaments available at the moment</p>
        </div>
      );
    }
    
    return (
      <div className="tournament-list">
        {tournaments.map(tournament => (
          <div key={tournament.id} className="tournament-card">
            <div className="tournament-header">
              <h3>{tournament.name}</h3>
              <div className={`tournament-status ${tournament.status}`}>
                {tournament.status === 'registering' ? 'Registering' : 
                 tournament.status === 'in_progress' ? 'In Progress' : 'Completed'}
              </div>
            </div>
            
            <div className="tournament-details">
              <div className="detail-item">
                <span className="detail-label">Entry Fee</span>
                <span className="detail-value">₹{tournament.entryFee}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Prize Pool</span>
                <span className="detail-value prize">₹{tournament.prizePool}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Players</span>
                <span className="detail-value">{tournament.players.length}/{tournament.maxPlayers}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Start Time</span>
                <span className="detail-value">
                  {formatDate(tournament.startTime)} at {formatTime(tournament.startTime)}
                </span>
              </div>
              
              {tournament.status === 'registering' && (
                <div className="detail-item">
                  <span className="detail-label">Starts In</span>
                  <span className="detail-value countdown">{getTimeRemaining(tournament.startTime)}</span>
                </div>
              )}
              
              {tournament.status === 'completed' && tournament.winner && (
                <div className="detail-item winner">
                  <span className="detail-label">Winner</span>
                  <span className="detail-value">
                    <img 
                      src={tournament.winner.avatar} 
                      alt={tournament.winner.username} 
                      className="winner-avatar"
                    />
                    {tournament.winner.username}
                  </span>
                </div>
              )}
            </div>
            
            <div className="tournament-actions">
              {tournament.status === 'registering' && (
                <button 
                  className="btn btn-primary"
                  onClick={() => handleRegister(tournament)}
                  disabled={isRegistering || tournament.players.some(p => user && p.id === user.id)}
                >
                  {isRegistering ? 'Registering...' : 
                   tournament.players.some(p => user && p.id === user.id) ? 'Registered' : 'Register Now'}
                </button>
              )}
              
              <button 
                className="btn btn-outline"
                onClick={() => setActiveTournament(tournament)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderTournamentBracket = (tournament: Tournament) => {
    const rounds = Math.log2(tournament.maxPlayers);
    
    return (
      <div className="tournament-bracket">
        {Array.from({ length: rounds }, (_, i) => i + 1).map(round => (
          <div key={`round-${round}`} className="bracket-round">
            <div className="round-header">
              {round === rounds ? 'Final' : round === rounds - 1 ? 'Semi-Finals' : `Round ${round}`}
            </div>
            
            <div className="round-matches">
              {tournament.matches
                .filter(match => match.round === round)
                .map(match => (
                  <div key={match.id} className={`bracket-match ${match.status}`}>
                    <div className={`match-player ${match.winner?.id === match.player1?.id ? 'winner' : ''}`}>
                      {match.player1 ? (
                        <>
                          <img 
                            src={match.player1.avatar} 
                            alt={match.player1.username} 
                            className="player-avatar"
                          />
                          <span>{match.player1.username}</span>
                        </>
                      ) : (
                        <span className="tbd">TBD</span>
                      )}
                    </div>
                    
                    <div className="match-vs">vs</div>
                    
                    <div className={`match-player ${match.winner?.id === match.player2?.id ? 'winner' : ''}`}>
                      {match.player2 ? (
                        <>
                          <img 
                            src={match.player2.avatar} 
                            alt={match.player2.username} 
                            className="player-avatar"
                          />
                          <span>{match.player2.username}</span>
                        </>
                      ) : (
                        <span className="tbd">TBD</span>
                      )}
                    </div>
                    
                    {match.status === 'in_progress' && (
                      <div className="match-status">
                        <span className="live-indicator"></span>
                        Live
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderTournamentDetails = (tournament: Tournament) => {
    return (
      <div className="tournament-details-view">
        <div className="details-header">
          <button 
            className="btn btn-outline back-btn"
            onClick={() => setActiveTournament(null)}
          >
            Back to Tournaments
          </button>
          
          <h2>{tournament.name}</h2>
          
          <div className={`tournament-status ${tournament.status}`}>
            {tournament.status === 'registering' ? 'Registering' : 
             tournament.status === 'in_progress' ? 'In Progress' : 'Completed'}
          </div>
        </div>
        
        <div className="tournament-info">
          <div className="info-card">
            <h3>Tournament Information</h3>
            
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Entry Fee</span>
                <span className="info-value">₹{tournament.entryFee}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Prize Pool</span>
                <span className="info-value prize">₹{tournament.prizePool}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Start Time</span>
                <span className="info-value">
                  {formatDate(tournament.startTime)} at {formatTime(tournament.startTime)}
                </span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Format</span>
                <span className="info-value">Single Elimination</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Max Players</span>
                <span className="info-value">{tournament.maxPlayers}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Registered</span>
                <span className="info-value">{tournament.players.length}</span>
              </div>
            </div>
            
            {tournament.status === 'registering' && (
              <div className="registration-actions">
                {tournament.players.some(p => user && p.id === user.id) ? (
                  <div className="registered-badge">
                    You are registered for this tournament
                  </div>
                ) : (
                  <button 
                    className="btn btn-primary w-full"
                    onClick={() => handleRegister(tournament)}
                    disabled={isRegistering}
                  >
                    {isRegistering ? 'Registering...' : 'Register Now'}
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="prize-distribution">
            <h3>Prize Distribution</h3>
            
            <div className="prize-list">
              <div className="prize-item">
                <span className="prize-position">1st Place</span>
                <span className="prize-amount">₹{Math.floor(tournament.prizePool * 0.6)}</span>
              </div>
              
              <div className="prize-item">
                <span className="prize-position">2nd Place</span>
                <span className="prize-amount">₹{Math.floor(tournament.prizePool * 0.3)}</span>
              </div>
              
              <div className="prize-item">
                <span className="prize-position">3rd-4th Place</span>
                <span className="prize-amount">₹{Math.floor(tournament.prizePool * 0.05)} each</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="tournament-bracket-section">
          <h3>Tournament Bracket</h3>
          {renderTournamentBracket(tournament)}
        </div>
        
        <div className="registered-players">
          <h3>Registered Players ({tournament.players.length}/{tournament.maxPlayers})</h3>
          
          <div className="players-grid">
            {tournament.players.map(player => (
              <div key={player.id} className="player-card">
                <img 
                  src={player.avatar} 
                  alt={player.username} 
                  className="player-avatar"
                />
                <div className="player-info">
                  <div className="player-name">{player.username}</div>
                  <div className="player-elo">ELO: {player.elo}</div>
                </div>
              </div>
            ))}
            
            {tournament.status === 'registering' && 
             tournament.players.length < tournament.maxPlayers && 
             Array.from({ length: tournament.maxPlayers - tournament.players.length }, (_, i) => (
              <div key={`empty-${i}`} className="player-card empty">
                <div className="empty-slot">
                  Waiting for player...
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="tournament-page">
      <div className="tournament-header">
        <h1>Tournaments</h1>
        <p>Compete against other players and win big prizes</p>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
          <button 
            className="close-btn"
            onClick={() => setError(null)}
          >
            &times;
          </button>
        </div>
      )}
      
      {activeTournament ? renderTournamentDetails(activeTournament) : renderTournamentList()}
    </div>
  );
};

export default Tournament;