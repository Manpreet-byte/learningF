// Sandboxed iframe execution with security and timeout prevention

const EXECUTION_TIMEOUT = 5000; // 5 seconds

/**
 * Executes code in a sandboxed iframe with timeout protection and console capture
 */
export function executeCodeInSandbox(iframe, code, onConsole) {
  return new Promise((resolve) => {
    let executionTimeout;
    const consoleLogs = [];
    let hasResolved = false;

    const cleanup = () => {
      clearTimeout(executionTimeout);
    };

    const finish = (result) => {
      if (!hasResolved) {
        hasResolved = true;
        cleanup();
        resolve(result);
      }
    };

    // Set timeout for infinite loop protection
    executionTimeout = setTimeout(() => {
      finish({
        success: false,
        error: {
          type: 'runtime',
          message: 'Code execution timeout (5s limit exceeded). Check for infinite loops.',
        },
        consoleLogs,
      });
    }, EXECUTION_TIMEOUT);

    const iframeWindow = iframe.contentWindow;

    if (!iframeWindow) {
      finish({
        success: false,
        error: { type: 'runtime', message: 'Failed to access iframe window' },
        consoleLogs,
      });
      return;
    }

    // Message listener function
    const messageListener = (event) => {
      if (event.data.type === 'console') {
        const { level, args } = event.data;
        const message = args.map((arg) => {
          if (typeof arg === 'object') {
            try {
              return JSON.stringify(arg);
            } catch {
              return String(arg);
            }
          }
          return String(arg);
        }).join(' ');

        const consoleMsg = {
          id: `${Date.now()}-${Math.random()}`,
          type: level,
          message,
          timestamp: Date.now(),
        };
        consoleLogs.push(consoleMsg);
        onConsole(consoleMsg);
      } else if (event.data.type === 'error') {
        finish({
          success: false,
          error: {
            type: 'runtime',
            message: event.data.message,
            stack: event.data.stack,
            lineNumber: event.data.lineNumber,
          },
          consoleLogs,
        });
      } else if (event.data.type === 'ready') {
        finish({
          success: true,
          consoleLogs,
        });
      }
    };

    // Set up message listener BEFORE loading iframe
    window.addEventListener('message', messageListener);

    // Build and inject code into iframe
    const html = buildSandboxHTML(code);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    
    iframe.onload = () => {
      // Iframe loaded, content will execute
    };
    
    iframe.src = blobUrl;

    // Cleanup listener on finish
    const originalFinish = finish;
    const wrappedFinish = (result) => {
      window.removeEventListener('message', messageListener);
      originalFinish(result);
    };
    
    // Override finish to use wrapped version
    finish = wrappedFinish;
  });
}

/**
 * Builds complete HTML document with CSS, JS, and console capture
 */
export function buildSandboxHTML(code) {
  const html = code?.html || '';
  const css = code?.css || '';
  const javascript = code?.javascript || '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code Sandbox</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #fff;
    }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    // Override console methods to send to parent
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    function sendConsole(level, args) {
      try {
        window.parent.postMessage({
          type: 'console',
          level,
          args: Array.from(args).map(arg => {
            if (typeof arg === 'object') {
              try { return JSON.stringify(arg); }
              catch { return String(arg); }
            }
            return String(arg);
          })
        }, '*');
      } catch (e) {
        // Silently fail if postMessage unavailable
      }
    }

    console.log = function(...args) {
      originalLog.apply(console, args);
      sendConsole('log', args);
    };

    console.error = function(...args) {
      originalError.apply(console, args);
      sendConsole('error', args);
    };

    console.warn = function(...args) {
      originalWarn.apply(console, args);
      sendConsole('warn', args);
    };

    console.info = function(...args) {
      originalInfo.apply(console, args);
      sendConsole('info', args);
    };

    // Error handler for runtime errors
    window.addEventListener('error', (event) => {
      try {
        window.parent.postMessage({
          type: 'error',
          message: event.message,
          stack: event.error?.stack,
          lineNumber: event.lineno
        }, '*');
      } catch (e) {
        // Silently fail
      }
    });

    // Signal ready
    setTimeout(() => {
      try {
        window.parent.postMessage({ type: 'ready' }, '*');
      } catch (e) {
        // Silently fail
      }
    }, 100);
  </script>

  <script>
    try {
      ${javascript}
    } catch (e) {
      console.error('Syntax or Runtime Error: ' + e.message);
      try {
        window.parent.postMessage({
          type: 'error',
          message: e.message,
          stack: e.stack
        }, '*');
      } catch (err) {
        // Silently fail
      }
    }
  </script>
</body>
</html>
  `;
}

/**
 * Detects JavaScript syntax errors without execution
 */
export function detectSyntaxErrors(code) {
  try {
    // Use Function constructor to detect syntax errors
    new Function(code);
    return null;
  } catch (error) {
    return {
      type: 'syntax',
      message: error.message,
    };
  }
}
