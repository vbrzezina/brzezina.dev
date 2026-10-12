'use client'

import styled from '@emotion/styled'
import { useTranslations } from 'next-intl'
import { Container, Section } from '@/components/layout'
import { Reveal } from '@/components/Reveal'
import { Button, Icon, SectionHeader, StackList } from '@/components/ui'
import { FEATURED_PROJECT } from '@/data/work'
import { gridBackdrop } from '@/styles/backdrop'
import { type } from '@/styles/typography'

const Grid = styled.div`
  display: grid;
  gap: 1.25rem;
  margin-top: clamp(3rem, 2rem + 3vw, 4.5rem);

  ${({ theme }) => theme.mq.lg} {
    grid-template-columns: 8fr 4fr;
  }
`

// ─── Featured project ─────────────────────────────────────────────────────────

const Featured = styled.article`
  display: grid;
  height: 100%;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;

  ${({ theme }) => theme.mq.md} {
    grid-template-columns: 1.1fr 1fr;
  }
`

/** Thumbnail: technical grid + a miniature browser showing the hero. */
const Thumb = styled.div`
  position: relative;
  min-height: 15rem;
  padding: 2rem 0 0 2rem;
  background-color: ${({ theme }) => theme.colors.canvas};
  ${gridBackdrop(24)}
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;

  ${({ theme }) => theme.mq.md} {
    border-bottom: none;
    border-right: 1px solid ${({ theme }) => theme.colors.border};
  }
`

const Browser = styled.div`
  height: 100%;
  min-height: 13rem;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-right: none;
  border-bottom: none;
  border-radius: ${({ theme }) => theme.radius.md} 0 0 0;
  background: ${({ theme }) => theme.colors.surface};
`

const Chrome = styled.div`
  display: flex;
  gap: 6px;
  padding: 0.625rem 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.borderStrong};
  }
`

const MiniHero = styled.div`
  padding: 1.25rem 1.25rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Bar = styled.span<{ $w: string; $h?: string; $accent?: boolean }>`
  display: block;
  width: ${({ $w }) => $w};
  height: ${({ $h }) => $h ?? '6px'};
  border-radius: 2px;
  background: ${({ theme, $accent }) => ($accent ? theme.colors.accent : theme.colors.raised)};
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.75rem;
`

const Status = styled.p`
  ${type.monoEyebrow}
  align-self: flex-start;
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.accentSubtle};
  /* accent-hover: darker in light, lighter in dark — keeps 4.5:1 on the tinted fill */
  color: ${({ theme }) => theme.colors.accentHover};
`

const ProjectTitle = styled.h3`
  ${type.titleL}
  color: ${({ theme }) => theme.colors.fg};
  margin-top: 0.5rem;
`

const ProjectDescription = styled.p`
  ${type.bodyS}
  color: ${({ theme }) => theme.colors.fgSecondary};
  flex: 1;
`

const SourceLink = styled.a`
  ${type.label}
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  align-self: flex-start;
  min-height: 2.75rem;
  margin-top: 0.5rem;
  color: ${({ theme }) => theme.colors.accent};

  svg {
    transition: transform 200ms ${({ theme }) => theme.motion.ease};
  }
  &:hover svg {
    transform: translate(2px, -2px);
  }
`

// ─── Open slot ────────────────────────────────────────────────────────────────

const OpenSlot = styled.article`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  height: 100%;
  padding: 1.75rem;
  border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radius.md};
`

const SlotLabel = styled.p`
  ${type.monoEyebrow}
  color: ${({ theme }) => theme.colors.fgTertiary};
`

const SlotTitle = styled.h3`
  ${type.titleL}
  color: ${({ theme }) => theme.colors.fg};
  margin-top: auto;
  padding-top: 3rem;
`

const SlotDescription = styled.p`
  ${type.bodyS}
  color: ${({ theme }) => theme.colors.fgSecondary};
  margin-bottom: 0.75rem;
`

// ─── Component ────────────────────────────────────────────────────────────────

export function Work() {
  const t = useTranslations('work')

  return (
    <Section id="work" aria-labelledby="work-title">
      <Container>
        <Reveal>
          <SectionHeader
            index={t('index')}
            label={t('slug')}
            title={t('heading')}
            titleId="work-title"
            lead={t('lead')}
          />
        </Reveal>

        <Grid>
          <Reveal delay={80}>
            <Featured>
              <Thumb role="img" aria-label={t('featured.thumbLabel')}>
                <Browser>
                  <Chrome>
                    <span />
                    <span />
                    <span />
                  </Chrome>
                  <MiniHero>
                    <Bar $w="28%" $h="5px" $accent />
                    <Bar $w="62%" $h="14px" />
                    <Bar $w="48%" $h="14px" />
                    <Bar $w="70%" />
                    <Bar $w="56%" />
                    <Bar $w="22%" $h="12px" $accent />
                  </MiniHero>
                </Browser>
              </Thumb>
              <Body>
                <Status>{t('featured.status')}</Status>
                <ProjectTitle>{FEATURED_PROJECT.title}</ProjectTitle>
                <ProjectDescription>{t('featured.description')}</ProjectDescription>
                <StackList items={FEATURED_PROJECT.stack} />
                <SourceLink href={FEATURED_PROJECT.url} target="_blank" rel="noopener noreferrer">
                  {t('featured.link')}
                  <Icon name="arrowUpRight" size={16} />
                </SourceLink>
              </Body>
            </Featured>
          </Reveal>

          <Reveal delay={160}>
            <OpenSlot>
              <SlotLabel>{t('open.label')}</SlotLabel>
              <SlotTitle>{t('open.title')}</SlotTitle>
              <SlotDescription>{t('open.description')}</SlotDescription>
              <Button $variant="secondary" asChild>
                <a href="#contact">
                  {t('open.cta')}
                  <Icon name="arrowRight" size={18} data-nudge />
                </a>
              </Button>
            </OpenSlot>
          </Reveal>
        </Grid>
      </Container>
    </Section>
  )
}
