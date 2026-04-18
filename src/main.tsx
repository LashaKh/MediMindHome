import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
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