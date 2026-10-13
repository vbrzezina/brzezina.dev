import { css } from "@emotion/react";
import { theme } from "@/app/theme";

/**
 * Type ramp — size, weight, leading and tracking move together.
 * Tracking tightens as size grows; body stays at 0. See redesign spec §3.2.
 */

const { fonts } = theme;

export const type = {
  displayXl: css`
    font-family: ${fonts.display};
    font-weight: 700;
    font-size: clamp(3.25rem, 1.9rem + 5.6vw, 6rem);
    overflow-wrap: break-word;
    line-height: 0.95;
    letter-spacing: -0.035em;
  `,
  displayL: css`
    font-family: ${fonts.display};
    font-weight: 700;
    font-size: clamp(2.25rem, 1.6rem + 2.6vw, 3.5rem);
    overflow-wrap: break-word; /* long Czech compounds must not push the page sideways */
    line-height: 1.05;
    letter-spacing: -0.03em;
  `,
  titleL: css`
    font-family: ${fonts.display};
    font-weight: 500;
    font-size: clamp(1.375rem, 1.2rem + 0.6vw, 1.75rem);
    line-height: 1.2;
    letter-spacing: -0.015em;
  `,
  titleM: css`
    font-family: ${fonts.display};
    font-weight: 500;
    font-size: 1.25rem;
    line-height: 1.3;
    letter-spacing: -0.01em;
  `,
  titleS: css`
    font-family: ${fonts.display};
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.3;
    letter-spacing: -0.01em;
  `,
  bodyL: css`
    font-family: ${fonts.sans};
    font-weight: 400;
    font-size: clamp(1.125rem, 1.05rem + 0.3vw, 1.25rem);
    line-height: 1.75;
  `,
  bodyM: css`
    font-family: ${fonts.sans};
    font-weight: 400;
    font-size: 1.0625rem;
    line-height: 1.7;
  `,
  bodyS: css`
    font-family: ${fonts.sans};
    font-weight: 400;
    font-size: 0.9375rem;
    line-height: 1.65;
    letter-spacing: 0.01em;
  `,
  label: css`
    font-family: ${fonts.sans};
    font-weight: 500;
    font-size: 0.9375rem;
    line-height: 1.25;
    letter-spacing: 0.01em;
  `,
  monoEyebrow: css`
    font-family: ${fonts.mono};
    font-weight: 500;
    font-size: 0.75rem;
    line-height: 1.33;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  `,
  monoBody: css`
    font-family: ${fonts.mono};
    font-weight: 400;
    font-size: 0.875rem;
    line-height: 1.57;
  `,
  monoS: css`
    font-family: ${fonts.mono};
    font-weight: 400;
    font-size: 0.8125rem;
    line-height: 1.54;
  `,
} as const;

export const visuallyHidden = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;
