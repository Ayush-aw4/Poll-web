import axios from 'axios';

// Create an instance of axios
const API = axios.create({
  baseURL: '/api', // Proxy is configured in vite.config.js
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Authorization token to headers
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/register', userData);
export const getMe = () => API.get('/auth/me');

// Polls endpoints
export const getPolls = () => API.get('/polls');
export const getPoll = (id) => API.get(`/polls/${id}`);
export const createPoll = (pollData) => API.post('/polls', pollData);
export const votePoll = (id, optionId) => API.patch(`/polls/${id}/vote`, { optionId });
export const updatePoll = (id, pollData) => API.put(`/polls/${id}`, pollData);
export const deletePoll = (id) => API.delete(`/polls/${id}`);

export default API;
