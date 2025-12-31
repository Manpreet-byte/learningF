import React, { useState, useRef } from 'react';
import './CodeEditorPage.css';

export const HTMLEditorPage = () => {
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My HTML Page</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #667eea; }
    </style>
</head>
<body>
    <h1>Welcome to HTML Editor!</h1>
    <p>Edit the HTML code and see the live preview.</p>
    <button onclick="alert('Button clicked!')">Click Me</button>
</body>
</html>`);
  const previewIframeRef = useRef(null);
  const [isSaved, setIsSaved] = useState(false);

  const saveCode = () => {
    localStorage.setItem('htmlEditorCode', htmlCode);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const loadCode = () => {
    const saved = localStorage.getItem('htmlEditorCode');
    if (saved) {
      setHtmlCode(saved);
      alert('Code loaded! ✅');
    } else {
      alert('No saved code found');
    }
  };

  const resetCode = () => {
    if (confirm('Reset to default code?')) {
      setHtmlCode(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My HTML Page</title>
</head>
<body>
    <h1>Welcome to HTML Editor!</h1>
    <p>Edit the HTML code and see the live preview.</p>
</body>
</html>`);
    }
  };

  const updatePreview = () => {
    if (previewIframeRef.current) {
      const blob = new Blob([htmlCode], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      previewIframeRef.current.src = url;
    }
  };

  React.useEffect(() => {
    const saved = localStorage.getItem('htmlEditorCode');
    if (saved) setHtmlCode(saved);
    updatePreview();
  }, []);

  return (
    <div className="code-editor-page">
      <header className="editor-header">
        <div className="header-left">
          <h1>🔴 HTML Editor</h1>
          <p>Edit HTML and see live preview</p>
        </div>
        <div className="header-actions">
          <button className="action-btn" onClick={updatePreview}>▶️ Run</button>
          <button className="action-btn save" onClick={saveCode}>💾 Save</button>
          <button className="action-btn" onClick={loadCode}>📂 Load</button>
          <button className="action-btn reset" onClick={resetCode}>🔄 Reset</button>
          {isSaved && <span className="save-status">✅ Saved!</span>}
        </div>
      </header>

      <div className="editor-container">
        <div className="editor-panel">
          <div className="panel-header">HTML Code</div>
          <textarea
            value={htmlCode}
            onChange={(e) => setHtmlCode(e.target.value)}
            placeholder="Enter HTML code here..."
            className="editor-textarea"
          />
        </div>

        <div className="preview-panel">
          <div className="panel-header">Live Preview</div>
          <iframe
            ref={previewIframeRef}
            className="preview-iframe"
            title="HTML Preview"
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  );
};
