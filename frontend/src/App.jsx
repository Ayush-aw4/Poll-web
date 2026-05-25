import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Auth from './pages/Auth';
import CreatePoll from './pages/CreatePoll';
import Vote from './pages/Vote';
import Results from './pages/Results';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Styles
import './styles/global.css';
import './styles/navbar.css';
import './styles/footer.css';
import './styles/responsive.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/create-poll" element={<CreatePoll />} />
            <Route path="/edit-poll/:id" element={<CreatePoll />} />
            <Route path="/vote/:id" element={<Vote />} />
            <Route path="/results/:id" element={<Results />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
