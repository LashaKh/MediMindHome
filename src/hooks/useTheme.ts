import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

/** The device's preference (prefers-color-scheme); light when it cannot be read. */
const deviceTheme = (): Theme =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

/** Stored choice from the toggle, else the device's preference. Storage can throw in private mode. */
export const readStoredTheme = (): Theme => {
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    // Storage unavailable: fall through to the device's preference.
  }
  return deviceTheme();
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
