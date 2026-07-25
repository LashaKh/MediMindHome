import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
// Committed typefaces — self-hosted, Vite-bundled to /assets (immutable-cached).
// Serif (Fraunces, opsz axis) = human voice; mono (IBM Plex) = system voice.
// Imported before index.css so @font-face is registered ahead of first paint.
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import '@fontsource/ibm-plex-mono/latin-600.css';
import './index.css';

// Initialize theme and language from localStorage (default: dark)
const theme = localStorage.getItem('theme') || 'dark';
// Force English language instead of reading from localStorage
const language = 'en';

// Apply theme
if (theme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

// Apply language
document.documentElement.lang = language;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);