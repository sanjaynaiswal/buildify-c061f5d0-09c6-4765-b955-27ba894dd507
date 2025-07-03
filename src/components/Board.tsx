
import Square from './Square';
import './Board.css';

type Player = 'X' | 'O' | null;

interface BoardProps {
  squares: Player[];
  onClick: (index: number) => void;
  winningCombination: number[] | null;
}

const Board = ({ squares, onClick, winningCombination }: BoardProps) => {
  const renderSquare = (index: number) => {
    const isWinningSquare = winningCombination?.includes(index);
    
    return (
      <Square 
        value={squares[index]} 
        onClick={() => onClick(index)} 
        isWinningSquare={isWinningSquare || false}
      />
    );
  };

  return (
    <div className="board">
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
};

export default Board;