import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { storage } from '../utils/storage';
import './HomePage.css';

export const HomePage = () => {
  const profile = storage.getUserProfile();
  const allProgress = storage.getAllProgress();
  const completionPercentage = storage.getCompletionPercentage();
  const completedLessons = allProgress.filter(p => p.completed).length;

  // Quick code editor state
  const [quickCode, setQuickCode] = useState({ html: '', css: '', javascript: '' });
  const [activeQuickTab, setActiveQuickTab] = useState('html');
  const previewRef = useRef(null);

  const runQuickCode = () => {
    if (!previewRef.current) return;

    const fullHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width">
  <style>${quickCode.css}</style>
</head>
<body>
  ${quickCode.html}
  <script>
    ${quickCode.javascript}
  </script>
</body>
</html>`;

    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    previewRef.current.src = url;
  };

  return (
    <div className="home-page">
      <header className="hero-section">
        <div className="hero-content">
          <h1>Frontend Learning Platform</h1>
          <p className="hero-subtitle">Master HTML, CSS, and JavaScript through interactive lessons</p>
          <div className="hero-buttons">
            <Link to="/lessons" className="btn btn-primary">Start Learning</Link>
            <Link to="/playground" className="btn btn-secondary">Open Playground</Link>
          </div>
        </div>
      </header>

      <section className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{completedLessons}</div>
          <div className="stat-label">Lessons Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-value">{profile.xp}</div>
          <div className="stat-label">Total XP</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-value">Level {profile.level}</div>
          <div className="stat-label">Current Level</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{completionPercentage}%</div>
          <div className="stat-label">Progress</div>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Learn Here?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💻</div>
            <h3>Interactive Editor</h3>
            <p>Write code in our Monaco-powered editor with real-time syntax highlighting</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Sandboxed Execution</h3>
            <p>Safe code execution in isolated environments with timeout protection</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Responsive Preview</h3>
            <p>Test your code on mobile, tablet, and desktop viewports instantly</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎮</div>
            <h3>Gamified Learning</h3>
            <p>Earn XP, level up, and track your progress with achievements</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💾</div>
            <h3>Auto-Save</h3>
            <p>Never lose your work with automatic progress saving</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Code Playground</h3>
            <p>Experiment freely and save your favorite code snippets</p>
          </div>
        </div>
      </section>

      <section className="topics-section">
        <h2>What You'll Learn</h2>
        <div className="topics-grid">
          <div className="topic-card">
            <h3>HTML</h3>
            <ul>
              <li>Basic Structure</li>
              <li>Forms & Input</li>
              <li>Lists & Tables</li>
              <li>Semantic HTML</li>
            </ul>
          </div>
          <div className="topic-card">
            <h3>CSS</h3>
            <ul>
              <li>Box Model</li>
              <li>Flexbox & Grid</li>
              <li>Animations</li>
              <li>Responsive Design</li>
            </ul>
          </div>
          <div className="topic-card">
            <h3>JavaScript</h3>
            <ul>
              <li>Variables & Functions</li>
              <li>DOM Manipulation</li>
              <li>Async Programming</li>
              <li>ES6+ Features</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Start Your Journey?</h2>
        <p>Join thousands of learners mastering frontend development</p>
        <Link to="/lessons" className="btn btn-large btn-primary">Begin Learning Now</Link>
      </section>
    </div>
  );
};
