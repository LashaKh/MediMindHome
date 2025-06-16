import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Initialize theme from localStorage or default to dark
const getInitialTheme = (): 'light' | 'dark' => {
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
  return savedTheme || 'dark';
};

// Initialize dark mode on document
const initializeTheme = () => {
  const theme = getInitialTheme();
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  return theme;
};

export const useTheme = create<ThemeState>((set) => ({
  theme: initializeTheme(),
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
    return { theme: newTheme };
  }),
}));