'use client'

import styled from '@emotion/styled'
import { Slot } from '@radix-ui/react-slot'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  $variant?: 'solid' | 'outline'
  asChild?: boolean
}

const StyledButton = styled('button', {
  shouldForwardProp: (prop) => !String(prop).startsWith('$'),
})<Pick<ButtonProps, '$variant'>>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 1rem;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.radius.base};
  border: 1px solid transparent;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  transition:
    background 200ms ease,
    border-color 200ms ease,
    color 200ms ease;

  ${({ theme, $variant = 'solid' }) =>
    $variant === 'solid'
      ? `
        background: ${theme.colors.primary};
        color: ${theme.colors.primaryForeground};
        &:hover:not(:disabled) { background: ${theme.colors.primaryHover}; }
      `
      : `
        background: transparent;
        color: ${theme.colors.foreground};
        border-color: ${theme.colors.border};
        &:hover:not(:disabled) {
          border-color: ${theme.colors.primary};
          color: ${theme.colors.primary};
        }
      `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.ring};
    outline-offset: 2px;
  }
`

export function Button({ asChild = false, ...props }: ButtonProps) {
  return (
    <StyledButton
      as={asChild ? (Slot as React.ElementType) : undefined}
      {...props}
    />
  )
}
