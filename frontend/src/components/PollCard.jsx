import React from 'react';
import { useNavigate } from 'react-router-dom';
import { hasVoted } from '../utils/helpers';
import '../styles/pollCard.css';

const PollCard = ({ poll }) => {
  const navigate = useNavigate();
  const alreadyVoted = hasVoted(poll._id);

  // Find option with most votes for display, or default to 0
  const maxVotes = poll.options.reduce((max, opt) => (opt.votes > max ? opt.votes : max), 0);
  const topPercentage = poll.totalVotes > 0 ? Math.round((maxVotes / poll.totalVotes) * 100) : 0;

  const handleCardClick = () => {
    if (alreadyVoted) {
      navigate(`/results/${poll._id}`);
    } else {
      navigate(`/vote/${poll._id}`);
    }
  };

  return (
    <div className="poll-card">
      <div>
        <h3 className="poll-card-question">{poll.question}</h3>
        
        <div className="poll-card-meta">
          <span>{poll.totalVotes.toLocaleString()} {poll.totalVotes === 1 ? 'vote' : 'votes'}</span>
          <span className="poll-card-creator">By {poll.creator?.name || 'Anonymous'}</span>
        </div>

        <div className="poll-card-progress-wrapper">
          <div 
            className="poll-card-progress-bar" 
            style={{ width: `${topPercentage || 15}%` }} // Default min-width for aesthetics
          ></div>
        </div>
      </div>

      <div className="poll-card-footer">
        <button className="poll-card-btn" onClick={handleCardClick}>
          {alreadyVoted ? 'View Results' : 'Vote Now'}
        </button>
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
          {poll.options.length} Options
        </span>
      </div>
    </div>
  );
};

export default PollCard;
