
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import './Home.css';

const Home = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">ZeroCross</h1>
        <p className="hero-subtitle">Play Tic-Tac-Toe. Win Real Money.</p>
        
        <div className="game-modes">
          <Link to="/game/computer" className="game-mode-card">
            <div className="game-mode-icon">🤖</div>
            <h3>Computer Play</h3>
            <p>Practice against AI - No stakes</p>
          </Link>
          
          <Link to="/game/online" className="game-mode-card">
            <div className="game-mode-icon">🌐</div>
            <h3>Online Play</h3>
            <p>Play against other players for free</p>
          </Link>
          
          <Link to={user ? "/game/paid" : "/login"} className="game-mode-card premium">
            <div className="game-mode-icon">💰</div>
            <h3>Paid Match</h3>
            <p>Multiple stake levels - Win real money</p>
            {!user && <div className="login-required">Login Required</div>}
          </Link>
          
          <Link to={user ? "/tournament" : "/login"} className="game-mode-card premium">
            <div className="game-mode-icon">🏆</div>
            <h3>Tournament</h3>
            <p>Entry fee ₹50 - Prize pool ₹450</p>
            {!user && <div className="login-required">Login Required</div>}
          </Link>
          
          <Link to={user ? "/game/challenge" : "/login"} className="game-mode-card">
            <div className="game-mode-icon">👥</div>
            <h3>Challenge Friend</h3>
            <p>Create a private room and set your own stakes</p>
            {!user && <div className="login-required">Login Required</div>}
          </Link>
        </div>
      </div>
      
      <div className="features-section">
        <h2>Why Play ZeroCross?</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💸</div>
            <h3>Win Real Money</h3>
            <p>Turn your skills into cash with every win</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Instant Withdrawals</h3>
            <p>Get your winnings instantly via UPI</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🏅</div>
            <h3>Competitive Ranking</h3>
            <p>Climb the leaderboard and earn rewards</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎁</div>
            <h3>Referral Bonuses</h3>
            <p>Invite friends and earn ₹10 for each signup</p>
          </div>
        </div>
      </div>
      
      <div className="cta-section">
        <h2>Ready to Play?</h2>
        <p>Join thousands of players winning real money right now</p>
        {user ? (
          <Link to="/game/paid" className="btn btn-primary cta-button">Play Now</Link>
        ) : (
          <Link to="/register" className="btn btn-primary cta-button">Sign Up & Get ₹100 Bonus</Link>
        )}
      </div>
    </div>
  );
};

export default Home;