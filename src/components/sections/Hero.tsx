'use client'

import styled from '@emotion/styled'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout'
import { Button } from '@/components/ui'
import { Reveal } from '@/components/Reveal'

// ─── Decorative elements ──────────────────────────────────────────────────────

const GridBackdrop = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.3;
  pointer-events: none;
  background-image:
    linear-gradient(to right, ${({ theme }) => theme.colors.border} 1px, transparent 1px),
    linear-gradient(to bottom, ${({ theme }) => theme.colors.border} 1px, transparent 1px);
  background-size: 72px 72px;
`

const TealBlob = styled.div`
  position: absolute;
  top: -10rem;
  right: -10rem;
  width: 30rem;
  height: 30rem;
  background: radial-gradient(circle, rgba(0, 226, 218, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
`

// ─── Layout ───────────────────────────────────────────────────────────────────

const HeroSection = styled.section`
  position: relative;
  overflow: hidden;
  padding-top: ${({ theme }) => theme.space[24]};
  padding-bottom: ${({ theme }) => theme.space[24]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const HeroGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[16]};
  grid-template-columns: 1fr;

  @media (min-width: 1024px) {
    grid-template-columns: 1.5fr 1fr;
    align-items: center;
  }
`

// ─── Text column ──────────────────────────────────────────────────────────────

const Eyebrow = styled.p`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`

const Heading = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.foreground};
  margin: ${({ theme }) => theme.space[4]} 0 0;
`

const Role = styled.p`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.primary};
  margin: ${({ theme }) => theme.space[4]} 0 0;
  letter-spacing: 0.05em;
`

const Tagline = styled.p`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  font-weight: 500;
  color: ${({ theme }) => theme.colors.foreground};
  margin: ${({ theme }) => theme.space[6]} 0 0;
  line-height: 1.3;
`

const BodyText = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  color: ${({ theme }) => theme.colors.mutedForeground};
  line-height: 1.7;
  margin: ${({ theme }) => theme.space[4]} 0 0;
`

const CtaRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.space[4]};
  margin-top: ${({ theme }) => theme.space[8]};
`

// ─── Avatar column ────────────────────────────────────────────────────────────

const AvatarColumn = styled.div`
  justify-self: end;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const AvatarPlaceholder = styled.div`
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.primary}40;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary}80;
`

// ─── Component ────────────────────────────────────────────────────────────────

export function Hero() {
  const t = useTranslations('hero')

  return (
    <HeroSection id="hero">
      <GridBackdrop aria-hidden="true" />
      <TealBlob aria-hidden="true" />

      <Container>
        <HeroGrid>
          <div>
            <Reveal delay={0}>
              <Eyebrow>{t('eyebrow')}</Eyebrow>
            </Reveal>

            <Reveal delay={100}>
              <Heading>{t('heading')}</Heading>
            </Reveal>

            <Reveal delay={200}>
              <Role>{t('role')}</Role>
              <Tagline>{t('tagline')}</Tagline>
              <BodyText>{t('intro')}</BodyText>
              <BodyText>{t('current')}</BodyText>
            </Reveal>

            <Reveal delay={300}>
              <CtaRow>
                <Button asChild>
                  <a href="#work">{t('cta')}</a>
                </Button>
                <Button $variant="outline" asChild>
                  <a href="#contact">{t('ctaSecondary')}</a>
                </Button>
              </CtaRow>
            </Reveal>
          </div>

          <AvatarColumn>
            <Reveal delay={150}>
              <AvatarPlaceholder aria-label="Avatar placeholder — VB initials">
                VB
              </AvatarPlaceholder>
            </Reveal>
          </AvatarColumn>
        </HeroGrid>
      </Container>
    </HeroSection>
  )
}
