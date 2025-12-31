import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import lessonsData from '../data/lessons.json';
import './LessonsPage.css';

export const LessonsPage = () => {
  const navigate = useNavigate();
  const [lessons] = useState(lessonsData);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const allProgress = storage.getAllProgress();

  const filteredLessons = lessons.filter((lesson) => {
    const matchesFilter =
      filter === 'all' ||
      lesson.difficulty === filter ||
      (filter === 'completed' && storage.getProgress(lesson.id)?.completed);
    
    const matchesSearch =
      searchTerm === '' ||
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const getLessonStatus = (lessonId) => {
    const progress = storage.getProgress(lessonId);
    if (progress?.completed) return 'completed';
    if (progress) return 'in-progress';
    return 'not-started';
  };

  return (
    <div className="lessons-page">
      <header className="lessons-header">
        <h1>All Lessons</h1>
        <div className="lessons-controls">
          <input
            type="text"
            placeholder="Search lessons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Lessons</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </header>

      <div className="lessons-stats">
        <div className="stat">
          <span className="stat-value">{lessons.length}</span>
          <span className="stat-label">Total Lessons</span>
        </div>
        <div className="stat">
          <span className="stat-value">{allProgress.filter(p => p.completed).length}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat">
          <span className="stat-value">{storage.getCompletionPercentage()}%</span>
          <span className="stat-label">Progress</span>
        </div>
      </div>

      <div className="lessons-grid">
        {filteredLessons.map((lesson) => {
          const status = getLessonStatus(lesson.id);
          return (
            <div
              key={lesson.id}
              className={`lesson-card ${status}`}
              onClick={() => navigate(`/lesson/${lesson.id}`)}
            >
              <div className="lesson-card-header">
                <span className={`difficulty-badge ${lesson.difficulty}`}>
                  {lesson.difficulty}
                </span>
                {status === 'completed' && <span className="completed-badge">✓</span>}
              </div>
              <h3>{lesson.title}</h3>
              <p className="lesson-description">{lesson.description}</p>
              <div className="lesson-tags">
                {lesson.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              <button className="lesson-btn">
                {status === 'completed' ? 'Review' : status === 'in-progress' ? 'Continue' : 'Start'}
              </button>
            </div>
          );
        })}
      </div>

      {filteredLessons.length === 0 && (
        <div className="no-results">
          <p>No lessons found matching your criteria</p>
        </div>
      )}
    </div>
  );
};
