import React from 'react';
import '../styles/results.css';

const ResultBar = ({ option, totalVotes, isWinner }) => {
  const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

  return (
    <div className="result-bar-container">
      <div 
        className="result-bar-fill" 
        style={{ width: `${percentage}%` }}
      ></div>
      <div className="result-bar-content">
        <span className="result-option-text">
          {option.text}
          {isWinner && (
            <span className="winner-checkmark" title="Winning Option">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
          )}
        </span>
        <span className="result-percentage">{percentage}%</span>
      </div>
    </div>
  );
};

export default ResultBar;
