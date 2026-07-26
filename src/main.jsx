import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Register Service Worker for offline capabilities & caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Resolve correct base path dynamically at runtime for all deployment styles
    const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
    const buildTimestamp = typeof __BUILD_TIMESTAMP__ !== 'undefined' ? __BUILD_TIMESTAMP__ : Date.now();
    const swUrl = `${basePath}sw.js?v=${buildTimestamp}`;

    navigator.serviceWorker.register(swUrl)
      .then((reg) => {
        console.log('[SW] Registration successful with scope:', reg.scope);

        // Detect updates to the service worker and auto-refresh the browser client
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'activated') {
                console.log('[SW] New version activated. Reloading page to apply updates...');
                window.location.reload();
              }
            });
          }
        });
      })
      .catch((err) => {
        console.error('[SW] Registration failed:', err);
      });
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
