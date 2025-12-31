import React, { useState } from 'react';
import achievementsCatalog from '../data/achievements';
import { storage } from '../utils/storage';
import './AchievementsPage.css';

export const AchievementsPage = () => {
  const unlocked = storage.getUnlockedAchievements();
  const unlockedSet = new Set(unlocked.map(a => a.id));
  const [filter, setFilter] = useState('all');
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const filteredAchievements = achievementsCatalog.filter(item => {
    if (filter === 'unlocked') return unlockedSet.has(item.id);
    if (filter === 'locked') return !unlockedSet.has(item.id);
    return true;
  });

  const progressPercentage = Math.round((unlocked.length / achievementsCatalog.length) * 100);

  return (
    <div className="achievements-page">
      <header className="achievements-header">
        <div className="header-content">
          <h1>Achievements</h1>
          <p className="subtitle">Level up your coding skills with our achievement system</p>
          
          <div className="progress-container">
            <div className="progress-stats">
              <div className="stat-item">
                <span className="stat-label">Unlocked</span>
                <span className="stat-value">{unlocked.length}</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-label">Total</span>
                <span className="stat-value">{achievementsCatalog.length}</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-label">Progress</span>
                <span className="stat-value">{progressPercentage}%</span>
              </div>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="achievements-controls">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({achievementsCatalog.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'unlocked' ? 'active' : ''}`}
            onClick={() => setFilter('unlocked')}
          >
            Unlocked ({unlocked.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'locked' ? 'active' : ''}`}
            onClick={() => setFilter('locked')}
          >
            Locked ({achievementsCatalog.length - unlocked.length})
          </button>
        </div>
      </div>

      <div className="achievements-grid">
        {filteredAchievements.map(item => {
          const isUnlocked = unlockedSet.has(item.id);
          const meta = unlocked.find(a => a.id === item.id);
          return (
            <div 
              key={item.id} 
              className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
              onClick={() => setSelectedAchievement(selectedAchievement?.id === item.id ? null : item)}
            >
              <div className="achievement-icon">
                <span className="trophy">{isUnlocked ? '🏆' : '🔒'}</span>
              </div>
              <div className="achievement-content">
                <h3 className="achievement-title">{item.title}</h3>
                <p className="achievement-desc">{item.description}</p>
                {isUnlocked && meta && (
                  <p className="achievement-meta">
                    🎉 Unlocked {new Date(meta.unlockedAt).toLocaleDateString()}
                  </p>
                )}
                {!isUnlocked && (
                  <p className="achievement-criteria">
                    <span className="criteria-label">How to unlock:</span> {item.criteria}
                  </p>
                )}
              </div>
              {isUnlocked && <div className="achievement-shine"></div>}
            </div>
          );
        })}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="empty-achievements">
          <div className="empty-icon">🎯</div>
          <h2>No achievements found</h2>
          <p>Keep coding to unlock more achievements!</p>
        </div>
      )}

      {selectedAchievement && (
        <div className="achievement-modal" onClick={() => setSelectedAchievement(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedAchievement(null)}>×</button>
            <div className="modal-icon">
              {unlockedSet.has(selectedAchievement.id) ? '🏆' : '🔒'}
            </div>
            <h2>{selectedAchievement.title}</h2>
            <p className="modal-description">{selectedAchievement.description}</p>
            <div className="modal-info">
              <p><strong>How to unlock:</strong> {selectedAchievement.criteria}</p>
              {unlocked.find(a => a.id === selectedAchievement.id) && (
                <p className="unlocked-date">
                  ✓ Unlocked on {new Date(unlocked.find(a => a.id === selectedAchievement.id).unlockedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
