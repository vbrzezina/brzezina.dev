'use client'

import styled from '@emotion/styled'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout'

const FooterRoot = styled.footer`
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

const FooterInner = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  padding: 3rem 0 2rem;

  @media (min-width: 768px) {
    grid-template-columns: 1.5fr 1fr 1fr;
    gap: 2rem;
  }
`

const BrandCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const BrandName = styled.p`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.foreground};
  margin: 0;
`

const BrandTagline = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.mutedForeground};
  line-height: 1.5;
  margin: 0;
  max-width: 22rem;
`

const LinkCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`

const ColLabel = styled.p`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 0.25rem;
`

const FooterLink = styled.a`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.mutedForeground};
  text-decoration: none;
  transition: color 150ms ease;

  &:hover {
    color: ${({ theme }) => theme.colors.foreground};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.ring};
    outline-offset: 2px;
    border-radius: 2px;
  }
`

const Copyright = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1.25rem 0;
`

const CopyrightText = styled.p`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.mutedForeground};
  margin: 0;
`

const SECTION_IDS = ['about', 'experience', 'services', 'work', 'contact'] as const

export function SiteFooter() {
  const t = useTranslations('footer')
  const nav = useTranslations('nav')

  return (
    <FooterRoot>
      <Container>
        <FooterInner>
          <BrandCol>
            <BrandName>Václav Brzezina</BrandName>
            <BrandTagline>{t('tagline')}</BrandTagline>
          </BrandCol>

          <LinkCol>
            <ColLabel>{t('sectionsLabel')}</ColLabel>
            {SECTION_IDS.map((id) => (
              <FooterLink key={id} href={`#${id}`}>
                {nav(id)}
              </FooterLink>
            ))}
          </LinkCol>

          <LinkCol>
            <ColLabel>{t('elsewhereLabel')}</ColLabel>
            <FooterLink
              href="https://github.com/vbrzezina"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/vbrzezina
            </FooterLink>
            <FooterLink href="/cv.pdf" download>
              {t('downloadCv')}
            </FooterLink>
          </LinkCol>
        </FooterInner>

        <Copyright>
          <CopyrightText>{t('copyright')}</CopyrightText>
        </Copyright>
      </Container>
    </FooterRoot>
  )
}
