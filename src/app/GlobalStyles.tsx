"use client";

import { Global, css, useTheme } from "@emotion/react";

export function GlobalStyles() {
  const theme = useTheme();

  return (
    <Global
      styles={css`
        ::selection {
          background-color: ${theme.colors.primary};
          color: ${theme.colors.primaryForeground};
        }
      `}
    />
  );
}
