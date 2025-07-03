
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