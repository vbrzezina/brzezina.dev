'use client'

import styled from '@emotion/styled'
import { useTranslations } from 'next-intl'
import { Container, Box, Spacer } from '@/components/layout'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLACEHOLDER_CARDS = [
  { key: 'one', description: 'Currently building this site. Case studies land here next.', tags: 'TBD · TBD · TBD' },
  { key: 'two', description: 'Reserved for an upcoming case study.', tags: 'TBD · TBD · TBD' },
  { key: 'three', description: 'Reserved for an upcoming case study.', tags: 'TBD · TBD · TBD' },
] as const

// ─── Styled components ────────────────────────────────────────────────────────

const WorkSection = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const CardGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const CardArticle = styled.article`
  border: 1px dashed ${({ theme }) => theme.colors.border};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: border-color 200ms;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary}80;
  }
`

const Thumbnail = styled.div`
  aspect-ratio: 4 / 3;
  background-image: 
    linear-gradient(to right, ${({ theme }) => theme.colors.border} 1px, transparent 1px),
    linear-gradient(to bottom, ${({ theme }) => theme.colors.border} 1px, transparent 1px);
  background-size: 72px 72px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
`

const CardTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.foreground};
  margin: 0;
`

const CardDescription = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.mutedForeground};
  margin: 0;
`

const StackTags = styled.p`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.mutedForeground};
  margin: 0;
  margin-top: auto;
`

// ─── Component ────────────────────────────────────────────────────────────────

export function Work() {
  const t = useTranslations('work')

  const cards = PLACEHOLDER_CARDS.map((card, i) => ({
    ...card,
    title: i === 0 ? t('comingSoon') : '—',
  }))

  return (
    <WorkSection id="work">
      <Container>
        <Box $py={24}>
          <Reveal delay={0}>
            <SectionHeading
              index={t('index')}
              slug={t('slug')}
              title={t('heading')}
            />
          </Reveal>

          <Spacer $size={16} />

          <Reveal delay={100}>
            <CardGrid>
              {cards.map((card) => (
                <CardArticle key={card.key}>
                  <Thumbnail aria-hidden="true" />
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                  <StackTags>{card.tags}</StackTags>
                </CardArticle>
              ))}
            </CardGrid>
          </Reveal>
        </Box>
      </Container>
    </WorkSection>
  )
}
