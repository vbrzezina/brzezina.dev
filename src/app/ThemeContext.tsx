'use client';

import { createContext, useContext } from 'react';

interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  isDark: true,
  toggleTheme: () => {},
});

export function useThemeToggle() {
  return useContext(ThemeContext);
}
