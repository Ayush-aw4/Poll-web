import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/auth.css';

const Auth = () => {
  const { user, loginUser, registerUser, error, setError } = useContext(AuthContext);
  const navigate = useNavigate();

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup Form States
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  // General Notification Toast/Banner
  const [toastMessage, setToastMessage] = useState(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
    // Clean up context errors on mount
    setError(null);
  }, [user, navigate, setError]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      showToast('Please fill in all login fields');
      return;
    }

    setLoginLoading(true);
    const result = await loginUser({ email: loginEmail, password: loginPassword });
    setLoginLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      showToast(result.error);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    
    if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
      showToast('Please fill in all registration fields');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      showToast('Passwords do not match');
      return;
    }

    if (signupPassword.length < 6) {
      showToast('Password must be at least 6 characters');
      return;
    }

    if (!agreeTerms) {
      showToast('You must agree to the Terms of Service');
      return;
    }

    setSignupLoading(true);
    const result = await registerUser({
      name: signupName,
      email: signupEmail,
      password: signupPassword,
    });
    setSignupLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      showToast(result.error);
    }
  };

  const handleSocialClick = (platform) => {
    showToast(`${platform} Login is coming soon!`);
  };

  return (
    <div className="auth-page">
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#2c3e50',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1000,
          fontWeight: 600,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          {toastMessage}
        </div>
      )}

      <div className="auth-container">
        {/* LOGIN PANEL */}
        <div className="auth-panel">
          <h2 className="auth-title">Welcome Back</h2>
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <div className="input-icon-wrapper">
                <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                <input
                  type="email"
                  id="login-email"
                  className="auth-input has-icon"
                  placeholder="email@address.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="input-icon-wrapper">
                <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input
                  type="password"
                  id="login-password"
                  className="auth-input has-icon"
                  placeholder="••••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <a href="#" className="forgot-password" onClick={(e) => { e.preventDefault(); showToast('Password reset is coming soon!'); }}>
              Forgot Password?
            </a>

            <button type="submit" className="auth-submit-btn" disabled={loginLoading}>
              {loginLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="or-divider">OR CONTINUE WITH</div>

          <div className="social-btns">
            <button className="social-btn" onClick={() => handleSocialClick('Google')}>
              <svg className="social-icon" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.147 4.114-3.326 0-6.027-2.7-6.027-6.028s2.7-6.028 6.027-6.028c1.493 0 2.846.545 3.899 1.437l3.023-3.023C18.966 2.923 15.86 2 12.24 2 6.583 2 2 6.583 2 12.24s4.583 10.24 10.24 10.24c5.795 0 10.24-4.113 10.24-10.24 0-.648-.057-1.277-.164-1.955H12.24z"/>
              </svg>
              Google
            </button>
            <button className="social-btn" onClick={() => handleSocialClick('Github')}>
              <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              Github
            </button>
          </div>
        </div>

        {/* VERTICAL SEPARATOR */}
        <div className="auth-divider-vertical"></div>

        {/* SIGNUP PANEL */}
        <div className="auth-panel">
          <h2 className="auth-title">Create Account</h2>
          <form onSubmit={handleSignupSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-name">Full Name</label>
              <div className="input-icon-wrapper">
                <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                <input
                  type="text"
                  id="signup-name"
                  className="auth-input has-icon"
                  placeholder="Your full name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">Email Address</label>
              <input
                type="email"
                id="signup-email"
                className="auth-input"
                placeholder="Email Address"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-password">Create Password</label>
              <input
                type="password"
                id="signup-password"
                className="auth-input"
                placeholder="Create Password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-confirm-password">Confirm Password</label>
              <input
                type="password"
                id="signup-confirm-password"
                className="auth-input"
                placeholder="Confirm Password"
                value={signupConfirmPassword}
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="auth-checkbox-group">
              <input
                type="checkbox"
                id="agree-terms"
                className="auth-checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <label className="auth-checkbox-label" htmlFor="agree-terms">
                I agree to the Terms of Service and Privacy Policy.
              </label>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={signupLoading}>
              {signupLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="or-divider">OR SIGN UP WITH</div>

          <div className="social-btns">
            <button className="social-btn" onClick={() => handleSocialClick('Google')}>
              <svg className="social-icon" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.147 4.114-3.326 0-6.027-2.7-6.027-6.028s2.7-6.028 6.027-6.028c1.493 0 2.846.545 3.899 1.437l3.023-3.023C18.966 2.923 15.86 2 12.24 2 6.583 2 2 6.583 2 12.24s4.583 10.24 10.24 10.24c5.795 0 10.24-4.113 10.24-10.24 0-.648-.057-1.277-.164-1.955H12.24z"/>
              </svg>
              Google
            </button>
            <button className="social-btn" onClick={() => handleSocialClick('Github')}>
              <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              Github
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative background star */}
      <div className="star-bg-element">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
          <path d="M12 2v20M2 12h20M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"></path>
        </svg>
      </div>
    </div>
  );
};

export default Auth;
