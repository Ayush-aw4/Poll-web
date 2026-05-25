import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as api from '../services/api';
import Loader from '../components/Loader';
import '../styles/createPoll.css';

const CreatePoll = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { id } = useParams(); // For editing mode
  const isEditMode = !!id;
  
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '']); // Default 3 empty options as shown in screenshot
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  // Redirect to Auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Load poll data if in edit mode
  useEffect(() => {
    const fetchPollData = async () => {
      if (isEditMode) {
        try {
          const { data } = await api.getPoll(id);
          // Check if current user is owner
          if (data.creator?._id !== user?._id && data.creator !== user?._id) {
            setError('You are not authorized to edit this poll');
            setTimeout(() => navigate('/dashboard'), 3000);
            return;
          }
          setQuestion(data.question);
          setOptions(data.options.map(opt => opt.text));
        } catch (err) {
          console.error(err);
          setError('Could not fetch poll details.');
        } finally {
          setPageLoading(false);
        }
      }
    };

    if (user) {
      fetchPollData();
    }
  }, [id, isEditMode, user, navigate]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOptionField = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOptionField = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, idx) => idx !== index);
      setOptions(newOptions);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedQuestion = question.trim();
    const filteredOptions = options.map(opt => opt.trim()).filter(Boolean);

    if (!trimmedQuestion) {
      setError('Question is required');
      return;
    }

    if (filteredOptions.length < 2) {
      setError('At least 2 non-empty options are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isEditMode) {
        // For editing, preserve votes by mapping to text format expected by backend
        await api.updatePoll(id, { question: trimmedQuestion, options: filteredOptions });
        navigate('/dashboard');
      } else {
        await api.createPoll({ question: trimmedQuestion, options: filteredOptions });
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || pageLoading) {
    return <Loader text={isEditMode ? 'Loading Poll...' : 'Preparing Page...'} />;
  }

  return (
    <div className="create-poll-page">
      <div className="create-poll-card">
        <h2 className="create-poll-title">
          {isEditMode ? 'Edit Your Poll' : 'Create Your Poll'}
        </h2>
        
        {error && (
          <div className="mb-4" style={{ color: 'var(--danger-color)', fontWeight: 600, fontSize: 'var(--fs-sm)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <textarea
            className="question-textarea"
            placeholder="Which feature is most important?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            disabled={loading}
          />

          <h3 className="options-heading">Options</h3>

          {options.map((option, index) => (
            <div key={index} className="option-row">
              <span className="option-number">{index + 1}.</span>
              <div className="option-input-wrapper">
                <input
                  type="text"
                  className="option-input"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOptionField(index)}
                  className="option-remove-btn"
                  title="Remove option"
                  disabled={loading}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          ))}

          {options.length < 6 && (
            <button
              type="button"
              onClick={addOptionField}
              className="add-option-btn"
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Option
            </button>
          )}

          <button
            type="submit"
            className="submit-poll-btn"
            disabled={loading || !question.trim() || options.filter(o => o.trim()).length < 2}
          >
            {loading ? 'Submitting...' : isEditMode ? 'Update Poll' : 'Submit Poll'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePoll;
