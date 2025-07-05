
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext, User } from '../App';
import './Auth.css';

const Register = () => {
  const [registerMethod, setRegisterMethod] = useState<'email' | 'phone'>('email');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  
  const { setUser, setWallet } = useContext(UserContext);
  const navigate = useNavigate();
  
  const handleEmailRegister = (e: React.FormEvent) => {
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
  
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call to send OTP
    setTimeout(() => {
      setOtpSent(true);
      setIsLoading(false);
    }, 1000);
  };
  
  const handlePhoneRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate OTP
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Create mock user data
      const mockUser: User = {
        id: 'user-' + Date.now(),
        username: username || `user${phone.slice(-4)}`,
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
        
        <div className="login-tabs">
          <button 
            className={`login-tab ${registerMethod === 'email' ? 'active' : ''}`}
            onClick={() => setRegisterMethod('email')}
          >
            Email
          </button>
          <button 
            className={`login-tab ${registerMethod === 'phone' ? 'active' : ''}`}
            onClick={() => setRegisterMethod('phone')}
          >
            Phone
          </button>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        {registerMethod === 'email' ? (
          <form onSubmit={handleEmailRegister} className="auth-form">
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
        ) : (
          <>
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="auth-form">
                <div className="form-group">
                  <label htmlFor="username">Username (Optional)</label>
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
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePhoneRegister} className="auth-form">
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
                  {isLoading ? 'Creating Account...' : 'Verify & Register'}
                </button>
              </form>
            )}
          </>
        )}
        
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