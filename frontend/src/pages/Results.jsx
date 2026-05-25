import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as api from '../services/api';
import ResultBar from '../components/ResultBar';
import Loader from '../components/Loader';
import '../styles/results.css';

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPollResults = async () => {
      try {
        const { data } = await api.getPoll(id);
        setPoll(data);
      } catch (err) {
        console.error(err);
        setError('Could not fetch poll results.');
      } finally {
        setLoading(false);
      }
    };

    fetchPollResults();
    
    // Auto-refresh results every 10 seconds for real-time feel
    const interval = setInterval(fetchPollResults, 10000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return <Loader text="Calculating results..." />;
  }

  if (error || !poll) {
    return (
      <div className="container text-center" style={{ padding: '6rem 2rem' }}>
        <h2 style={{ color: 'var(--danger-color)', marginBottom: '1rem', fontWeight: 700 }}>Error</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{error || 'Poll not found'}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">Go Home</button>
      </div>
    );
  }

  // Find the winning option(s)
  const maxVotes = poll.options.reduce((max, opt) => (opt.votes > max ? opt.votes : max), 0);

  return (
    <div className="results-page">
      <div className="results-card">
        <h2 className="results-question">{poll.question}</h2>
        
        <div className="results-bars-list">
          {poll.options.map((option) => {
            // Option is a winner if it matches max votes AND max votes is greater than zero
            const isWinner = maxVotes > 0 && option.votes === maxVotes;
            
            return (
              <ResultBar
                key={option._id}
                option={option}
                totalVotes={poll.totalVotes}
                isWinner={isWinner}
              />
            );
          })}
        </div>

        <div className="results-total-votes">
          Total Votes: {poll.totalVotes.toLocaleString()}
        </div>
        
        <div className="text-center mt-6" style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-xl)' }}>
            All Polls
          </Link>
          <button 
            onClick={() => {
              setLoading(true);
              api.getPoll(id).then(({ data }) => {
                setPoll(data);
                setLoading(false);
              });
            }} 
            className="btn btn-dark" 
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-xl)', fontSize: '0.9rem' }}
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
