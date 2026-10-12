import { css } from '@emotion/react';
import { theme } from '@/app/theme';

/** The faint technical grid used behind the hero, portrait and work thumbnail. */
export const gridBackdrop = (cell: number) => css`
  background-image:
    linear-gradient(to right, ${theme.colors.grid} 1px, transparent 1px),
    linear-gradient(to bottom, ${theme.colors.grid} 1px, transparent 1px);
  background-size: ${cell}px ${cell}px;
`;
