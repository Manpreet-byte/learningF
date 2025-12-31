import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/storage';
import './Navbar.css';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleTheme = () => {
    const settings = storage.getSettings();
    const next = settings.theme === 'dark' ? 'light' : 'dark';
    const updated = { ...settings, theme: next };
    storage.saveSettings(updated);
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(next === 'dark' ? 'theme-dark' : 'theme-light');
    if (next === 'dark') {
      storage.unlockAchievement('night-owl');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleNavClick = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">💻</span>
          <span className="logo-text">Frontend Learn</span>
        </Link>
        <div className="navbar-links">
          <button 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => handleNavClick('/')}
          >
            Home
          </button>
          <button 
            className={`nav-link ${isActive('/lessons') ? 'active' : ''}`}
            onClick={() => handleNavClick('/lessons')}
          >
            Lessons
          </button>
          <button 
            className={`nav-link ${isActive('/theory') ? 'active' : ''}`}
            onClick={() => handleNavClick('/theory')}
          >
            Theory
          </button>
          <button 
            className={`nav-link ${isActive('/playground') ? 'active' : ''}`}
            onClick={() => handleNavClick('/playground')}
          >
            Playground
          </button>
          <div className="nav-dropdown">
            <button className="nav-link dropdown-trigger">Editor 🔻</button>
            <div className="dropdown-menu">
              <button 
                className={`dropdown-item ${isActive('/html-editor') ? 'active' : ''}`}
                onClick={() => handleNavClick('/html-editor')}
              >
                🟥 HTML Editor
              </button>
              <button 
                className={`dropdown-item ${isActive('/css-editor') ? 'active' : ''}`}
                onClick={() => handleNavClick('/css-editor')}
              >
                🟦 CSS Editor
              </button>
              <button 
                className={`dropdown-item ${isActive('/js-editor') ? 'active' : ''}`}
                onClick={() => handleNavClick('/js-editor')}
              >
                🟨 JavaScript Editor
              </button>
            </div>
          </div>
          <button 
            className={`nav-link ${isActive('/achievements') ? 'active' : ''}`}
            onClick={() => handleNavClick('/achievements')}
          >
            Achievements
          </button>
          <button 
            className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
            onClick={() => handleNavClick('/profile')}
          >
            Profile
          </button>
          <button className="nav-link theme-toggle" onClick={toggleTheme} title="Toggle theme">🌓</button>
          <div className="user-info">
            <span className="username">{user?.email}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
};
