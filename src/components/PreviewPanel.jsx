import React, { useEffect, useRef } from 'react';
import { DEVICE_SIZES } from '../types';
import { buildSandboxHTML } from '../utils/sandbox';
import './PreviewPanel.css';

export const PreviewPanel = ({
  code,
  deviceSize,
  onConsoleMessage,
  onRefresh,
}) => {
  const iframeRef = useRef(null);
  const device = DEVICE_SIZES[deviceSize];

  // Listen for console/error messages from the sandboxed iframe
  useEffect(() => {
    if (!onConsoleMessage) return undefined;

    const handler = (event) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'console') {
        onConsoleMessage({
          id: `${Date.now()}-${Math.random()}`,
          type: data.level || 'log',
          message: (data.args || []).join(' '),
          timestamp: Date.now(),
        });
      } else if (data.type === 'error') {
        onConsoleMessage({
          id: `${Date.now()}-${Math.random()}`,
          type: 'error',
          message: data.message || 'Runtime error',
          timestamp: Date.now(),
        });
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onConsoleMessage, code]);

  // Build HTML content directly - React will update iframe when this changes
  const htmlContent = buildSandboxHTML(code);

  const handleRefreshClick = () => {
    if (iframeRef.current) {
      // Force iframe reload by updating srcdoc
      const currentSrc = iframeRef.current.srcdoc;
      iframeRef.current.srcdoc = '';
      setTimeout(() => {
        iframeRef.current.srcdoc = currentSrc;
      }, 10);
    }
    if (onRefresh) onRefresh();
  };

  return (
    <div className="preview-panel">
      <div className="preview-header">
        <h3>Live Preview - {device.name}</h3>
        <button className="refresh-btn" onClick={handleRefreshClick} title="Refresh preview">
          ↻ Refresh
        </button>
      </div>
      <div className="preview-container" style={{ maxWidth: device.width }}>
        <iframe
          ref={iframeRef}
          key={`${code?.html || ''}-${code?.css || ''}-${code?.javascript || ''}`}
          className="sandbox-iframe"
          title="Code Preview"
          sandbox="allow-scripts allow-same-origin"
          srcDoc={htmlContent}
          style={{
            width: '100%',
            height: '100%',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        />
      </div>
    </div>
  );
};
