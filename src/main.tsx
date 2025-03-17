import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './lib/supabase';

// Initialize theme and language from localStorage
const theme = localStorage.getItem('theme') || 'light';
const language = localStorage.getItem('language') || 'en';

if (theme === 'dark') {
  document.documentElement.classList.add('dark');
}

document.documentElement.lang = language;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);