import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { hasVoted, markAsVoted } from '../utils/helpers';
import Loader from '../components/Loader';
import '../styles/vote.css';

// SVG Icons matching the style of the screenshot
const ICONS = [
  // Icon 1: Scram design (ballot/layout)
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="3" y1="9" x2="21" y2="9"></line>
    <line x1="9" y1="21" x2="9" y2="9"></line>
    <path d="M14 13h3M14 17h3"></path>
  </svg>,
  // Icon 2: Minimalist Blue (user interface)
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="12" cy="10" r="3"></circle>
    <path d="M7 21v-2a5 5 0 0 1 10 0v2"></path>
  </svg>,
  // Icon 3: Corutary design (copyright interface)
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M15 9.354a4 4 0 1 0 0 5.292"></path>
  </svg>,
  // Icon 4: Mirloon design (document/newspaper)
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>,
  // Default Icon 5: ballot check
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 12 2 2 4-4"></path>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
  </svg>,
  // Default Icon 6: bars
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
];

const Vote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check duplicate vote immediately on mount
    if (hasVoted(id)) {
      navigate(`/results/${id}`);
      return;
    }

    const fetchPoll = async () => {
      try {
        const { data } = await api.getPoll(id);
        setPoll(data);
      } catch (err) {
        console.error(err);
        setError('Poll not found or could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [id, navigate]);

  const handleSelectOption = (optionId) => {
    setSelectedOptionId(optionId);
  };

  const handleVoteSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOptionId) return;

    setSubmitLoading(true);
    try {
      await api.votePoll(id, selectedOptionId);
      markAsVoted(id);
      navigate(`/results/${id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit vote. Please try again.');
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <Loader text="Loading ballot paper..." />;
  }

  if (error && !poll) {
    return (
      <div className="container text-center" style={{ padding: '6rem 2rem' }}>
        <h2 style={{ color: 'var(--danger-color)', marginBottom: '1rem', fontWeight: 700 }}>Error</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{error}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">Go Home</button>
      </div>
    );
  }

  return (
    <div className="vote-page">
      <div className="vote-card-container">
        <h2 className="vote-question">{poll.question}</h2>
        
        {error && <div className="vote-alert">{error}</div>}

        <form onSubmit={handleVoteSubmit}>
          <div className="vote-options-grid">
            {poll.options.map((option, index) => {
              const isSelected = selectedOptionId === option._id;
              // Map option index to one of our preset icons
              const icon = ICONS[index] || ICONS[4];

              return (
                <div 
                  key={option._id}
                  className={`vote-option-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectOption(option._id)}
                >
                  <div className="vote-option-icon">
                    {icon}
                  </div>
                  <span className="vote-option-text">{option.text}</span>
                </div>
              );
            })}
          </div>

          <button
            type="submit"
            className="submit-vote-btn"
            disabled={!selectedOptionId || submitLoading}
          >
            {submitLoading ? 'Submitting Vote...' : 'Vote'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Vote;
