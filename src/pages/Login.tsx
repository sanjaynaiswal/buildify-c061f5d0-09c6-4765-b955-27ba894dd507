
import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserContext, User } from '../App';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { setUser, setWallet } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the return URL if it exists
  const returnUrl = location.state?.returnUrl || '/';
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // For demo purposes, any email/password combination works
      if (email && password) {
        // Create mock user data
        const mockUser: User = {
          id: 'user-' + Date.now(),
          username: email.split('@')[0],
          email,
          avatar: 'https://via.placeholder.com/150',
          stats: {
            wins: 0,
            losses: 0,
            draws: 0,
            elo: 1000,
          },
        };
        
        setUser(mockUser);
        
        // Set initial wallet with bonus
        setWallet({
          balance: 50, // Starting bonus
          transactions: [{
            id: 'welcome-bonus',
            type: 'deposit',
            amount: 50,
            timestamp: new Date(),
            status: 'completed',
            details: 'Welcome bonus',
          }],
        });
        
        navigate(returnUrl);
      } else {
        setError('Please enter both email and password');
      }
      setIsLoading(false);
    }, 1000);
  };
  
  const handleGuestPlay = () => {
    navigate('/game/guest');
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Login to ZeroCross</h1>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="auth-links">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
        
        <div className="auth-divider">
          <span>OR</span>
        </div>
        
        <div className="social-login">
          <button className="btn btn-outline w-full">
            Continue with Google
          </button>
          
          <button 
            className="btn btn-outline w-full mt-2 guest-button"
            onClick={handleGuestPlay}
          >
            Play as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;