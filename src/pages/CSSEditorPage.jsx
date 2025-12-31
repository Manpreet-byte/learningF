import React, { useState, useRef } from 'react';
import './CodeEditorPage.css';

export const CSSEditorPage = () => {
  const [cssCode, setcssCode] = useState(`/* CSS Styles */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.container {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  color: #667eea;
  text-align: center;
  margin-bottom: 20px;
}

button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s;
}

button:hover {
  transform: translateY(-2px);
}`);
  const previewIframeRef = useRef(null);
  const [isSaved, setIsSaved] = useState(false);

  const saveCode = () => {
    localStorage.setItem('cssEditorCode', cssCode);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const loadCode = () => {
    const saved = localStorage.getItem('cssEditorCode');
    if (saved) {
      setcssCode(saved);
      alert('Code loaded! ✅');
    } else {
      alert('No saved code found');
    }
  };

  const resetCode = () => {
    if (confirm('Reset to default code?')) {
      setcssCode(`/* CSS Styles */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background: #f5f5f5;
}`);
    }
  };

  const updatePreview = () => {
    if (previewIframeRef.current) {
      const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>${cssCode}</style>
</head>
<body>
  <div class="container">
    <h1>CSS Preview</h1>
    <p>Your styles are applied to this preview!</p>
    <button>Sample Button</button>
  </div>
</body>
</html>`;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      previewIframeRef.current.src = url;
    }
  };

  React.useEffect(() => {
    const saved = localStorage.getItem('cssEditorCode');
    if (saved) setcssCode(saved);
    updatePreview();
  }, []);

  return (
    <div className="code-editor-page">
      <header className="editor-header">
        <div className="header-left">
          <h1>🟦 CSS Editor</h1>
          <p>Edit CSS and see live preview</p>
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
          <div className="panel-header">CSS Code</div>
          <textarea
            value={cssCode}
            onChange={(e) => setcssCode(e.target.value)}
            placeholder="Enter CSS code here..."
            className="editor-textarea"
          />
        </div>

        <div className="preview-panel">
          <div className="panel-header">Live Preview</div>
          <iframe
            ref={previewIframeRef}
            className="preview-iframe"
            title="CSS Preview"
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  );
};
