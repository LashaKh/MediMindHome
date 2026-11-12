import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

/** Stored choice from the toggle, else light (the default). Storage can throw in private mode. */
export const readStoredTheme = (): Theme => {
  try {
    return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
};

export const useTheme = create<ThemeState>((set) => ({
  theme: readStoredTheme(),
  toggleTheme: () => set((state) => {
    const newTheme: Theme = state.theme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
    } catch {
      // Storage unavailable (private mode): the choice lasts for this visit only.
    }
    return { theme: newTheme };
  }),
}));
