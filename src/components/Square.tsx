
import './Square.css';

interface SquareProps {
  value: 'X' | 'O' | null;
  onClick: () => void;
  isWinningSquare: boolean;
}

const Square = ({ value, onClick, isWinningSquare }: SquareProps) => {
  const squareClass = `square ${value ? (value === 'X' ? 'x' : 'o') : ''} ${isWinningSquare ? 'winning' : ''}`;
  
  return (
    <button className={squareClass} onClick={onClick}>
      {value}
    </button>
  );
};

export default Square;