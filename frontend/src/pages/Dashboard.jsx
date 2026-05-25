import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as api from '../services/api';
import { formatDate } from '../utils/helpers';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states for delete confirmation
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPollId, setSelectedPollId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Redirect to login if unauthorized
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const fetchUserPolls = async () => {
    try {
      const { data } = await api.getPolls();
      // Filter polls created by the logged-in user
      const userPolls = data.filter(
        (poll) => poll.creator?._id === user?._id || poll.creator === user?._id
      );
      setPolls(userPolls);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve your polls. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserPolls();
    }
  }, [user]);

  const handleDeleteClick = (id) => {
    setSelectedPollId(id);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPollId) return;

    setDeleteLoading(true);
    try {
      await api.deletePoll(selectedPollId);
      // Remove poll from list locally
      setPolls(polls.filter((poll) => poll._id !== selectedPollId));
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to delete poll. Please try again.');
    } finally {
      setDeleteLoading(false);
      setSelectedPollId(null);
    }
  };

  const handleCancelDelete = () => {
    setModalOpen(false);
    setSelectedPollId(null);
  };

  if (authLoading || loading) {
    return <Loader text="Retrieving dashboard data..." />;
  }

  return (
    <div className="dashboard-page">
      <div className="container dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">My Polls</h1>
          <Link to="/create-poll" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-xl)' }}>
            + Create Poll
          </Link>
        </div>

        {error && (
          <div className="mb-4 text-center" style={{ color: 'var(--danger-color)', fontWeight: 600 }}>
            {error}
          </div>
        )}

        <div className="dashboard-card">
          {polls.length === 0 ? (
            <div className="dashboard-empty">
              <p className="dashboard-empty-text">You haven't created any polls yet.</p>
              <Link to="/create-poll" className="btn btn-secondary">
                Create Your First Poll
              </Link>
            </div>
          ) : (
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Poll Question</th>
                    <th>Date Created</th>
                    <th>Votes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {polls.map((poll) => (
                    <tr key={poll._id}>
                      <td className="poll-question-cell" title={poll.question}>
                        {poll.question}
                      </td>
                      <td>{formatDate(poll.createdAt)}</td>
                      <td>{poll.totalVotes.toLocaleString()}</td>
                      <td className="actions-cell">
                        {/* View Button */}
                        <Link 
                          to={`/results/${poll._id}`} 
                          className="action-btn action-btn-view"
                          title="View Results"
                        >
                          <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </Link>
                        
                        {/* Edit Button */}
                        <Link 
                          to={`/edit-poll/${poll._id}`} 
                          className="action-btn action-btn-edit"
                          title="Edit Poll"
                        >
                          <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                          </svg>
                        </Link>
                        
                        {/* Delete Button */}
                        <button 
                          onClick={() => handleDeleteClick(poll._id)} 
                          className="action-btn action-btn-delete"
                          title="Delete Poll"
                        >
                          <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        title="Delete Poll"
        message={deleteLoading ? 'Removing poll...' : 'Are you sure you want to delete this poll? This action cannot be undone.'}
        confirmText={deleteLoading ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Dashboard;
