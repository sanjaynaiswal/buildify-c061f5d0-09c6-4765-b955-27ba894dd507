
import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserContext, User } from '../App';
import './Auth.css';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  
  const { setUser, setWallet } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the return URL if it exists
  const returnUrl = location.state?.returnUrl || '/';
  
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // For demo purposes, check if password is "password123"
      if (email && password) {
        if (password === "password123") {
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
            balance: 100, // Starting bonus
            transactions: [{
              id: 'welcome-bonus',
              type: 'deposit',
              amount: 100,
              timestamp: new Date(),
              status: 'completed',
              details: 'Welcome bonus',
            }],
          });
          
          navigate(returnUrl);
        } else {
          setError('Incorrect password. Please try again.');
        }
      } else {
        setError('Please enter both email and password');
      }
      setIsLoading(false);
    }, 1000);
  };
  
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setError('Please enter a valid 10-digit phone number');
      setIsLoading(false);
      return;
    }
    
    // Simulate API call to send OTP
    setTimeout(() => {
      setOtpSent(true);
      setIsLoading(false);
    }, 1000);
  };
  
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Validate OTP
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      setIsLoading(false);
      return;
    }
    
    // Simulate API call to verify OTP
    setTimeout(() => {
      // For demo purposes, any OTP works
      // Create mock user data
      const mockUser: User = {
        id: 'user-' + Date.now(),
        username: `user${phone.slice(-4)}`,
        email: `user${phone.slice(-4)}@example.com`,
        phone,
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
        balance: 100, // Starting bonus
        transactions: [{
          id: 'welcome-bonus',
          type: 'deposit',
          amount: 100,
          timestamp: new Date(),
          status: 'completed',
          details: 'Welcome bonus',
        }],
      });
      
      navigate(returnUrl);
      setIsLoading(false);
    }, 1000);
  };
  
  const handleGuestPlay = () => {
    navigate('/game/computer');
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Login to ZeroCross</h1>
        
        <div className="login-tabs">
          <button 
            className={`login-tab ${loginMethod === 'email' ? 'active' : ''}`}
            onClick={() => setLoginMethod('email')}
          >
            Email
          </button>
          <button 
            className={`login-tab ${loginMethod === 'phone' ? 'active' : ''}`}
            onClick={() => setLoginMethod('phone')}
          >
            Phone
          </button>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        {loginMethod === 'email' ? (
          <form onSubmit={handleEmailLogin} className="auth-form">
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
        ) : (
          <>
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="auth-form">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
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
                      required
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="auth-form">
                <div className="form-group">
                  <label htmlFor="otp">Enter OTP sent to +91 {phone}</label>
                  <input
                    type="text"
                    id="otp"
                    className="form-control otp-input"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    pattern="[0-9]{6}"
                    required
                  />
                  <div className="resend-otp">
                    <button type="button" className="resend-btn" onClick={handleSendOtp}>
                      Resend OTP
                    </button>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Verifying...' : 'Verify & Login'}
                </button>
              </form>
            )}
          </>
        )}
        
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