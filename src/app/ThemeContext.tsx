'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { THEME_STORAGE_KEY } from '@/app/themeScript';

export type ColorScheme = 'dark' | 'light';

interface ThemeContextValue {
  /** `null` until mounted — the server cannot know the stored preference. */
  scheme: ColorScheme | null;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  scheme: null,
  toggleTheme: () => {},
});

export function ColorSchemeProvider({ children }: { children: React.ReactNode }) {
  const [scheme, setScheme] = useState<ColorScheme | null>(null);

  useEffect(() => {
    setScheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  }, []);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    const next: ColorScheme = root.dataset.theme === 'light' ? 'dark' : 'light';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduceMotion) {
      root.classList.add('theme-switching');
      window.setTimeout(() => root.classList.remove('theme-switching'), 320);
    }

    root.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private mode) — the toggle still works for this visit.
    }
    setScheme(next);
  }, []);

  return <ThemeContext.Provider value={{ scheme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useThemeToggle() {
  return useContext(ThemeContext);
}
