'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
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
  const fadeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setScheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  }, []);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    const next: ColorScheme = root.dataset.theme === 'light' ? 'dark' : 'light';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduceMotion) {
      // A rapid second toggle restarts the fade instead of having it cut off by the first timer.
      window.clearTimeout(fadeTimer.current);
      root.classList.add('theme-switching');
      fadeTimer.current = window.setTimeout(() => root.classList.remove('theme-switching'), 320);
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
