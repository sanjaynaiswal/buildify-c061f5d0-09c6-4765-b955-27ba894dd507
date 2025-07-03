
import { useState, useContext } from 'react';
import { UserContext, Transaction } from '../App';
import './Wallet.css';

const Wallet = () => {
  const { wallet, setWallet } = useContext(UserContext);
  const [amount, setAmount] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [activePaymentMethod, setActivePaymentMethod] = useState<'razorpay' | 'upi' | 'qr' | 'netbanking'>('razorpay');
  
  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      const depositAmount = parseFloat(amount);
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'deposit',
        amount: depositAmount,
        timestamp: new Date(),
        status: 'completed',
        details: 'Deposit via demo',
      };
      
      setWallet({
        balance: wallet.balance + depositAmount,
        transactions: [newTransaction, ...wallet.transactions],
      });
      
      setAmount('');
      setIsProcessing(false);
    }, 1500);
  };
  
  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    
    const withdrawValue = parseFloat(withdrawAmount);
    
    if (!withdrawAmount || withdrawValue <= 0 || withdrawValue > wallet.balance) {
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'withdrawal',
        amount: withdrawValue,
        timestamp: new Date(),
        status: 'completed',
        details: 'Withdrawal to demo account',
      };
      
      setWallet({
        balance: wallet.balance - withdrawValue,
        transactions: [newTransaction, ...wallet.transactions],
      });
      
      setWithdrawAmount('');
      setIsProcessing(false);
    }, 1500);
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return '⬇️';
      case 'withdrawal':
        return '⬆️';
      case 'win':
        return '🏆';
      case 'loss':
        return '📉';
      case 'refund':
        return '🔄';
      default:
        return '💰';
    }
  };
  
  return (
    <div className="wallet-page">
      <div className="wallet-header">
        <h1>My Wallet</h1>
        <div className="wallet-balance">
          <span className="balance-label">Available Balance</span>
          <span className="balance-amount">₹{wallet.balance.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="wallet-tabs">
        <button 
          className={`tab-btn ${activeTab === 'deposit' ? 'active' : ''}`}
          onClick={() => setActiveTab('deposit')}
        >
          Add Money
        </button>
        <button 
          className={`tab-btn ${activeTab === 'withdraw' ? 'active' : ''}`}
          onClick={() => setActiveTab('withdraw')}
        >
          Withdraw
        </button>
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'deposit' && (
          <div className="deposit-section">
            <form onSubmit={handleDeposit}>
              <div className="form-group">
                <label htmlFor="amount">Amount to Add</label>
                <div className="amount-input">
                  <span className="currency-symbol">₹</span>
                  <input
                    type="number"
                    id="amount"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="10"
                    step="1"
                    required
                  />
                </div>
              </div>
              
              <div className="quick-amounts">
                <button 
                  type="button" 
                  className="amount-chip"
                  onClick={() => setAmount('100')}
                >
                  ₹100
                </button>
                <button 
                  type="button" 
                  className="amount-chip"
                  onClick={() => setAmount('200')}
                >
                  ₹200
                </button>
                <button 
                  type="button" 
                  className="amount-chip"
                  onClick={() => setAmount('500')}
                >
                  ₹500
                </button>
                <button 
                  type="button" 
                  className="amount-chip"
                  onClick={() => setAmount('1000')}
                >
                  ₹1000
                </button>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={isProcessing || !amount || parseFloat(amount) <= 0}
              >
                {isProcessing ? 'Processing...' : 'Add Money'}
              </button>
            </form>
            
            <div className="payment-methods">
              <h3>Payment Methods</h3>
              <div className="payment-options">
                <div 
                  className={`payment-option ${activePaymentMethod === 'razorpay' ? 'active' : ''}`}
                  onClick={() => setActivePaymentMethod('razorpay')}
                >
                  <div className="payment-icon">💳</div>
                  <div>Razorpay</div>
                </div>
                <div 
                  className={`payment-option ${activePaymentMethod === 'upi' ? 'active' : ''}`}
                  onClick={() => setActivePaymentMethod('upi')}
                >
                  <div className="payment-icon">📱</div>
                  <div>UPI</div>
                </div>
                <div 
                  className={`payment-option ${activePaymentMethod === 'qr' ? 'active' : ''}`}
                  onClick={() => setActivePaymentMethod('qr')}
                >
                  <div className="payment-icon">🔄</div>
                  <div>QR Code</div>
                </div>
                <div 
                  className={`payment-option ${activePaymentMethod === 'netbanking' ? 'active' : ''}`}
                  onClick={() => setActivePaymentMethod('netbanking')}
                >
                  <div className="payment-icon">🏦</div>
                  <div>Net Banking</div>
                </div>
              </div>
              
              <div className="payment-details">
                {activePaymentMethod === 'razorpay' && (
                  <div className="razorpay-details">
                    <div className="razorpay-logo">
                      <img src="https://via.placeholder.com/150x50?text=Razorpay" alt="Razorpay" />
                    </div>
                    <p>Fast and secure payments with Razorpay</p>
                    <div className="razorpay-cards">
                      <span className="card-icon">💳 Visa</span>
                      <span className="card-icon">💳 Mastercard</span>
                      <span className="card-icon">💳 RuPay</span>
                    </div>
                  </div>
                )}
                
                {activePaymentMethod === 'upi' && (
                  <div className="upi-details">
                    <h4>Pay using UPI</h4>
                    <div className="upi-apps">
                      <div className="upi-app">
                        <div className="upi-app-icon">📱</div>
                        <div>Google Pay</div>
                      </div>
                      <div className="upi-app">
                        <div className="upi-app-icon">📱</div>
                        <div>PhonePe</div>
                      </div>
                      <div className="upi-app">
                        <div className="upi-app-icon">📱</div>
                        <div>Paytm</div>
                      </div>
                      <div className="upi-app">
                        <div className="upi-app-icon">📱</div>
                        <div>BHIM</div>
                      </div>
                    </div>
                    <div className="upi-input">
                      <label htmlFor="upiId">Enter UPI ID</label>
                      <input 
                        type="text" 
                        id="upiId" 
                        className="form-control" 
                        placeholder="yourname@upi"
                      />
                    </div>
                  </div>
                )}
                
                {activePaymentMethod === 'qr' && (
                  <div className="qr-details">
                    <h4>Scan QR Code to Pay</h4>
                    <div className="qr-code-container">
                      <div className="qr-code">
                        <img src="https://via.placeholder.com/200?text=QR+Code" alt="QR Code" />
                      </div>
                      <div className="qr-instructions">
                        <p>1. Open any UPI app on your phone</p>
                        <p>2. Scan this QR code</p>
                        <p>3. Complete the payment</p>
                        <p>4. Your account will be credited automatically</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activePaymentMethod === 'netbanking' && (
                  <div className="netbanking-details">
                    <h4>Pay using Net Banking</h4>
                    <div className="bank-list">
                      <div className="bank-option">
                        <div className="bank-icon">🏦</div>
                        <div>SBI</div>
                      </div>
                      <div className="bank-option">
                        <div className="bank-icon">🏦</div>
                        <div>HDFC</div>
                      </div>
                      <div className="bank-option">
                        <div className="bank-icon">🏦</div>
                        <div>ICICI</div>
                      </div>
                      <div className="bank-option">
                        <div className="bank-icon">🏦</div>
                        <div>Axis</div>
                      </div>
                      <div className="bank-option">
                        <div className="bank-icon">🏦</div>
                        <div>Other Banks</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'withdraw' && (
          <div className="withdraw-section">
            <form onSubmit={handleWithdraw}>
              <div className="form-group">
                <label htmlFor="withdrawAmount">Amount to Withdraw</label>
                <div className="amount-input">
                  <span className="currency-symbol">₹</span>
                  <input
                    type="number"
                    id="withdrawAmount"
                    className="form-control"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="10"
                    max={wallet.balance.toString()}
                    step="1"
                    required
                  />
                </div>
                <small className="form-text">
                  Min: ₹10, Max: ₹{wallet.balance.toFixed(2)}
                </small>
              </div>
              
              <div className="form-group">
                <label htmlFor="withdrawMethod">Withdraw To</label>
                <select id="withdrawMethod" className="form-control">
                  <option value="upi">UPI</option>
                  <option value="bank">Bank Account</option>
                  <option value="paytm">Paytm</option>
                </select>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={
                  isProcessing || 
                  !withdrawAmount || 
                  parseFloat(withdrawAmount) <= 0 || 
                  parseFloat(withdrawAmount) > wallet.balance
                }
              >
                {isProcessing ? 'Processing...' : 'Withdraw Money'}
              </button>
            </form>
            
            <div className="withdraw-info">
              <h3>Withdrawal Information</h3>
              <ul className="info-list">
                <li>Withdrawals are processed within 24 hours</li>
                <li>Minimum withdrawal amount is ₹10</li>
                <li>KYC verification required for withdrawals above ₹10,000</li>
              </ul>
            </div>
          </div>
        )}
        
        {activeTab === 'history' && (
          <div className="history-section">
            <h3>Transaction History</h3>
            
            {wallet.transactions.length === 0 ? (
              <div className="empty-state">
                <p>No transactions yet</p>
              </div>
            ) : (
              <div className="transaction-list">
                {wallet.transactions.map((transaction) => (
                  <div key={transaction.id} className="transaction-item">
                    <div className="transaction-icon">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="transaction-details">
                      <div className="transaction-title">
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </div>
                      <div className="transaction-date">
                        {formatDate(transaction.timestamp)}
                      </div>
                      {transaction.details && (
                        <div className="transaction-description">
                          {transaction.details}
                        </div>
                      )}
                    </div>
                    <div className={`transaction-amount ${transaction.type === 'win' || transaction.type === 'deposit' || transaction.type === 'refund' ? 'credit' : 'debit'}`}>
                      {transaction.type === 'win' || transaction.type === 'deposit' || transaction.type === 'refund' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;