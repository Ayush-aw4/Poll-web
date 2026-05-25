import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../services/api';
import PollCard from '../components/PollCard';
import Loader from '../components/Loader';
import '../styles/home.css';

const Home = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const { data } = await api.getPolls();
        setPolls(data);
      } catch (err) {
        console.error('Error fetching polls:', err);
        setError('Could not fetch polls. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  const handleVoteNowClick = (e) => {
    e.preventDefault();
    const section = document.getElementById('recent-polls');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <h1 className="hero-title">
            Create & Share <br />
            <span>Instant Polls.</span>
          </h1>
          <p className="hero-subtitle">
            A polling application with simple control and runners.
          </p>
          <div className="hero-ctas">
            <Link to="/create-poll" className="btn hero-btn hero-btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ border: '2px solid', borderRadius: '50%', padding: '1px' }}>
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create a Poll
            </Link>
            <a href="#recent-polls" onClick={handleVoteNowClick} className="btn hero-btn hero-btn-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
              Vote Now
            </a>
          </div>
        </div>
      </section>

      {/* Recent Polls Section */}
      <section id="recent-polls" className="recent-polls-section">
        <div className="container">
          <h2 className="recent-polls-title">Recent Polls</h2>
          
          {loading ? (
            <Loader text="Fetching latest polls..." />
          ) : error ? (
            <div className="text-center" style={{ color: 'var(--danger-color)', padding: '2rem' }}>
              {error}
            </div>
          ) : polls.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🗳️</div>
              <h3 className="mb-2" style={{ fontWeight: 700 }}>No Polls Yet</h3>
              <p className="empty-state-text">Be the first to create a poll and share it with the world!</p>
              <Link to="/create-poll" className="btn btn-primary">
                Create Poll
              </Link>
            </div>
          ) : (
            <div className="polls-grid">
              {polls.map((poll) => (
                <PollCard key={poll._id} poll={poll} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
