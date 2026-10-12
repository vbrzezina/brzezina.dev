'use client'

import styled from '@emotion/styled'
import { useTranslations } from 'next-intl'
import { useThemeToggle } from '@/app/ThemeContext'
import { Icon } from './Icon'
import { IconButton } from './IconButton'

/* Icon is driven by the html[data-theme] attribute, so SSR and first paint always agree. */
const ToggleButton = styled(IconButton)`
  .icon-moon {
    display: none;
  }
  :root[data-theme='light'] & .icon-sun {
    display: none;
  }
  :root[data-theme='light'] & .icon-moon {
    display: block;
  }
`

export function ThemeToggle() {
  const t = useTranslations('a11y')
  const { scheme, toggleTheme } = useThemeToggle()
  const label = scheme === null ? t('toggleTheme') : scheme === 'dark' ? t('toLight') : t('toDark')

  return (
    <ToggleButton type="button" onClick={toggleTheme} aria-label={label} title={label}>
      <Icon name="sun" size={18} className="icon-sun" />
      <Icon name="moon" size={18} className="icon-moon" />
    </ToggleButton>
  )
}
