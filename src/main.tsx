import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
// Three type voices (direction v2): Fraunces for display, Inter for body
// (self-hosted via @font-face in index.css), IBM Plex Mono for data and labels.
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './index.css';
import { readStoredTheme } from './hooks/useTheme';

// Follows the device (prefers-color-scheme); a stored choice from the theme toggle wins.
document.documentElement.classList.toggle('dark', readStoredTheme() === 'dark');

// Force English language instead of reading from localStorage
document.documentElement.lang = 'en';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
