'use client'

import styled from '@emotion/styled'
import { useTranslations } from 'next-intl'
import { useThemeToggle } from '@/app/ThemeContext'
import { Icon } from './Icon'

const IconButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.fgSecondary};
  cursor: pointer;
  transition:
    background-color ${({ theme }) => theme.motion.fast} ease,
    color ${({ theme }) => theme.motion.fast} ease,
    transform 100ms ease-out;

  &:hover {
    background: ${({ theme }) => theme.colors.raised};
    color: ${({ theme }) => theme.colors.fg};
  }

  &:active {
    transform: scale(0.94);
  }

  /* Icon is driven by the html[data-theme] attribute, so SSR and first paint always agree. */
  .icon-moon {
    display: none;
  }
  :root[data-theme='light'] & .icon-sun {
    display: none;
  }
  :root[data-theme='light'] & .icon-moon {
    display: block;
  }

  ${({ theme }) => theme.mq.reducedMotion} {
    &:active {
      transform: none;
    }
  }
`

export function ThemeToggle() {
  const t = useTranslations('a11y')
  const { scheme, toggleTheme } = useThemeToggle()
  const label = scheme === null ? t('toggleTheme') : scheme === 'dark' ? t('toLight') : t('toDark')

  return (
    <IconButton type="button" onClick={toggleTheme} aria-label={label} title={label}>
      <Icon name="sun" size={18} className="icon-sun" />
      <Icon name="moon" size={18} className="icon-moon" />
    </IconButton>
  )
}
