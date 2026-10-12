'use client'

import styled from '@emotion/styled'
import { useTranslations } from 'next-intl'
import { Container, Section } from '@/components/layout'
import { Reveal } from '@/components/Reveal'
import { SectionHeader, StackList } from '@/components/ui'
import { LANGUAGE_IDS, SKILL_GROUPS } from '@/data/skills'
import { gridBackdrop } from '@/styles/backdrop'
import { type } from '@/styles/typography'

// ─── Bio ──────────────────────────────────────────────────────────────────────

const BioGrid = styled.div`
  display: grid;
  gap: 2.5rem;
  margin-top: clamp(3rem, 2rem + 3vw, 4.5rem);

  ${({ theme }) => theme.mq.md} {
    grid-template-columns: 5fr 7fr;
    gap: 4rem;
    align-items: start;
  }
`

/** Rectangular 4:5 slot sized for the real photo that replaces it. */
const Portrait = styled.div`
  position: relative;
  aspect-ratio: 4 / 5;
  max-width: 28rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  ${gridBackdrop(36)}
  display: grid;
  place-items: center;
  overflow: hidden;

  span {
    font-family: ${({ theme }) => theme.fonts.display};
    font-weight: 700;
    font-size: clamp(4rem, 3rem + 4vw, 7rem);
    letter-spacing: -0.05em;
    color: ${({ theme }) => theme.colors.borderStrong};
  }
`

const Bio = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 40rem;
`

const Lede = styled.p`
  ${type.bodyL}
  color: ${({ theme }) => theme.colors.fg};
`

const Paragraph = styled.p`
  ${type.bodyM}
  color: ${({ theme }) => theme.colors.fgSecondary};
`

const SubHeading = styled.h3`
  ${type.monoEyebrow}
  color: ${({ theme }) => theme.colors.fgTertiary};
`

const Languages = styled.dl`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 0.75rem;

  div {
    padding-left: 0.875rem;
    border-left: 1px solid ${({ theme }) => theme.colors.accent};
  }
  dt {
    ${type.label}
    color: ${({ theme }) => theme.colors.fg};
  }
  dd {
    ${type.bodyS}
    color: ${({ theme }) => theme.colors.fgTertiary};
    margin-top: 0.125rem;
  }
`

const LanguagesBlock = styled.div`
  margin-top: 1rem;
  padding-top: 1.75rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

// ─── Stack table ──────────────────────────────────────────────────────────────

const StackBlock = styled.div`
  margin-top: clamp(4rem, 3rem + 3vw, 6rem);
`

const StackTitle = styled.h3`
  ${type.titleL}
  color: ${({ theme }) => theme.colors.fg};
  margin-bottom: 1.5rem;
`

const StackRows = styled.dl`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const StackRow = styled.div`
  display: grid;
  gap: 0.5rem;
  padding-block: 1.25rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  ${({ theme }) => theme.mq.md} {
    grid-template-columns: 3fr 9fr;
    gap: 2rem;
    align-items: baseline;
  }

  dt {
    ${type.titleM}
    color: ${({ theme }) => theme.colors.fg};
  }
`

// ─── Component ────────────────────────────────────────────────────────────────

export function About() {
  const t = useTranslations('about')

  return (
    <Section id="about" aria-labelledby="about-title">
      <Container>
        <Reveal>
          <SectionHeader index={t('index')} label={t('slug')} title={t('heading')} titleId="about-title" />
        </Reveal>

        <BioGrid>
          <Reveal delay={80}>
            <Portrait role="img" aria-label={t('portraitLabel')}>
              <span aria-hidden="true">VB</span>
            </Portrait>
          </Reveal>

          <Reveal delay={160}>
            <Bio>
              <Lede>{t('bio.lede')}</Lede>
              <Paragraph>{t('bio.p2')}</Paragraph>
              <Paragraph>{t('bio.p3')}</Paragraph>

              <LanguagesBlock>
                <SubHeading>{t('languagesHeading')}</SubHeading>
                <Languages>
                  {LANGUAGE_IDS.map((id) => (
                    <div key={id}>
                      <dt>{t(`languages.${id}.name`)}</dt>
                      <dd>{t(`languages.${id}.level`)}</dd>
                    </div>
                  ))}
                </Languages>
              </LanguagesBlock>
            </Bio>
          </Reveal>
        </BioGrid>

        <StackBlock>
          <Reveal>
            <StackTitle>{t('stackHeading')}</StackTitle>
          </Reveal>
          <Reveal delay={80}>
            <StackRows>
              {SKILL_GROUPS.map((group) => {
                const items = group.items.map((item) =>
                  typeof item === 'string' ? item : t(`skills.items.${item.key}`),
                )
                return (
                  <StackRow key={group.id}>
                    <dt>{t(`skills.categories.${group.id}`)}</dt>
                    <dd>
                      <StackList items={items} tone="secondary" />
                    </dd>
                  </StackRow>
                )
              })}
            </StackRows>
          </Reveal>
        </StackBlock>
      </Container>
    </Section>
  )
}
