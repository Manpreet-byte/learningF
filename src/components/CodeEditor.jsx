import React, { useEffect, useRef } from 'react';
import * as Monaco from 'monaco-editor';
// Monaco workers for Vite
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import './CodeEditor.css';

export const CodeEditor = ({
  code,
  onChange,
  activeTab,
  onTabChange,
  onRun,
}) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Register Monaco workers to avoid missing worker errors
    if (typeof window !== 'undefined' && !window.MonacoEnvironment) {
      window.MonacoEnvironment = {
        getWorker(_, label) {
          if (label === 'json') return new jsonWorker();
          if (label === 'css') return new cssWorker();
          if (label === 'html') return new htmlWorker();
          if (label === 'typescript' || label === 'javascript') return new tsWorker();
          return new editorWorker();
        },
      };
    }

    if (!containerRef.current) return;

    // Initialize Monaco Editor
    if (!editorRef.current) {
      editorRef.current = Monaco.editor.create(containerRef.current, {
        value: code[activeTab],
        language: getLanguage(activeTab),
        theme: 'vs-light',
        automaticLayout: true,
        minimap: { enabled: true },
        fontSize: 13,
        lineHeight: 1.6,
        scrollBeyondLastLine: false,
        formatOnPaste: true,
      });

      // Handle editor changes with debounce via parent component
      editorRef.current.onDidChangeModelContent(() => {
        const value = editorRef.current?.getValue() || '';
        onChange(activeTab, value);
      });
    } else {
      // Update language and value when tab changes
      const model = editorRef.current.getModel();
      if (model) {
        Monaco.editor.setModelLanguage(model, getLanguage(activeTab));
      }
      editorRef.current.setValue(code[activeTab]);
    }
  }, [activeTab, code, onChange]);

  // Keyboard shortcut: Ctrl+Enter to run
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === 'Enter' && onRun) {
        e.preventDefault();
        onRun();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onRun]);

  return (
    <div className="code-editor-wrapper">
      <div className="editor-header">
        <div className="editor-tabs">
          {['html', 'css', 'javascript'].map((tab) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => onTabChange(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
        {onRun && (
          <button className="run-btn" onClick={onRun} title="Run code (Ctrl+Enter)">
            ▶ Run
          </button>
        )}
      </div>
      <div ref={containerRef} className="editor-container" />
    </div>
  );
};

function getLanguage(tab) {
  switch (tab) {
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'javascript':
      return 'javascript';
    default:
      return 'javascript';
  }
}
