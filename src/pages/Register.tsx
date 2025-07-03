
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext, User } from '../App';
import './Auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { setUser, setWallet } = useContext(UserContext);
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Create mock user data
      const mockUser: User = {
        id: 'user-' + Date.now(),
        username: username || email.split('@')[0],
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
      
      // Set initial wallet with signup bonus
      setWallet({
        balance: 100, // Signup bonus
        transactions: [{
          id: 'signup-bonus',
          type: 'deposit',
          amount: 100,
          timestamp: new Date(),
          status: 'completed',
          details: 'Signup bonus',
        }],
      });
      
      navigate('/');
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Create an Account</h1>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
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
              placeholder="Create a password"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>
          
          <div className="form-group">
            <div className="checkbox-container">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms" className="checkbox-label">
                I agree to the <a href="#" className="terms-link">Terms of Service</a> and <a href="#" className="terms-link">Privacy Policy</a>
              </label>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Register & Get ₹100 Bonus'}
          </button>
        </form>
        
        <div className="auth-links">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
        
        <div className="auth-divider">
          <span>OR</span>
        </div>
        
        <div className="social-login">
          <button className="btn btn-outline w-full">
            Register with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;