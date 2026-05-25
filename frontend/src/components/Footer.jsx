import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div>
          <div className="footer-logo">
            P<span style={{ color: 'var(--accent-color)' }}>✓</span>
          </div>
          <p className="footer-text" style={{ marginTop: '0.5rem' }}>
            Instant, modern, and beautiful polling.
          </p>
        </div>
        
        <p className="footer-text">
          &copy; {new Date().getFullYear()} PollVote. All rights reserved.
        </p>

        <ul className="footer-links">
          <li>
            <Link to="/" className="footer-link">Home</Link>
          </li>
          <li>
            <Link to="/create-poll" className="footer-link">Create Poll</Link>
          </li>
          <li>
            <Link to="/dashboard" className="footer-link">Dashboard</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
