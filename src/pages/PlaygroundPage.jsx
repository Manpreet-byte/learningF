import React, { useState, useRef } from 'react';
import { storage } from '../utils/storage';
import './PlaygroundPage.css';

export const PlaygroundPage = () => {
  const [activeTab, setActiveTab] = useState('html');
  const [showDataManagement, setShowDataManagement] = useState(false);
  const [savedFiles, setSavedFiles] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('playground:saved-files') || '[]');
    } catch {
      return [];
    }
  });
  const [htmlCode, setHtmlCode] = useState('<div class="container">\n    <h1>Welcome to Live Playground!</h1>\n    <p>Edit the code and see results instantly.</p>\n    <button id="test-btn">Click Me</button>\n</div>');
  const [cssCode, setCssCode] = useState(`* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    background: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    text-align: center;
    max-width: 500px;
}

h1 {
    color: #667eea;
    margin-bottom: 16px;
    font-size: 28px;
}

p {
    color: #666;
    margin-bottom: 24px;
    font-size: 16px;
}

button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 12px 32px;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}`);
  
  const [jsCode, setJsCode] = useState(`console.log('Playground loaded!');

var btn = document.getElementById('test-btn');
if (btn) {
    btn.addEventListener('click', function() {
        console.log('Button clicked!');
        alert('You clicked the button! 2024!');
        this.textContent = 'Clicked!';
        this.style.opacity = '0.8';
    });
}`);

  const [consoleLogs, setConsoleLogs] = useState([]);
  const previewIframeRef = useRef(null);

  const updateCharCount = (code) => code.length;

  const updatePreview = () => {
    const fullHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width">
  <style>${cssCode}</style>
</head>
<body>
  ${htmlCode}
  <script>
    // First, set up error handlers BEFORE any code runs
    window.addEventListener('error', function(event) {
      window.parent.postMessage({
        type: 'console',
        logType: 'error',
        message: 'Error: ' + event.message + (event.filename ? ' in ' + event.filename : '') + ' at line ' + event.lineno
      }, '*');
    }, true);
    
    window.addEventListener('unhandledrejection', function(event) {
      window.parent.postMessage({
        type: 'console',
        logType: 'error',
        message: 'Unhandled Promise Rejection: ' + (event.reason || 'Unknown error')
      }, '*');
    });
    
    // Then set up console interceptors
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalInfo = console.info;
    
    function sendToParent(type, message) {
      window.parent.postMessage({
        type: 'console',
        logType: type,
        message: message
      }, '*');
    }
    
    console.log = function(...args) {
      originalLog.apply(console, args);
      sendToParent('log', args.map(arg => {
        if (typeof arg === 'object') return JSON.stringify(arg);
        return String(arg);
      }).join(' '));
    };
    
    console.warn = function(...args) {
      originalWarn.apply(console, args);
      sendToParent('warn', args.map(arg => {
        if (typeof arg === 'object') return JSON.stringify(arg);
        return String(arg);
      }).join(' '));
    };
    
    console.error = function(...args) {
      originalError.apply(console, args);
      sendToParent('error', args.map(arg => {
        if (typeof arg === 'object') return JSON.stringify(arg);
        return String(arg);
      }).join(' '));
    };
    
    console.info = function(...args) {
      originalInfo.apply(console, args);
      sendToParent('info', args.map(arg => {
        if (typeof arg === 'object') return JSON.stringify(arg);
        return String(arg);
      }).join(' '));
    };
    
    // Wrap user code in try-catch to capture syntax errors
    try {
      ${jsCode}
    } catch(err) {
      window.parent.postMessage({
        type: 'console',
        logType: 'error',
        message: 'Error: ' + (err.message || err)
      }, '*');
    }
  <\/script>
</body>
</html>`;

    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    if (previewIframeRef.current && previewIframeRef.current.oldUrl) {
      URL.revokeObjectURL(previewIframeRef.current.oldUrl);
    }
    
    if (previewIframeRef.current) {
      previewIframeRef.current.oldUrl = url;
      previewIframeRef.current.src = url;
    }
    
    setConsoleLogs([]);
  };

  const handleRun = () => {
    updatePreview();
  };

  const handleClearConsole = () => {
    setConsoleLogs([]);
  };

  const downloadFile = (filename, content, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveFile = () => {
    const tabName = activeTab === 'javascript' ? 'js' : activeTab;
    
    let filename = `code.${tabName}`;
    const newFilename = prompt('Enter filename:', filename);
    
    if (newFilename) {
      const extension = activeTab === 'javascript' ? 'js' : activeTab;
      const filenameWithExt = newFilename.endsWith(`.${extension}`) 
        ? newFilename 
        : `${newFilename}.${extension}`;
      
      const content = getActiveCode();
      
      // Save to browser storage
      try {
        const files = JSON.parse(localStorage.getItem('playground:saved-files') || '[]');
        const existingIndex = files.findIndex(f => f.name === filenameWithExt);
        
        const fileData = {
          name: filenameWithExt,
          content: content,
          type: activeTab,
          timestamp: new Date().toISOString()
        };
        
        if (existingIndex >= 0) {
          files[existingIndex] = fileData;
          alert('File updated successfully!');
        } else {
          files.push(fileData);
          alert('File saved successfully!');
        }
        
        localStorage.setItem('playground:saved-files', JSON.stringify(files));
        setSavedFiles(files);
      } catch (error) {
        console.error('Failed to save file:', error);
        alert('Failed to save file');
      }
    }
  };

  const handleDownloadFile = () => {
    const tabName = activeTab === 'javascript' ? 'js' : activeTab;
    const filename = `code.${tabName}`;
    const content = getActiveCode();
    const mimeType = {
      'html': 'text/html',
      'css': 'text/css',
      'javascript': 'text/javascript'
    }[activeTab] || 'text/plain';
    
    downloadFile(filename, content, mimeType);
  };

  const handleLoadSavedFile = (file) => {
    setHtmlCode(file.type === 'html' ? file.content : htmlCode);
    setCssCode(file.type === 'css' ? file.content : cssCode);
    setJsCode(file.type === 'javascript' ? file.content : jsCode);
    setActiveTab(file.type);
    setShowDataManagement(false);
  };

  const handleDeleteFile = (fileName) => {
    if (confirm(`Delete "${fileName}"?`)) {
      const updated = savedFiles.filter(f => f.name !== fileName);
      setSavedFiles(updated);
      localStorage.setItem('playground:saved-files', JSON.stringify(updated));
    }
  };

  const handleDownloadSavedFile = (file) => {
    const mimeType = {
      'html': 'text/html',
      'css': 'text/css',
      'javascript': 'text/javascript'
    }[file.type] || 'text/plain';
    
    downloadFile(file.name, file.content, mimeType);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
    }
  };

  React.useEffect(() => {
    updatePreview();
    
    const handleMessage = (event) => {
      if (event.data.type === 'console') {
        setConsoleLogs(prev => [...prev, {
          type: event.data.logType,
          message: event.data.message
        }]);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getActiveCode = () => {
    switch(activeTab) {
      case 'html':
        return htmlCode;
      case 'css':
        return cssCode;
      case 'js':
        return jsCode;
      default:
        return '';
    }
  };

  const handleCodeChange = (value) => {
    switch(activeTab) {
      case 'html':
        setHtmlCode(value);
        break;
      case 'css':
        setCssCode(value);
        break;
      case 'js':
        setJsCode(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="playground-container">
      {/* Editor Panel with Tabs */}
      <div className="editor-panel">
        <div className="editor-tabs">
          <button
            className={`tab-btn ${activeTab === 'html' ? 'active' : ''}`}
            onClick={() => setActiveTab('html')}
          >
            <span className="tab-icon">🏗️</span>
            HTML
          </button>
          <button
            className={`tab-btn ${activeTab === 'css' ? 'active' : ''}`}
            onClick={() => setActiveTab('css')}
          >
            <span className="tab-icon">🎨</span>
            CSS
          </button>
          <button
            className={`tab-btn ${activeTab === 'js' ? 'active' : ''}`}
            onClick={() => setActiveTab('js')}
          >
            <span className="tab-icon">⚙️</span>
            JavaScript
          </button>
          <button className="run-btn" onClick={handleRun}>
            ▶ Run
          </button>
          <button className="save-btn" onClick={handleSaveFile} title="Save current file to storage">
            💾 Save
          </button>
          <button className="download-btn" onClick={handleDownloadFile} title="Download current file">
            ⬇️ Download
          </button>
          <button className="data-mgmt-btn" onClick={() => setShowDataManagement(!showDataManagement)} title="Manage saved files">
            📁 Data Management
          </button>
        </div>

        <div className="editor-content">
          <textarea
            placeholder="Enter your code here..."
            value={getActiveCode()}
            onChange={(e) => handleCodeChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      {/* Preview and Console Panel */}
      <div className="preview-console-panel">
        <div className="preview-header">
          <div className="editor-label">
            <span className="editor-icon">👁️</span>
            <span>Preview</span>
          </div>
        </div>
        <div className="preview-content">
          <iframe
            ref={previewIframeRef}
            className="preview-iframe"
            sandbox="allow-scripts allow-same-origin allow-popups"
            title="Preview"
          />
        </div>

        <div className="console-section">
          <div className="console-header">
            <div className="console-header-left">
              <button className="console-btn" onClick={handleRun}>
                🔄 CONSOLE
              </button>
            </div>
            <button className="clear-console-btn" onClick={handleClearConsole}>
              🗑️ Clear
            </button>
          </div>
          <div className="console-panel">
            {consoleLogs.length === 0 ? (
              <div style={{ color: '#999', padding: '16px' }}>No output yet...</div>
            ) : (
              consoleLogs.map((entry, idx) => {
                const icon = 
                  entry.type === 'error' ? '❌' :
                  entry.type === 'warn' ? '⚠️' :
                  entry.type === 'info' ? 'ℹ️' :
                  'ℹ️';
                
                return (
                  <div key={idx} className={`console-entry console-${entry.type}`}>
                    <span className="console-icon">{icon}</span>
                    <span className="console-message">{entry.message}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Data Management Modal */}
      {showDataManagement && (
        <div className="data-management-modal">
          <div className="data-management-content">
            <div className="data-management-header">
              <h2>📁 Saved Files</h2>
              <button className="close-btn" onClick={() => setShowDataManagement(false)}>✕</button>
            </div>
            
            {savedFiles.length === 0 ? (
              <div className="no-files">No saved files yet. Click "Save" to save your work!</div>
            ) : (
              <div className="files-list">
                {savedFiles.map((file, idx) => (
                  <div key={idx} className="file-item">
                    <div className="file-info">
                      <span className="file-icon">
                        {file.type === 'html' ? '🟥' : file.type === 'css' ? '🟦' : '🟨'}
                      </span>
                      <div className="file-details">
                        <span className="file-name">{file.name}</span>
                        <span className="file-date">
                          {new Date(file.timestamp).toLocaleDateString()} {new Date(file.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <div className="file-actions">
                      <button 
                        className="action-icon view-btn" 
                        onClick={() => handleLoadSavedFile(file)}
                        title="Load file"
                      >
                        👁️
                      </button>
                      <button 
                        className="action-icon download-icon" 
                        onClick={() => handleDownloadSavedFile(file)}
                        title="Download file"
                      >
                        ⬇️
                      </button>
                      <button 
                        className="action-icon delete-btn" 
                        onClick={() => handleDeleteFile(file.name)}
                        title="Delete file"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};