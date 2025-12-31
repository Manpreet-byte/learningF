import React, { useState, useRef } from 'react';
import './CodeEditorPage.css';

export const JavaScriptEditorPage = () => {
  const [jsCode, setJsCode] = useState(`// JavaScript Code
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));

// Try changing this text and running again!
const result = greet('JavaScript');
console.log('Result:', result);`);
  const previewIframeRef = useRef(null);
  const [isSaved, setIsSaved] = useState(false);

  const saveCode = () => {
    localStorage.setItem('jsEditorCode', jsCode);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const loadCode = () => {
    const saved = localStorage.getItem('jsEditorCode');
    if (saved) {
      setJsCode(saved);
      alert('Code loaded! ✅');
    } else {
      alert('No saved code found');
    }
  };

  const resetCode = () => {
    if (confirm('Reset to default code?')) {
      setJsCode(`// JavaScript Code
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`);
    }
  };

  const updatePreview = () => {
    if (previewIframeRef.current) {
      const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Courier New', monospace;
      padding: 20px;
      background: #1e1e1e;
      color: #d4d4d4;
      margin: 0;
    }
    .console-output {
      background: #1e1e1e;
      border: 1px solid #444;
      border-radius: 4px;
      padding: 15px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      max-height: 300px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .console-line {
      margin: 5px 0;
    }
    .log { color: #d4d4d4; }
    .error { color: #f48771; }
    .warn { color: #dcdcaa; }
    .info { color: #4ec9b0; }
  </style>
</head>
<body>
  <h2 style="color: #669bdf;">JavaScript Console Output</h2>
  <div id="console-output" class="console-output"></div>
  <script>
    const consoleOutput = document.getElementById('console-output');
    const logs = [];

    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = function(...args) {
      logs.push({ type: 'log', message: args.join(' ') });
      updateConsole();
    };

    console.error = function(...args) {
      logs.push({ type: 'error', message: args.join(' ') });
      updateConsole();
    };

    console.warn = function(...args) {
      logs.push({ type: 'warn', message: args.join(' ') });
      updateConsole();
    };

    function updateConsole() {
      consoleOutput.innerHTML = logs.map(log => 
        \`<div class="console-line \${log.type}">\${log.message}</div>\`
      ).join('');
      consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }

    try {
      ${jsCode}
    } catch (error) {
      console.error('Error: ' + error.message);
    }
  </script>
</body>
</html>`;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      previewIframeRef.current.src = url;
    }
  };

  React.useEffect(() => {
    const saved = localStorage.getItem('jsEditorCode');
    if (saved) setJsCode(saved);
    updatePreview();
  }, []);

  return (
    <div className="code-editor-page">
      <header className="editor-header">
        <div className="header-left">
          <h1>🟨 JavaScript Editor</h1>
          <p>Edit JavaScript and see console output</p>
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
          <div className="panel-header">JavaScript Code</div>
          <textarea
            value={jsCode}
            onChange={(e) => setJsCode(e.target.value)}
            placeholder="Enter JavaScript code here..."
            className="editor-textarea"
          />
        </div>

        <div className="preview-panel">
          <div className="panel-header">Console Output</div>
          <iframe
            ref={previewIframeRef}
            className="preview-iframe"
            title="JavaScript Console"
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  );
};
