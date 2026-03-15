import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

// User Pages
import HomePage from './pages/HomePage';
import MoviePlayerPage from './pages/MoviePlayerPage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import StartupPopup from './components/StartupPopup';

function App() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Show popup on first load
    const hasSeenPopup = localStorage.getItem('hasSeenPopup');
    if (!hasSeenPopup) {
      setShowPopup(true);
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    localStorage.setItem('hasSeenPopup', 'true');
  };

  return (
    <Router>
      <div className="min-h-screen bg-dark text-white">
        {showPopup && <StartupPopup onClose={handleClosePopup} />}
        
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MoviePlayerPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          
          {/* 404 Not Found - Must be last route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;