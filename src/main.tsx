import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './lib/supabase';

// Initialize theme and language from localStorage
const theme = localStorage.getItem('theme') || 'light';
// Force English language instead of reading from localStorage
const language = 'en';

// Apply theme
if (theme === 'dark') {
  document.documentElement.classList.add('dark');
}

// Apply language
document.documentElement.lang = language;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);