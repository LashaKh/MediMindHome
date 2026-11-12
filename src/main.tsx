import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
// Inter is self-hosted from /public/fonts via @font-face in index.css.
import './index.css';
import { readStoredTheme } from './hooks/useTheme';

// Light by default; a stored choice from the theme toggle wins.
document.documentElement.classList.toggle('dark', readStoredTheme() === 'dark');

// Force English language instead of reading from localStorage
document.documentElement.lang = 'en';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
