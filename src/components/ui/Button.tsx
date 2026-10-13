'use client'

import { forwardRef } from 'react'
import styled from '@emotion/styled'
import { Slot } from '@radix-ui/react-slot'
import { type } from '@/styles/typography'

type Variant = 'primary' | 'secondary' | 'ghost' | 'subtle'
type Size = 'md' | 'sm'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  $variant?: Variant
  $size?: Size
  $fullWidth?: boolean
  asChild?: boolean
}

// `as` must not be forwarded: Emotion only honours `as` (used for `asChild` → Slot) when
// shouldForwardProp rejects it; otherwise it lands on <button> as a DOM attribute.
const StyledButton = styled('button', {
  shouldForwardProp: (prop) => prop !== 'as' && !String(prop).startsWith('$'),
})<{ $variant: Variant; $size: Size; $fullWidth?: boolean }>`
  ${type.label}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: ${({ $size }) => ($size === 'sm' ? '2.5rem' : '3rem')};
  padding-inline: ${({ $size, $variant }) =>
    $variant === 'ghost' ? '0.75rem' : $size === 'sm' ? '0.875rem' : '1.375rem'};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  /* sm buttons sit in the nav next to the 6px-radius icon button and locale switch. */
  border-radius: ${({ theme, $size }) => ($size === 'sm' ? theme.radius.md : theme.radius.sm)};
  border: 1px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition:
    background-color ${({ theme }) => theme.motion.fast} ease,
    border-color ${({ theme }) => theme.motion.fast} ease,
    color ${({ theme }) => theme.motion.fast} ease,
    transform 100ms ease-out;

  svg {
    flex-shrink: 0;
    transition: transform 200ms ${({ theme }) => theme.motion.ease};
  }

  ${({ theme, $variant }) => {
    const c = theme.colors
    switch ($variant) {
      case 'primary':
        return `
          background: ${c.accent};
          color: ${c.onAccent};
          &:hover:not(:disabled):not([aria-disabled='true']) { background: ${c.accentHover}; }
        `
      case 'secondary':
        return `
          background: transparent;
          color: ${c.fg};
          border-color: ${c.borderStrong};
          &:hover:not(:disabled):not([aria-disabled='true']) { background: ${c.raised}; border-color: ${c.fgTertiary}; }
        `
      // Same treatment as IconButton, for buttons that sit beside it in the nav.
      case 'subtle':
        return `
          background: transparent;
          color: ${c.fgSecondary};
          border-color: ${c.border};
          &:hover:not(:disabled):not([aria-disabled='true']) { color: ${c.fg}; }
        `
      case 'ghost':
        return `
          background: transparent;
          color: ${c.fgSecondary};
          &:hover:not(:disabled):not([aria-disabled='true']) { background: ${c.accentSubtle}; color: ${c.fg}; }
        `
    }
  }}

  &:hover:not(:disabled):not([aria-disabled='true']) svg[data-nudge] {
    transform: translateX(2px);
  }

  /* Feedback on pointer-down, not release. */
  &:active:not(:disabled):not([aria-disabled='true']) {
    transform: scale(0.97);
  }

  /* aria-disabled rather than disabled where focus must stay put (e.g. a form's submit button while sending). */
  &:disabled,
  &[aria-disabled='true'] {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ theme }) => theme.mq.reducedMotion} {
    &:active:not(:disabled):not([aria-disabled='true']) {
      transform: none;
    }
    &:hover:not(:disabled):not([aria-disabled='true']) svg[data-nudge] {
      transform: none;
    }
  }
`

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { asChild = false, $variant = 'primary', $size = 'md', ...props },
  ref,
) {
  return (
    <StyledButton
      ref={ref}
      as={asChild ? (Slot as React.ElementType) : undefined}
      $variant={$variant}
      $size={$size}
      {...props}
    />
  )
})
