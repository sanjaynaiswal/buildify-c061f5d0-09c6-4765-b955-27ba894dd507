
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, createContext } from 'react';
import Home from './pages/Home';
import Game from './pages/Game';
import Profile from './pages/Profile';
import Wallet from './pages/Wallet';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Create context for user and wallet data
export const UserContext = createContext<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  wallet: Wallet;
  setWallet: React.Dispatch<React.SetStateAction<Wallet>>;
}>({
  user: null,
  setUser: () => {},
  wallet: { balance: 0, transactions: [] },
  setWallet: () => {},
});

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  isGuest?: boolean;
  stats: {
    wins: number;
    losses: number;
    draws: number;
    elo: number;
  };
}

export interface Wallet {
  balance: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'win' | 'loss' | 'refund';
  amount: number;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  details?: string;
}

function App() {
  // Mock user data for development
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<Wallet>({
    balance: 0,
    transactions: [],
  });

  return (
    <UserContext.Provider value={{ user, setUser, wallet, setWallet }}>
      <Router>
        <div className="app">
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/game/guest" element={<Game />} />
              <Route path="/game/free" element={<Game />} />
              <Route 
                path="/game/:mode" 
                element={
                  <ProtectedRoute>
                    <Game />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/wallet" 
                element={
                  <ProtectedRoute>
                    <Wallet />
                  </ProtectedRoute>
                } 
              />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
          </div>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;