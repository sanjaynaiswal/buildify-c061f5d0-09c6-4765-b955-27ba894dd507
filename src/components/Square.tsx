
import './Square.css';

interface SquareProps {
  value: string | null;
  onClick: () => void;
  isWinning: boolean;
  isAnimating: boolean;
}

const Square = ({ value, onClick, isWinning, isAnimating }: SquareProps) => {
  const squareClass = `square 
    ${value === 'X' ? 'x-square' : value === 'O' ? 'o-square' : ''} 
    ${isWinning ? 'winning' : ''} 
    ${isAnimating && !value ? 'pulse' : ''}`;

  return (
    <button className={squareClass} onClick={onClick}>
      {value && <span className="square-value">{value}</span>}
    </button>
  );
};

export default Square;