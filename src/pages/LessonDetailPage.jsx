import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TaskValidator } from '../components/TaskValidator';
import { useCodeEditor } from '../hooks';
import { storage } from '../utils/storage';
import lessonsData from '../data/lessons.json';
import './LessonDetailPage.css';

export const LessonDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lessons] = useState(lessonsData);
  const lesson = lessons.find((l) => l.id === id);

  if (!lesson) {
    return <div className="not-found">Lesson not found</div>;
  }

  const [activeEditorTab, setActiveEditorTab] = useState('html');
  const [showHints, setShowHints] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const previewIframeRef = useRef(null);

  const { code, updateCode } = useCodeEditor(lesson.id, lesson.starterCode);

  const currentIndex = lessons.findIndex((l) => l.id === id);
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;

  const updatePreview = useCallback(() => {
    if (previewIframeRef.current) {
      try {
        const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${code.css}</style>
</head>
<body>
  ${code.html}
  <script>
    window.addEventListener('error', (e) => {
      window.parent.postMessage({ type: 'console', level: 'error', message: e.message }, '*');
    });
    window.addEventListener('unhandledrejection', (e) => {
      window.parent.postMessage({ type: 'console', level: 'error', message: 'Promise rejection: ' + e.reason }, '*');
    });

    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = function(...args) {
      window.parent.postMessage({ type: 'console', level: 'log', message: args.join(' ') }, '*');
    };
    console.error = function(...args) {
      window.parent.postMessage({ type: 'console', level: 'error', message: args.join(' ') }, '*');
    };
    console.warn = function(...args) {
      window.parent.postMessage({ type: 'console', level: 'warn', message: args.join(' ') }, '*');
    };

    ${code.javascript}
  </script>
</body>
</html>`;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        previewIframeRef.current.src = url;
      } catch (error) {
        console.error('Error in iframe:', error);
      }
    }
  }, [code]);

  // Listen for console messages from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'console') {
        setConsoleLogs((prev) => [
          ...prev,
          {
            level: event.data.level,
            message: event.data.message,
            timestamp: Date.now(),
          },
        ]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Reset when lesson changes
  useEffect(() => {
    setTimerRunning(false);
    setTimeElapsed(0);
    setActiveEditorTab('html');
    setConsoleLogs([]);
  }, [id]);

  // Update preview when code changes
  useEffect(() => {
    updatePreview();
  }, [code, updatePreview]);

  const handleComplete = () => {
    if (lesson.tasks && !tasksCompleted) {
      alert('Please complete all tasks before marking this lesson as complete! ✅');
      return;
    }
    storage.markLessonComplete(lesson.id);
    alert(`Congratulations! You've completed "${lesson.title}" and earned 50 XP!`);
    storage.unlockAchievement('first-steps');
    if (timeElapsed > 0 && timeElapsed <= 3 * 60 * 1000) {
      storage.unlockAchievement('speed-run', { ms: timeElapsed });
    }
    if (nextLesson) {
      navigate(`/lesson/${nextLesson.id}`);
    } else {
      navigate('/lessons');
    }
  };

  const handleReset = () => {
    if (confirm('Reset code to starter template?')) {
      // Reset each language separately
      updateCode('html', lesson.starterCode.html);
      updateCode('css', lesson.starterCode.css);
      updateCode('javascript', lesson.starterCode.javascript);
      setActiveEditorTab('html');
      setConsoleLogs([]);
    }
  };

  // Timer effect
  useEffect(() => {
    let intervalId;
    if (timerRunning) {
      const start = Date.now() - timeElapsed;
      intervalId = setInterval(() => {
        setTimeElapsed(Date.now() - start);
      }, 250);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timerRunning, timeElapsed]);

  // Keyboard shortcut: Ctrl+Enter to run
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        updatePreview();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [updatePreview]);

  const clearConsole = () => setConsoleLogs([]);

  return (
    <div className="lesson-detail-page">
      <header className="lesson-header">
        <div className="header-left">
          <button onClick={() => navigate('/lessons')} className="back-btn">
            ← Back
          </button>
          <div className="lesson-info">
            <h1>{lesson.title}</h1>
            <span className={`difficulty-badge ${lesson.difficulty}`}>
              {lesson.difficulty}
            </span>
          </div>
        </div>
        <div className="header-middle">
          <span className="timer-display">
            ⏱️ {Math.floor(timeElapsed / 60000)}:{String(Math.floor((timeElapsed % 60000) / 1000)).padStart(2, '0')}
          </span>
        </div>
        <div className="header-actions">
          {prevLesson && (
            <button className="action-btn nav-prev" onClick={() => navigate(`/lesson/${prevLesson.id}`)} title="Go to previous lesson">
              ← Previous
            </button>
          )}
          <button className="action-btn" onClick={() => setTimerRunning(!timerRunning)}>
            {timerRunning ? '⏸ Pause' : (timeElapsed ? '▶ Resume' : '▶ Start')}
          </button>
          {timeElapsed > 0 && (
            <button className="action-btn" onClick={() => { setTimerRunning(false); setTimeElapsed(0); }}>
              🔄 Reset Timer
            </button>
          )}
          <button className="action-btn" onClick={() => setShowHints(!showHints)}>
            💡 {showHints ? 'Hide' : 'Show'} Hints
          </button>
          <button className="action-btn" onClick={handleReset}>
            🔄 Reset Code
          </button>
          <button className="action-btn complete" onClick={handleComplete}>
            ✓ Complete
          </button>
          {nextLesson && (
            <button className="action-btn nav-next" onClick={() => navigate(`/lesson/${nextLesson.id}`)} title="Go to next lesson">
              Next →
            </button>
          )}
        </div>
      </header>

      <div className="lesson-container">
        {/* Instructions Panel */}
        <aside className="instructions-panel">
          <div className="instructions-scroll">
            <div className="lesson-description">
              <h3>Description</h3>
              <p>{lesson.description}</p>
            </div>

            <div className="lesson-instructions">
              <h3>Instructions</h3>
              <p>{lesson.instructions}</p>
            </div>

            {showHints && lesson.hints && (
              <div className="hints-section">
                <h3>💡 Hints</h3>
                <ul>
                  {lesson.hints.map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}

            {lesson.tasks && (
              <div className="tasks-section">
                <TaskValidator
                  code={code}
                  lesson={lesson}
                  onTasksComplete={() => setTasksCompleted(true)}
                />
              </div>
            )}

            <div className="tags-section">
              <h4>📌 Topics</h4>
              <div className="tags">
                {lesson.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>

            <div className="navigation-section">
              {prevLesson && (
                <button onClick={() => navigate(`/lesson/${prevLesson.id}`)} className="nav-btn prev">
                  ← Previous Lesson
                </button>
              )}
              {nextLesson && (
                <button onClick={() => navigate(`/lesson/${nextLesson.id}`)} className="nav-btn next">
                  Next Lesson →
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="lesson-workspace">
          {/* Editor Panel */}
          <div className="editor-panel">
            <div className="editor-tabs">
              {['html', 'css', 'javascript'].map((tab) => (
                <button
                  key={tab}
                  className={`tab-btn ${activeEditorTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveEditorTab(tab)}
                >
                  <span className="tab-icon">
                    {tab === 'html' && '🟥'}
                    {tab === 'css' && '🟦'}
                    {tab === 'javascript' && '🟨'}
                  </span>
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="editor-header">
              <span>
                {activeEditorTab === 'html' && 'HTML'}
                {activeEditorTab === 'css' && 'CSS'}
                {activeEditorTab === 'javascript' && 'JavaScript'}
              </span>
              <span className="char-count">{code[activeEditorTab].length} characters</span>
            </div>
            <textarea
              value={code[activeEditorTab]}
              onChange={(e) => updateCode(activeEditorTab, e.target.value)}
              placeholder={`Enter ${activeEditorTab.toUpperCase()} code...`}
              className="editor-textarea"
            />
          </div>

          {/* Preview and Console Panel */}
          <div className="preview-console-panel">
            {/* Preview */}
            <div className="preview-section">
              <div className="preview-header">
                <span>📱 Live Preview</span>
                <button className="run-btn" onClick={updatePreview}>▶ Run (Ctrl+Enter)</button>
              </div>
              <iframe
                ref={previewIframeRef}
                className="preview-iframe"
                title="Lesson Preview"
                sandbox="allow-scripts"
              />
            </div>

            {/* Console */}
            <div className="console-section">
              <div className="console-header">
                <span>📋 Console Output</span>
                <button className="clear-console-btn" onClick={clearConsole}>Clear</button>
              </div>
              <div className="console-panel">
                {consoleLogs.length === 0 ? (
                  <div className="console-empty">No output yet. Run your code to see console messages.</div>
                ) : (
                  consoleLogs.map((log, idx) => (
                    <div key={idx} className={`console-entry console-${log.level}`}>
                      <span className="console-icon">
                        {log.level === 'error' && '❌'}
                        {log.level === 'warn' && '⚠️'}
                        {log.level === 'log' && 'ℹ️'}
                      </span>
                      <span className="console-message">{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
