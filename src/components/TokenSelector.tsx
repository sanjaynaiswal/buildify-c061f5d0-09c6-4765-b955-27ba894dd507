
import { useState } from 'react';
import './TokenSelector.css';

interface TokenSelectorProps {
  onSelect: (amount: number) => void;
  maxAmount: number;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({ onSelect, maxAmount }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  
  const tokenOptions = [5, 10, 20, 40, 100, 200, 500, 1000, 2000, 5000, 10000];
  
  const handleSelect = (amount: number) => {
    if (amount <= maxAmount) {
      setSelectedAmount(amount);
      onSelect(amount);
    }
  };
  
  return (
    <div className="token-selector">
      <h3 className="token-selector-title">Select Stake Amount</h3>
      
      <div className="token-grid">
        {tokenOptions.map(amount => (
          <button
            key={amount}
            className={`token-option ${selectedAmount === amount ? 'selected' : ''} ${amount > maxAmount ? 'disabled' : ''}`}
            onClick={() => handleSelect(amount)}
            disabled={amount > maxAmount}
          >
            ₹{amount}
            {amount > maxAmount && <div className="insufficient-overlay">Insufficient</div>}
          </button>
        ))}
      </div>
      
      {selectedAmount && (
        <div className="token-info">
          <div className="token-detail">
            <span>Entry Fee:</span>
            <span>₹{selectedAmount}</span>
          </div>
          <div className="token-detail">
            <span>Potential Win:</span>
            <span>₹{Math.floor(selectedAmount * 1.8)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenSelector;