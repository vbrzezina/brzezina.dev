const base = {
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
  },
  radius: {
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
  },
  fonts: {
    display: 'var(--font-display)',
    sans: 'var(--font-sans)',
    mono: 'var(--font-mono)',
  },
  nav: {
    height: '4rem',
  },
} as const;

const darkColors = {
  background:           '#050e19',
  foreground:           '#f0f4f7',
  surface:              '#0f1926',
  surfaceForeground:    '#f0f4f7',
  card:                 '#0f1926',
  cardForeground:       '#f0f4f7',
  popover:              '#0f1926',
  popoverForeground:    '#f0f4f7',
  primary:              '#00e2da',
  primaryForeground:    '#050e19',
  primaryHover:         '#67f1e9',
  secondary:            '#1a2532',
  secondaryForeground:  '#f0f4f7',
  muted:                '#1a2532',
  mutedForeground:      '#9fa9b4',
  accent:               '#00e2da',
  accentForeground:     '#050e19',
  destructive:          '#f0555b',
  destructiveForeground:'#050e19',
  border:               '#fcfcfc1f',
  input:                '#0f1926',
  ring:                 '#00e2da',
} as const;

const lightColors = {
  background:           '#f8f8f3',
  foreground:           '#091521',
  surface:              '#f1f0ea',
  surfaceForeground:    '#091521',
  card:                 '#fefefb',
  cardForeground:       '#091521',
  popover:              '#fefefb',
  popoverForeground:    '#091521',
  primary:              '#008493',
  primaryForeground:    '#fcfcf8',
  primaryHover:         '#007183',
  secondary:            '#e3e8ee',
  secondaryForeground:  '#101c28',
  muted:                '#e7ecf0',
  mutedForeground:      '#555f69',
  accent:               '#008493',
  accentForeground:     '#fcfcf8',
  destructive:          '#cc2827',
  destructiveForeground:'#fcfcf8',
  border:               '#d3d8de',
  input:                '#d3d8de',
  ring:                 '#008493',
} as const;

export const darkTheme = { ...base, colors: darkColors };
export const lightTheme = { ...base, colors: lightColors };

export type AppTheme = Omit<typeof darkTheme, 'colors'> & {
  colors: Record<keyof typeof darkColors, string>;
};
export type SpaceKey = keyof AppTheme['space'];

declare module '@emotion/react' {
  interface Theme extends AppTheme {}
}
