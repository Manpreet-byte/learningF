import React from 'react';
import './ConsolePanel.css';

export const ConsolePanel = ({ messages, onClear }) => {
  const consoleEndRef = React.useRef(null);

  React.useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getMessageIcon = (type) => {
    switch (type) {
      case 'error':
        return '✕';
      case 'warn':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '»';
    }
  };

  return (
    <div className="console-panel">
      <div className="console-header">
        <h3>Console</h3>
        <button className="clear-btn" onClick={onClear}>
          Clear
        </button>
      </div>
      <div className="console-content">
        {messages.length === 0 ? (
          <div className="console-empty">Ready to execute code...</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`console-message console-${msg.type}`}>
              <span className="console-icon">{getMessageIcon(msg.type)}</span>
              <span className="console-text">{msg.message}</span>
              <span className="console-time">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
        <div ref={consoleEndRef} />
      </div>
    </div>
  );
};
