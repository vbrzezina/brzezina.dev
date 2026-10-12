'use client'

import styled from '@emotion/styled'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { type } from '@/styles/typography'

const Group = styled.div`
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
`

const Segment = styled(Link)`
  ${type.monoS}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.25rem;
  min-height: 2rem;
  padding-inline: 0.5rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.fgTertiary};
  text-transform: uppercase;
  transition:
    background-color ${({ theme }) => theme.motion.fast} ease,
    color ${({ theme }) => theme.motion.fast} ease;

  &:hover {
    color: ${({ theme }) => theme.colors.fg};
  }

  &[aria-current='true'] {
    background: ${({ theme }) => theme.colors.raised};
    color: ${({ theme }) => theme.colors.fg};
  }
`

export function LocaleSwitch() {
  const t = useTranslations('a11y')
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <Group role="group" aria-label={t('language')}>
      {routing.locales.map((l) => (
        <Segment
          key={l}
          href={pathname}
          locale={l}
          hrefLang={l}
          lang={l}
          aria-current={l === locale ? 'true' : undefined}
        >
          {l}
        </Segment>
      ))}
    </Group>
  )
}
