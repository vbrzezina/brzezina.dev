/**
 * Emotion theme. Colours are CSS custom properties from `src/styles/tokens.css`,
 * so switching dark/light only flips `html[data-theme]` — no style re-serialisation.
 */

const colors = {
  canvas: 'var(--color-canvas)',
  band: 'var(--color-band)',
  surface: 'var(--color-surface)',
  raised: 'var(--color-raised)',
  material: 'var(--color-material)',
  header: 'var(--color-header)',
  page: 'var(--color-page)',
  fg: 'var(--color-fg)',
  fgSecondary: 'var(--color-fg-secondary)',
  fgTertiary: 'var(--color-fg-tertiary)',
  accent: 'var(--color-accent)',
  accentHover: 'var(--color-accent-hover)',
  onAccent: 'var(--color-on-accent)',
  accentSubtle: 'var(--color-accent-subtle)',
  border: 'var(--color-border)',
  borderStrong: 'var(--color-border-strong)',
  grid: 'var(--color-grid)',
  success: 'var(--color-success)',
  error: 'var(--color-error)',
  errorSubtle: 'var(--color-error-subtle)',
} as const;

export const theme = {
  colors,
  space: {
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
  },
  fonts: {
    display: 'var(--font-display), ui-sans-serif, system-ui, sans-serif',
    sans: 'var(--font-sans), ui-sans-serif, system-ui, sans-serif',
    mono: 'var(--font-mono), ui-monospace, SFMono-Regular, monospace',
  },
  layout: {
    maxWidth: '75rem',
    gutter: 'clamp(1.25rem, 4vw, 2.5rem)',
    sectionPadding: 'clamp(5rem, 3rem + 6vw, 8rem)',
    navHeight: '4rem',
  },
  mq: {
    sm: '@media (min-width: 40em)',
    md: '@media (min-width: 56.25em)',
    lg: '@media (min-width: 68.75em)',
    reducedMotion: '@media (prefers-reduced-motion: reduce)',
  },
  motion: {
    ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
    fast: '150ms',
    reveal: '700ms',
  },
} as const;

export type AppTheme = typeof theme;
export type SpaceKey = keyof AppTheme['space'];

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Theme extends AppTheme {}
}
