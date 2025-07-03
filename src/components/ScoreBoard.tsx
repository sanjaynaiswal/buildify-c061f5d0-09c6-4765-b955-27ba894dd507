
import './ScoreBoard.css';

interface ScoreBoardProps {
  scores: {
    X: number;
    O: number;
    ties: number;
  };
}

const ScoreBoard = ({ scores }: ScoreBoardProps) => {
  return (
    <div className="score-board">
      <div className="score x-score">
        <span className="score-label">X</span>
        <span className="score-value">{scores.X}</span>
      </div>
      <div className="score ties">
        <span className="score-label">Ties</span>
        <span className="score-value">{scores.ties}</span>
      </div>
      <div className="score o-score">
        <span className="score-label">O</span>
        <span className="score-value">{scores.O}</span>
      </div>
    </div>
  );
};

export default ScoreBoard;