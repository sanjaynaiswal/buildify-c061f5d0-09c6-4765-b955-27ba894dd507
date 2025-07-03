
import { useState, useEffect } from 'react';
import './Leaderboard.css';

interface LeaderboardPlayer {
  id: string;
  rank: number;
  username: string;
  avatar: string;
  wins: number;
  losses: number;
  elo: number;
  winnings: number;
}

const Leaderboard = () => {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'allTime'>('weekly');
  const [sortBy, setSortBy] = useState<'elo' | 'wins' | 'winnings'>('elo');
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call to get leaderboard data
    setTimeout(() => {
      // Generate mock data
      const mockPlayers: LeaderboardPlayer[] = Array.from({ length: 20 }, (_, i) => ({
        id: `player-${i + 1}`,
        rank: i + 1,
        username: `Player${i + 1}`,
        avatar: `https://via.placeholder.com/40?text=${i + 1}`,
        wins: Math.floor(Math.random() * 50) + 10,
        losses: Math.floor(Math.random() * 30) + 5,
        elo: Math.floor(Math.random() * 500) + 1000,
        winnings: Math.floor(Math.random() * 5000) + 500,
      }));
      
      // Sort based on selected criteria
      const sortedPlayers = [...mockPlayers].sort((a, b) => {
        if (sortBy === 'elo') return b.elo - a.elo;
        if (sortBy === 'wins') return b.wins - a.wins;
        return b.winnings - a.winnings;
      });
      
      // Update ranks
      sortedPlayers.forEach((player, index) => {
        player.rank = index + 1;
      });
      
      setPlayers(sortedPlayers);
      setIsLoading(false);
    }, 1000);
  }, [timeframe, sortBy]);
  
  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <h1>ZeroCross Leaderboard</h1>
        <p>See who's dominating the game</p>
      </div>
      
      <div className="leaderboard-filters">
        <div className="filter-group">
          <label>Timeframe</label>
          <div className="filter-options">
            <button 
              className={`filter-btn ${timeframe === 'daily' ? 'active' : ''}`}
              onClick={() => setTimeframe('daily')}
            >
              Daily
            </button>
            <button 
              className={`filter-btn ${timeframe === 'weekly' ? 'active' : ''}`}
              onClick={() => setTimeframe('weekly')}
            >
              Weekly
            </button>
            <button 
              className={`filter-btn ${timeframe === 'monthly' ? 'active' : ''}`}
              onClick={() => setTimeframe('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`filter-btn ${timeframe === 'allTime' ? 'active' : ''}`}
              onClick={() => setTimeframe('allTime')}
            >
              All Time
            </button>
          </div>
        </div>
        
        <div className="filter-group">
          <label>Sort By</label>
          <div className="filter-options">
            <button 
              className={`filter-btn ${sortBy === 'elo' ? 'active' : ''}`}
              onClick={() => setSortBy('elo')}
            >
              ELO Rating
            </button>
            <button 
              className={`filter-btn ${sortBy === 'wins' ? 'active' : ''}`}
              onClick={() => setSortBy('wins')}
            >
              Wins
            </button>
            <button 
              className={`filter-btn ${sortBy === 'winnings' ? 'active' : ''}`}
              onClick={() => setSortBy('winnings')}
            >
              Winnings
            </button>
          </div>
        </div>
      </div>
      
      <div className="leaderboard-table-container">
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading leaderboard...</p>
          </div>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Wins</th>
                <th>Losses</th>
                <th>Win Rate</th>
                <th>ELO</th>
                <th>Winnings</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id} className={player.rank <= 3 ? 'top-player' : ''}>
                  <td className="rank-cell">
                    {player.rank <= 3 ? (
                      <div className={`top-rank rank-${player.rank}`}>
                        {player.rank}
                      </div>
                    ) : (
                      player.rank
                    )}
                  </td>
                  <td className="player-cell">
                    <div className="player-info">
                      <img 
                        src={player.avatar} 
                        alt={player.username} 
                        className="player-avatar-small"
                      />
                      <span>{player.username}</span>
                    </div>
                  </td>
                  <td>{player.wins}</td>
                  <td>{player.losses}</td>
                  <td>
                    {Math.round((player.wins / (player.wins + player.losses)) * 100)}%
                  </td>
                  <td>{player.elo}</td>
                  <td className="winnings-cell">₹{player.winnings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;