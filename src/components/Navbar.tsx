
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import './Navbar.css';

const Navbar = () => {
  const { user, setUser, wallet } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          ZeroCross
        </Link>
        
        <div className="navbar-links">
          <Link to="/leaderboard" className="navbar-link">Leaderboard</Link>
          
          {user ? (
            <>
              {!user.isGuest && (
                <div className="wallet-display">
                  ₹{wallet.balance.toFixed(2)}
                </div>
              )}
              <div className="navbar-dropdown">
                <button className="navbar-dropdown-btn">
                  <img 
                    src={user.avatar || 'https://via.placeholder.com/40'} 
                    alt={user.username} 
                    className="avatar-small"
                  />
                  <span>{user.username}</span>
                  {user.isGuest && <span className="guest-badge">Guest</span>}
                </button>
                <div className="navbar-dropdown-content">
                  {!user.isGuest ? (
                    <>
                      <Link to="/profile" className="dropdown-item">Profile</Link>
                      <Link to="/wallet" className="dropdown-item">Wallet</Link>
                      <Link to="/github" className="dropdown-item">
                        <svg height="16" viewBox="0 0 16 16" width="16" className="github-icon">
                          <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                        </svg>
                        GitHub Integration
                      </Link>
                      <button onClick={handleLogout} className="dropdown-item logout-btn">
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/register" className="dropdown-item">Create Account</Link>
                      <button onClick={handleLogout} className="dropdown-item logout-btn">
                        Exit Guest Mode
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;