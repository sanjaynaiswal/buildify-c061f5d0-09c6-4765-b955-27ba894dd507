
import { useContext, useState } from 'react';
import { UserContext } from '../App';
import './Profile.css';

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  
  if (!user) {
    return null;
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (user) {
      setUser({
        ...user,
        username,
        email,
      });
      
      setIsEditing(false);
    }
  };
  
  const calculateWinRate = () => {
    const totalGames = user.stats.wins + user.stats.losses + user.stats.draws;
    if (totalGames === 0) return 0;
    return Math.round((user.stats.wins / totalGames) * 100);
  };
  
  const getRankTitle = (elo: number) => {
    if (elo < 900) return 'Novice';
    if (elo < 1000) return 'Beginner';
    if (elo < 1100) return 'Amateur';
    if (elo < 1200) return 'Skilled';
    if (elo < 1300) return 'Expert';
    if (elo < 1400) return 'Master';
    if (elo < 1500) return 'Grandmaster';
    return 'Legend';
  };
  
  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar-container">
          <img 
            src={user.avatar || 'https://via.placeholder.com/150'} 
            alt={user.username} 
            className="profile-avatar"
          />
          <button className="change-avatar-btn">
            Change
          </button>
        </div>
        
        <div className="profile-info">
          <h1>{user.username}</h1>
          <div className="rank-badge">
            {getRankTitle(user.stats.elo)}
          </div>
          {user.githubConnected && (
            <div className="github-badge">
              <svg height="16" viewBox="0 0 16 16" width="16">
                <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              <a 
                href={`https://github.com/${user.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {user.githubUsername}
              </a>
            </div>
          )}
        </div>
        
        {!isEditing && (
          <button 
            className="btn btn-outline edit-profile-btn"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
      
      {isEditing ? (
        <div className="profile-edit-form card">
          <h2>Edit Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={() => {
                  setIsEditing(false);
                  setUsername(user.username);
                  setEmail(user.email);
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-value">{user.stats.wins}</div>
              <div className="stat-label">Wins</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{user.stats.losses}</div>
              <div className="stat-label">Losses</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{user.stats.draws}</div>
              <div className="stat-label">Draws</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{calculateWinRate()}%</div>
              <div className="stat-label">Win Rate</div>
            </div>
          </div>
          
          <div className="profile-details card">
            <h2>Player Details</h2>
            
            <div className="detail-item">
              <div className="detail-label">Username</div>
              <div className="detail-value">{user.username}</div>
            </div>
            
            <div className="detail-item">
              <div className="detail-label">Email</div>
              <div className="detail-value">{user.email}</div>
            </div>
            
            <div className="detail-item">
              <div className="detail-label">ELO Rating</div>
              <div className="detail-value">{user.stats.elo}</div>
            </div>
            
            <div className="detail-item">
              <div className="detail-label">Rank</div>
              <div className="detail-value">{getRankTitle(user.stats.elo)}</div>
            </div>
            
            {user.githubConnected ? (
              <div className="detail-item">
                <div className="detail-label">GitHub</div>
                <div className="detail-value">
                  <a 
                    href={`https://github.com/${user.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-link"
                  >
                    <svg height="16" viewBox="0 0 16 16" width="16">
                      <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                    </svg>
                    {user.githubUsername}
                  </a>
                </div>
              </div>
            ) : (
              <div className="detail-item">
                <div className="detail-label">GitHub</div>
                <div className="detail-value">
                  <a 
                    href="/github"
                    className="connect-github-link"
                  >
                    Connect GitHub Account
                  </a>
                </div>
              </div>
            )}
          </div>
          
          <div className="achievements card">
            <h2>Achievements</h2>
            
            <div className="achievement-list">
              <div className="achievement-item locked">
                <div className="achievement-icon">🏆</div>
                <div className="achievement-details">
                  <div className="achievement-name">First Victory</div>
                  <div className="achievement-description">Win your first game</div>
                </div>
                <div className="achievement-status">Locked</div>
              </div>
              
              <div className="achievement-item locked">
                <div className="achievement-icon">🔥</div>
                <div className="achievement-details">
                  <div className="achievement-name">Win Streak</div>
                  <div className="achievement-description">Win 3 games in a row</div>
                </div>
                <div className="achievement-status">Locked</div>
              </div>
              
              <div className="achievement-item locked">
                <div className="achievement-icon">💰</div>
                <div className="achievement-details">
                  <div className="achievement-name">Big Winner</div>
                  <div className="achievement-description">Win ₹1000 in total</div>
                </div>
                <div className="achievement-status">Locked</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;