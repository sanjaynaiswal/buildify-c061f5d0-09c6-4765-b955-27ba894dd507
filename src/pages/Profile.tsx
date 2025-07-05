
import { useContext, useState, useRef } from 'react';
import { UserContext } from '../App';
import './Profile.css';

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isChangingAvatar, setIsChangingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
        phone,
      });
      
      setIsEditing(false);
    }
  };
  
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
        setIsChangingAvatar(true);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveAvatar = () => {
    if (avatarPreview && user) {
      setUser({
        ...user,
        avatar: avatarPreview,
      });
      setIsChangingAvatar(false);
      setAvatarPreview(null);
    }
  };
  
  const handleCancelAvatarChange = () => {
    setIsChangingAvatar(false);
    setAvatarPreview(null);
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
            src={isChangingAvatar && avatarPreview ? avatarPreview : user.avatar || 'https://via.placeholder.com/150'} 
            alt={user.username} 
            className="profile-avatar"
            onClick={handleAvatarClick}
          />
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept="image/*"
            onChange={handleAvatarChange}
          />
          {isChangingAvatar ? (
            <div className="avatar-actions">
              <button 
                className="btn btn-sm btn-primary save-avatar-btn"
                onClick={handleSaveAvatar}
              >
                Save
              </button>
              <button 
                className="btn btn-sm btn-outline cancel-avatar-btn"
                onClick={handleCancelAvatarChange}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button 
              className="change-avatar-btn"
              onClick={handleAvatarClick}
            >
              Change
            </button>
          )}
        </div>
        
        <div className="profile-info">
          <h1>{user.username}</h1>
          <div className="rank-badge">
            {getRankTitle(user.stats.elo)}
          </div>
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
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number (Optional)</label>
              <div className="phone-input-container">
                <span className="country-code">+91</span>
                <input
                  type="tel"
                  id="phone"
                  className="form-control phone-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your 10-digit phone number"
                  maxLength={10}
                  pattern="[0-9]{10}"
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={() => {
                  setIsEditing(false);
                  setUsername(user.username);
                  setEmail(user.email);
                  setPhone(user.phone || '');
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
            
            {user.phone && (
              <div className="detail-item">
                <div className="detail-label">Phone</div>
                <div className="detail-value">+91 {user.phone}</div>
              </div>
            )}
            
            <div className="detail-item">
              <div className="detail-label">ELO Rating</div>
              <div className="detail-value">{user.stats.elo}</div>
            </div>
            
            <div className="detail-item">
              <div className="detail-label">Rank</div>
              <div className="detail-value">{getRankTitle(user.stats.elo)}</div>
            </div>
          </div>
          
          <div className="achievements card">
            <h2>Achievements</h2>
            
            <div className="achievement-list">
              <div className={`achievement-item ${user.stats.wins > 0 ? 'unlocked' : 'locked'}`}>
                <div className="achievement-icon">🏆</div>
                <div className="achievement-details">
                  <div className="achievement-name">First Victory</div>
                  <div className="achievement-description">Win your first game</div>
                </div>
                <div className="achievement-status">
                  {user.stats.wins > 0 ? 'Unlocked' : 'Locked'}
                </div>
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