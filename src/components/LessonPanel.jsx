import React from 'react';
import { storage } from '../utils/storage';
import './LessonPanel.css';

export const LessonPanel = ({
  lesson,
  onSelectLesson,
  allLessons,
  completionPercentage,
}) => {
  const [expandedLesson, setExpandedLesson] = React.useState(lesson.id);

  const handleMarkComplete = (e) => {
    e.stopPropagation();
    storage.markLessonComplete(lesson.id);
    window.location.reload();
  };

  return (
    <div className="lesson-panel">
      <div className="lesson-header">
        <h2>Lessons</h2>
        <div className="completion-badge">{completionPercentage}%</div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${completionPercentage}%` }} />
      </div>

      <div className="lessons-list">
        {allLessons.map((l) => {
          const completed = storage.getProgress(l.id)?.completed || false;
          const isActive = l.id === lesson.id;

          return (
            <div
              key={l.id}
              className={`lesson-item ${isActive ? 'active' : ''} ${
                completed ? 'completed' : ''
              }`}
              onClick={() => {
                onSelectLesson(l);
                setExpandedLesson(l.id);
              }}
            >
              <div className="lesson-title-row">
                <span className="lesson-status">{completed ? '✓' : '○'}</span>
                <span className="lesson-title">{l.title}</span>
                <span className="lesson-difficulty">{l.difficulty}</span>
              </div>
              {isActive && expandedLesson === l.id && (
                <div className="lesson-details">
                  <p className="lesson-description">{l.description}</p>
                  <div className="lesson-instructions">
                    <h4>Task:</h4>
                    <p>{l.instructions}</p>
                  </div>
                  {!completed && (
                    <button
                      className="complete-btn"
                      onClick={handleMarkComplete}
                    >
                      Mark as Complete
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
