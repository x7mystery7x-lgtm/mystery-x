import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/main.css'

import { AuthProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        // SW registered successfully
      })
      .catch((registrationError) => {
        // SW registration failed
      });
  });
}
