import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/global.css';

const NotFound = () => {
  return (
    <div className="flex-center" style={{ flexDirection: 'column', minHeight: 'calc(100vh - 4rem - 9rem)', padding: '2rem' }}>
      <h1 style={{ fontSize: '6rem', fontWeight: 800, color: 'var(--primary-color)', lineHeight: 1 }}>404</h1>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '1rem', marginBottom: '0.5rem' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', textAlign: 'center', maxWidth: '400px' }}>
        The page you are looking for does not exist, has been removed, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn btn-primary" style={{ borderRadius: 'var(--radius-xl)' }}>
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
