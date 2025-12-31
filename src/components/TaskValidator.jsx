import React, { useState, useEffect } from 'react';
import './TaskValidator.css';

export const TaskValidator = ({ code, lesson, onTasksComplete }) => {
  const [tasks, setTasks] = useState(lesson.tasks || []);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [allTasksComplete, setAllTasksComplete] = useState(false);

  // Validate tasks based on code content
  useEffect(() => {
    if (!tasks.length) {
      setAllTasksComplete(true);
      return;
    }

    const completed = tasks.map((task) => {
      switch (task.type) {
        case 'html-contains':
          return code.html.includes(task.target);
        case 'css-contains':
          return code.css.includes(task.target);
        case 'js-contains':
          return code.javascript.includes(task.target);
        case 'no-starter':
          // Check if they've made changes from starter
          return (
            code.html !== lesson.starterCode.html ||
            code.css !== lesson.starterCode.css ||
            code.javascript !== lesson.starterCode.javascript
          );
        case 'function-exists':
          return new RegExp(`\\b${task.target}\\s*\\(`).test(code.javascript);
        case 'tag-exists':
          return new RegExp(`<${task.target}[^>]*>`).test(code.html);
        case 'class-exists':
          return new RegExp(`\\.${task.target}\\b`).test(code.css);
        default:
          return false;
      }
    });

    setCompletedTasks(completed);
    const allComplete = completed.every((task) => task === true);
    setAllTasksComplete(allComplete);

    if (allComplete && onTasksComplete) {
      onTasksComplete();
    }
  }, [code, lesson, tasks, onTasksComplete]);

  if (!tasks.length) {
    return null;
  }

  const completedCount = completedTasks.filter((t) => t).length;
  const totalCount = tasks.length;

  return (
    <div className="task-validator">
      <div className="task-header">
        <h4>📋 Tasks to Complete</h4>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
          <span className="progress-text">
            {completedCount}/{totalCount}
          </span>
        </div>
      </div>

      <div className="tasks-list">
        {tasks.map((task, index) => (
          <div
            key={index}
            className={`task-item ${completedTasks[index] ? 'completed' : ''}`}
          >
            <span className="task-checkbox">
              {completedTasks[index] ? '✅' : '☐'}
            </span>
            <span className="task-description">{task.description}</span>
          </div>
        ))}
      </div>

      {allTasksComplete && (
        <div className="task-success">
          <p>🎉 All tasks completed! You're ready to mark this lesson as complete.</p>
        </div>
      )}
    </div>
  );
};
