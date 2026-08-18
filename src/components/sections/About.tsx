'use client'

import styled from '@emotion/styled'
import { useTranslations } from 'next-intl'
import { Container, Box, Spacer } from '@/components/layout'
import { Tag } from '@/components/ui'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'

// ─── Data ─────────────────────────────────────────────────────────────────────

const LANGUAGES = [
  { name: 'English', level: 'Fluent' },
  { name: 'Czech', level: 'Native' },
] as const

const SKILL_GROUPS = [
  { category: 'Frontend', items: ['TypeScript', 'React', 'Next.js', 'Emotion', 'Radix UI', 'React Native'] },
  { category: 'Backend', items: ['Node.js', 'Express', 'NestJS', 'GraphQL', 'REST APIs', 'tRPC'] },
  { category: 'Cloud & Infra', items: ['AWS', 'Terraform', 'Docker', 'GitHub Actions', 'Vercel'] },
  { category: 'Databases', items: ['PostgreSQL', 'DynamoDB', 'Redis', 'Prisma', 'TypeORM'] },
  { category: 'Practices', items: ['TDD', 'Domain-Driven Design', 'Microservices', 'Monorepo', 'CI/CD'] },
  { category: 'GenAI', items: ['OpenAI API', 'LangChain', 'RAG pipelines', 'Claude API'] },
] as const

const BIO = [
  "Senior full-stack engineer with nine years' experience building production-grade web applications across fintech, e-commerce, and enterprise SaaS.",
  "I specialise in TypeScript and React on the frontend, Node.js and AWS on the backend — always with an eye on performance, accessibility, and developer experience.",
  "Currently at EPAM Systems, where I lead frontend architecture on a large-scale client portal used by thousands of enterprise customers across Europe.",
  "Outside client work I maintain several open-source tools and contribute to the wider TypeScript ecosystem.",
]

// ─── Layout ───────────────────────────────────────────────────────────────────

const AboutSection = styled.section`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const TwoColGrid = styled.div`
  display: grid;
  gap: 3rem;

  @media (min-width: 1024px) {
    grid-template-columns: 0.8fr 1.2fr;
    align-items: start;
  }
`

const ImagePlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.75rem;
`

// ─── Bio ──────────────────────────────────────────────────────────────────────

const BioParagraph = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  color: ${({ theme }) => theme.colors.mutedForeground};
  line-height: 1.7;
  margin: 0;

  & + & {
    margin-top: 1rem;
  }
`

const LanguageList = styled.dl`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 2rem;
`

const LanguageItem = styled.div`
  border-left: 2px solid ${({ theme }) => theme.colors.primary};
  padding-left: 0.75rem;
`

const LanguageTerm = styled.dt`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: 600;
`

const LanguageDesc = styled.dd`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.mutedForeground};
  margin-top: 0.25rem;
  margin-left: 0;
`

// ─── Skills ───────────────────────────────────────────────────────────────────

const StackHeading = styled.p`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`

const SkillGroupRow = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: 1rem;
  padding-bottom: 1rem;
  display: grid;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: 180px 1fr;
  }
`

const SkillCategoryHeading = styled.p`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 0.9rem;
  margin: 0;
`

const SkillItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: flex-start;
`

// ─── Component ────────────────────────────────────────────────────────────────

export function About() {
  const t = useTranslations('about')

  return (
    <AboutSection id="about">
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

          <TwoColGrid>
            <Reveal delay={100}>
              <ImagePlaceholder aria-label="Workspace image placeholder">
                workspace
              </ImagePlaceholder>
            </Reveal>

            <div>
              <Reveal delay={100}>
                {BIO.map((paragraph, i) => (
                  <BioParagraph key={i}>{paragraph}</BioParagraph>
                ))}
              </Reveal>

              <Reveal delay={200}>
                <LanguageList aria-label={t('languagesHeading')}>
                  {LANGUAGES.map((lang) => (
                    <LanguageItem key={lang.name}>
                      <LanguageTerm>{lang.name}</LanguageTerm>
                      <LanguageDesc>{lang.level}</LanguageDesc>
                    </LanguageItem>
                  ))}
                </LanguageList>
              </Reveal>
            </div>
          </TwoColGrid>

          <Spacer $size={20} />

          <Reveal delay={100}>
            <StackHeading>{t('stackHeading')}</StackHeading>
          </Reveal>

          <Spacer $size={8} />

          {SKILL_GROUPS.map((group, i) => (
            <Reveal key={group.category} delay={100 + i * 100}>
              <SkillGroupRow>
                <SkillCategoryHeading>{group.category}</SkillCategoryHeading>
                <SkillItems>
                  {group.items.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </SkillItems>
              </SkillGroupRow>
            </Reveal>
          ))}
        </Box>
      </Container>
    </AboutSection>
  )
}
