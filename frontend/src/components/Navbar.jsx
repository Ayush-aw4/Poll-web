import React, { useContext, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo" onClick={handleLinkClick}>
          P<span className="logo-tick">✓</span>
        </Link>

        <button className="navbar-toggle" onClick={handleToggle} aria-label="Toggle Navigation">
          <span style={{ transform: isOpen ? 'rotate(45deg) translate(6px, 6px)' : 'none' }}></span>
          <span style={{ opacity: isOpen ? '0' : '1' }}></span>
          <span style={{ transform: isOpen ? 'rotate(-45deg) translate(6px, -6px)' : 'none' }}></span>
        </button>

        <ul className={`navbar-menu ${isOpen ? 'open' : ''}`}>
          <li>
            <NavLink to="/" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} onClick={handleLinkClick}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/create-poll" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} onClick={handleLinkClick}>
              Create Poll
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} onClick={handleLinkClick}>
              My Polls
            </NavLink>
          </li>
          
          <li className="navbar-mobile-only" style={{ marginTop: 'auto' }}>
            {user ? (
              <div className="navbar-user" style={{ flexDirection: 'column', gap: '1rem' }}>
                <span className="user-name">{user.name}</span>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </div>
            ) : (
              <NavLink to="/auth" className="navbar-link navbar-auth-btn" onClick={handleLinkClick}>
                Login / Signup
              </NavLink>
            )}
          </li>
        </ul>

        <div className="navbar-desktop-only" style={{ display: 'flex', alignItems: 'center' }}>
          {user ? (
            <div className="navbar-user">
              <span className="user-name">{user.name}</span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          ) : (
            <NavLink to="/auth" className="navbar-link navbar-auth-btn">
              Login / Signup
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
