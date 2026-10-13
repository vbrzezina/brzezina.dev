'use client'

import Image from 'next/image'
import styled from '@emotion/styled'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout'
import { Reveal } from '@/components/Reveal'
import { Button, Icon, StatusPill } from '@/components/ui'
import { CLIENTS, WHOAMI } from '@/data/site'
import { gridBackdrop } from '@/styles/backdrop'
import { type } from '@/styles/typography'
import heroPortrait from '@/assets/photos/portrait-hero.jpg'

// ─── Backdrop ─────────────────────────────────────────────────────────────────

const HeroSection = styled.section`
  position: relative;
  overflow: hidden;
  margin-top: calc(-1 * ${({ theme }) => theme.layout.navHeight});
  padding-top: calc(${({ theme }) => theme.layout.navHeight} + clamp(3rem, 2rem + 4vw, 6rem));
  padding-bottom: clamp(3rem, 2rem + 3vw, 5rem);
`

/** 72px technical grid, masked so it dissolves before the edges. */
const Grid = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  ${gridBackdrop(72)}
  background-position: center top;
  mask-image: radial-gradient(ellipse 80% 70% at 60% 35%, #000 30%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse 80% 70% at 60% 35%, #000 30%, transparent 75%);
`

const Glow = styled.div`
  position: absolute;
  top: -20rem;
  right: -14rem;
  width: 48rem;
  height: 48rem;
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(circle, ${({ theme }) => theme.colors.accentSubtle} 0%, transparent 65%);
`

// ─── Layout ───────────────────────────────────────────────────────────────────

const Layout = styled.div`
  position: relative;
  display: grid;
  gap: 3rem;
  align-items: center;

  ${({ theme }) => theme.mq.lg} {
    grid-template-columns: 7fr 5fr;
    gap: 4rem;
  }
`

const Copy = styled.div``

const Name = styled.h1`
  ${type.displayXl}
  color: ${({ theme }) => theme.colors.fg};
  margin-top: 1.75rem;
`

const NameLine = styled.span`
  display: block;
`

const Role = styled.p`
  ${type.monoS}
  color: ${({ theme }) => theme.colors.accent};
  margin-top: 1.5rem;
  letter-spacing: 0.04em;
`

const Tagline = styled.p`
  ${type.titleL}
  color: ${({ theme }) => theme.colors.fg};
  margin-top: 0.75rem;
  max-width: 30ch;
`

const Intro = styled.p`
  ${type.bodyL}
  color: ${({ theme }) => theme.colors.fgSecondary};
  margin-top: 1.25rem;
  max-width: 36rem;
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2.5rem;

  & > * {
    flex: 1 1 auto;
  }

  ${({ theme }) => theme.mq.sm} {
    & > * {
      flex: 0 0 auto;
    }
  }
`

// ─── Portrait + whoami ────────────────────────────────────────────────────────

/* Mobile: name first, then a smaller portrait with the card tucked under it.
   Desktop: the card floats over the portrait's lower-left edge. */
const Visual = styled.div`
  position: relative;
  width: min(100%, 26rem);

  ${({ theme }) => theme.mq.lg} {
    justify-self: end;
    padding-bottom: 4.5rem;
  }
`

const Portrait = styled.div`
  position: relative;
  width: min(75%, 17rem);
  aspect-ratio: 1;
  margin-left: auto;
  border-radius: 50%;
  padding: 6px;
  border: 1px solid ${({ theme }) => theme.colors.accent};

  ${({ theme }) => theme.mq.lg} {
    width: 82%;
  }
`

const PortraitFill = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};

  img {
    object-fit: cover;
  }
`

/** Floating material card — anchored to the portrait's lower-left edge. */
/* Positioning lives on the Reveal wrapper: its transform would otherwise become the containing block mid-animation. */
/* Below lg the card tucks under the portrait — overlapping the shoulders, never the face. */
const WhoamiReveal = styled(Reveal)`
  position: relative;
  margin-top: -4rem;
  width: min(100%, 26rem);

  ${({ theme }) => theme.mq.lg} {
    position: absolute;
    left: 0;
    bottom: 0;
    margin-top: 0;
  }
`

const Whoami = styled.div`
  ${type.monoS}
  padding: 1rem 1.25rem 1.125rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.material};
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);

  @media (prefers-reduced-transparency: reduce) {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
`

const Facts = styled.dl`
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 1.25rem;
  row-gap: 0.25rem;

  dt {
    color: ${({ theme }) => theme.colors.fgTertiary};
  }
  dd {
    color: ${({ theme }) => theme.colors.fg};
  }
`

const Prompt = styled.p`
  color: ${({ theme }) => theme.colors.fgTertiary};
  margin-bottom: 0.5rem;

  b {
    color: ${({ theme }) => theme.colors.accent};
    font-weight: 400;
  }
  span {
    color: ${({ theme }) => theme.colors.fg};
  }
`

// ─── Proof strip ──────────────────────────────────────────────────────────────

const Proof = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.75rem 2rem;
  margin-top: clamp(4rem, 3rem + 4vw, 6rem);
`

const ProofLabel = styled.p`
  ${type.monoEyebrow}
  color: ${({ theme }) => theme.colors.fgTertiary};
`

const ClientList = styled.ul`
  ${type.monoBody}
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.75rem;
  color: ${({ theme }) => theme.colors.fgSecondary};
`

// ─── Component ────────────────────────────────────────────────────────────────

export function Hero() {
  const t = useTranslations('hero')
  const [first, ...rest] = t('heading').split(' ')

  return (
    <HeroSection id="top" aria-labelledby="hero-title">
      <Grid aria-hidden="true" />
      <Glow aria-hidden="true" />

      <Container>
        <Layout>
          <Copy>
            <Reveal eager>
              <StatusPill>{t('status')}</StatusPill>
              <Name id="hero-title">
                <NameLine>{first}</NameLine> <NameLine>{rest.join(' ')}</NameLine>
              </Name>
            </Reveal>

            <Reveal eager delay={80}>
              <Role>{t('role')}</Role>
              <Tagline>{t('tagline')}</Tagline>
              <Intro>{t('intro')}</Intro>
            </Reveal>

            <Reveal eager delay={160}>
              <Actions>
                <Button asChild>
                  <a href="#work">
                    {t('cta')}
                    <Icon name="arrowRight" size={18} data-nudge />
                  </a>
                </Button>
                <Button $variant="secondary" asChild>
                  <a href="#contact">{t('ctaSecondary')}</a>
                </Button>
              </Actions>
            </Reveal>
          </Copy>

          <Visual>
            <Reveal eager delay={120}>
              <Portrait>
                <PortraitFill>
                  <Image
                    src={heroPortrait}
                    alt={t('portraitLabel')}
                    fill
                    priority
                    placeholder="blur"
                    sizes="(min-width: 68.75em) 22rem, 11rem"
                  />
                </PortraitFill>
              </Portrait>
            </Reveal>
            <WhoamiReveal eager delay={260}>
              <Whoami>
                <Prompt aria-hidden="true">
                  ~ <b>$</b> <span>whoami</span>
                </Prompt>
                <Facts aria-label={t('whoami.label')}>
                  <dt>{t('whoami.role')}</dt>
                  <dd>{t('whoami.roleValue')}</dd>
                  <dt>{t('whoami.stack')}</dt>
                  <dd>{WHOAMI.stack.join(' · ')}</dd>
                  <dt>{t('whoami.based')}</dt>
                  <dd>{t('whoami.basedValue')}</dd>
                  <dt>{t('whoami.speaks')}</dt>
                  <dd>{WHOAMI.speaks.join(' · ')}</dd>
                </Facts>
              </Whoami>
            </WhoamiReveal>
          </Visual>
        </Layout>

        <Proof>
          <ProofLabel>{t('shippedFor')}</ProofLabel>
          <ClientList role="list">
            {CLIENTS.map((client) => (
              <li key={client}>{client}</li>
            ))}
          </ClientList>
        </Proof>
      </Container>
    </HeroSection>
  )
}
