"use client";

import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider, ThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";
import createCache from "@emotion/cache";
import { useState } from "react";
import { darkTheme, lightTheme } from "@/app/theme";
import { GlobalStyles } from "@/app/GlobalStyles";
import { ThemeContext } from "@/app/ThemeContext";

const ThemeRoot = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.foreground};
  min-height: 100vh;
`;

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  const toggleTheme = () => setIsDark((prev) => !prev);
  const activeTheme = isDark ? darkTheme : lightTheme;

  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: "css" });
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: string[] = [];

    cache.insert = (...args: Parameters<typeof prevInsert>) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };

    const flush = () => {
      const prev = inserted;
      inserted = [];
      return prev;
    };

    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (!names.length) return null;
    const styles = names.map((name) => cache.inserted[name]).join("");
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <CacheProvider value={cache}>
        <ThemeProvider theme={activeTheme}>
          <GlobalStyles />
          <ThemeRoot>{children}</ThemeRoot>
        </ThemeProvider>
      </CacheProvider>
    </ThemeContext.Provider>
  );
}
