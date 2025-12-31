import React, { useState, useRef } from 'react';
import { storage } from '../utils/storage';
import './ProfilePage.css';

export const ProfilePage = () => {
  const profile = storage.getUserProfile();
  const allProgress = storage.getAllProgress();
  const settings = storage.getSettings();
  const completionPercentage = storage.getCompletionPercentage();
  
  // Code snippets state
  const [snippets, setSnippets] = useState(
    JSON.parse(localStorage.getItem('codeSnippets') || '[]')
  );
  const [activeTab, setActiveTab] = useState('html');
  const [snippetCode, setSnippetCode] = useState({
    html: '',
    css: '',
    javascript: '',
  });
  const [snippetName, setSnippetName] = useState('');
  const [selectedSnippetId, setSelectedSnippetId] = useState(null);
  const previewIframeRef = useRef(null);

  const saveSnippet = () => {
    if (!snippetName.trim()) {
      alert('Please enter a snippet name');
      return;
    }

    const newSnippet = {
      id: Date.now(),
      name: snippetName,
      code: { ...snippetCode },
      createdAt: new Date().toISOString(),
    };

    const updated = [...snippets, newSnippet];
    setSnippets(updated);
    localStorage.setItem('codeSnippets', JSON.stringify(updated));
    
    setSnippetName('');
    setSnippetCode({ html: '', css: '', javascript: '' });
    setActiveTab('html');
    alert('Snippet saved successfully! 🎉');
  };

  const deleteSnippet = (id) => {
    if (confirm('Are you sure you want to delete this snippet?')) {
      const updated = snippets.filter(s => s.id !== id);
      setSnippets(updated);
      localStorage.setItem('codeSnippets', JSON.stringify(updated));
      if (selectedSnippetId === id) {
        setSelectedSnippetId(null);
        setSnippetCode({ html: '', css: '', javascript: '' });
      }
    }
  };

  const loadSnippet = (snippet) => {
    setSelectedSnippetId(snippet.id);
    setSnippetCode(snippet.code);
    setSnippetName(snippet.name);
  };

  const runPreview = () => {
    if (!previewIframeRef.current) return;

    const fullHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width">
  <style>${snippetCode.css}</style>
</head>
<body>
  ${snippetCode.html}
  <script>
    ${snippetCode.javascript}
  </script>
</body>
</html>`;

    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    previewIframeRef.current.src = url;
  };

  const handleExportData = () => {
    const data = storage.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'learning-data-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const success = storage.importData(event.target.result);
          if (success) {
            alert('Data imported successfully!');
            window.location.reload();
          } else {
            alert('Failed to import data');
          }
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      storage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <div className="profile-avatar">{profile.username.charAt(0).toUpperCase()}</div>
        <div className="profile-info">
          <h1>{profile.username}</h1>
          <p>Level {profile.level} • {profile.xp} XP</p>
        </div>
      </header>

      <div className="profile-content">
        <section className="stats-section">
          <h2>Statistics</h2>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <div className="stat-value">{profile.totalLessonsCompleted}</div>
                <div className="stat-label">Lessons Completed</div>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">⚡</div>
              <div className="stat-info">
                <div className="stat-value">{profile.xp}</div>
                <div className="stat-label">Total XP</div>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">🏆</div>
              <div className="stat-info">
                <div className="stat-value">Level {profile.level}</div>
                <div className="stat-label">Current Level</div>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <div className="stat-value">{completionPercentage}%</div>
                <div className="stat-label">Overall Progress</div>
              </div>
            </div>
          </div>
        </section>

        <section className="progress-section">
          <h2>Learning Progress</h2>
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <span className="progress-text">{completionPercentage}% Complete</span>
          </div>
          <div className="xp-progress">
            <p>XP Progress to Next Level</p>
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div
                  className="progress-fill xp-fill"
                  style={{ width: `${(profile.xp % 200) / 2}%` }}
                />
              </div>
              <span className="progress-text">{profile.xp % 200} / 200 XP</span>
            </div>
          </div>
        </section>

        <section className="recent-activity-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {allProgress
              .filter((p) => p.completedAt)
              .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0))
              .slice(0, 5)
              .map((progress) => (
                <div key={progress.lessonId} className="activity-item">
                  <span className="activity-icon">✓</span>
                  <span className="activity-text">Completed lesson: {progress.lessonId}</span>
                  <span className="activity-time">
                    {new Date(progress.completedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            {allProgress.filter((p) => p.completedAt).length === 0 && (
              <p className="no-activity">No recent activity</p>
            )}
          </div>
        </section>

        <section className="data-section">
          <h2>Data Management</h2>
          <div className="data-actions">
            <button onClick={handleExportData} className="data-btn export">
              📥 Export Data
            </button>
            <button onClick={handleImportData} className="data-btn import">
              📤 Import Data
            </button>
            <button onClick={handleClearData} className="data-btn danger">
              🗑️ Clear All Data
            </button>
          </div>
        </section>

        <section className="code-snippets-section">
          <h2>💻 Code Snippets - Write & Save Your Code</h2>
          <div className="snippets-container">
            <div className="snippets-sidebar">
              <div className="snippets-header">
                <h3>My Snippets</h3>
                <span className="snippet-count">{snippets.length}</span>
              </div>
              <div className="snippets-list">
                {snippets.length === 0 ? (
                  <p className="no-snippets">No snippets yet. Create your first one! ✨</p>
                ) : (
                  snippets.map((snippet) => (
                    <div
                      key={snippet.id}
                      className={`snippet-item ${selectedSnippetId === snippet.id ? 'active' : ''}`}
                      onClick={() => loadSnippet(snippet)}
                    >
                      <div className="snippet-name">{snippet.name}</div>
                      <button
                        className="delete-snippet"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSnippet(snippet.id);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="snippets-editor">
              <div className="editor-header">
                <input
                  type="text"
                  className="snippet-name-input"
                  placeholder="Snippet name (e.g., 'My First Form')"
                  value={snippetName}
                  onChange={(e) => setSnippetName(e.target.value)}
                />
                <button className="save-snippet-btn" onClick={saveSnippet}>
                  💾 Save Snippet
                </button>
              </div>

              <div className="tabs">
                {['html', 'css', 'javascript'].map((tab) => (
                  <button
                    key={tab}
                    className={`tab ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>

              <textarea
                className="code-editor"
                value={snippetCode[activeTab]}
                onChange={(e) =>
                  setSnippetCode({ ...snippetCode, [activeTab]: e.target.value })
                }
                placeholder={`Enter your ${activeTab.toUpperCase()} code here...`}
              />

              <button className="run-preview-btn" onClick={runPreview}>
                ▶️ Run Preview
              </button>
            </div>

            <div className="snippets-preview">
              <div className="preview-header">Live Preview</div>
              <iframe
                ref={previewIframeRef}
                className="preview-iframe"
                title="Code Preview"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
