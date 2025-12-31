import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App, ErrorBoundary } from './components'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </AuthProvider>
  </StrictMode>,
)
