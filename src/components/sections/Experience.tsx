'use client'

import styled from '@emotion/styled'
import { useTranslations } from 'next-intl'
import { Container, Section } from '@/components/layout'
import { Reveal } from '@/components/Reveal'
import { SectionHeader, StackList } from '@/components/ui'
import { EXPERIENCE } from '@/data/experience'
import { type } from '@/styles/typography'

// ─── Timeline ─────────────────────────────────────────────────────────────────

const Timeline = styled.ol`
  position: relative;
  margin-top: clamp(3rem, 2rem + 3vw, 4.5rem);
  padding-left: 2rem;

  /* The rail */
  &::before {
    content: '';
    position: absolute;
    left: 4px;
    top: 0.75rem;
    bottom: 0;
    width: 1px;
    background: linear-gradient(
      to bottom,
      ${({ theme }) => theme.colors.accent},
      ${({ theme }) => theme.colors.border} 40%
    );
  }

  ${({ theme }) => theme.mq.md} {
    padding-left: 2.5rem;
  }
`

const Employer = styled.li`
  position: relative;

  & + & {
    margin-top: clamp(3rem, 2.5rem + 2vw, 4rem);
  }
`

const Dot = styled.span<{ $current: boolean }>`
  position: absolute;
  left: calc(-2rem + 0px);
  top: 0.6rem;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${({ theme, $current }) => ($current ? theme.colors.accent : theme.colors.canvas)};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  box-shadow: ${({ theme, $current }) => ($current ? `0 0 0 5px ${theme.colors.accentSubtle}` : 'none')};

  ${({ theme }) => theme.mq.md} {
    left: -2.5rem;
  }
`

const EmployerHeader = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 0.375rem;

  ${({ theme }) => theme.mq.md} {
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
    gap: 2rem;
  }
`

const Company = styled.h3`
  ${type.titleL}
  color: ${({ theme }) => theme.colors.fg};
`

const Title = styled.p`
  ${type.bodyM}
  color: ${({ theme }) => theme.colors.fgSecondary};
  margin-top: 0.25rem;
`

const Period = styled.p`
  ${type.monoS}
  color: ${({ theme }) => theme.colors.accent};
  white-space: nowrap;
`

// ─── Projects ─────────────────────────────────────────────────────────────────

const Projects = styled.ul`
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;

  ${({ theme }) => theme.mq.lg} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

/* Fills its grid cell, so cards in the same row share a height; the stack line pins to the bottom. */
const Project = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  height: 100%;
  padding: 1.25rem 1.5rem 1.375rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  transition: border-color ${({ theme }) => theme.motion.fast} ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }
`

const Client = styled.h4`
  ${type.titleM}
  color: ${({ theme }) => theme.colors.fg};

  span {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-weight: 400;
    color: ${({ theme }) => theme.colors.accent};
    margin-right: 0.5rem;
  }
`

const ProjectRole = styled.p`
  ${type.label}
  color: ${({ theme }) => theme.colors.fg};
`

const ProjectDescription = styled.p`
  ${type.bodyS}
  color: ${({ theme }) => theme.colors.fgSecondary};
`

const ProjectStack = styled.div`
  margin-top: auto;
  padding-top: 0.75rem;
`

// ─── Component ────────────────────────────────────────────────────────────────

export function Experience() {
  const t = useTranslations('experience')

  return (
    <Section id="experience" aria-labelledby="experience-title">
      <Container>
        <Reveal>
          <SectionHeader
            index={t('index')}
            label={t('slug')}
            title={t('heading')}
            titleId="experience-title"
            lead={t('lead')}
          />
        </Reveal>

        <Timeline role="list">
          {EXPERIENCE.map((employer) => (
            <Employer key={employer.id}>
              <Dot $current={employer.end === null} aria-hidden="true" />
              <Reveal>
                <EmployerHeader>
                  <div>
                    <Company>{employer.company}</Company>
                    <Title>{t(`employers.${employer.id}.role`)}</Title>
                  </div>
                  <Period>
                    {employer.start} — {employer.end ?? t('present')}
                  </Period>
                </EmployerHeader>
              </Reveal>

              <Projects role="list">
                {employer.projects.map((project, i) => (
                  <Reveal key={project.id} as="li" delay={i * 70}>
                    <Project>
                      <Client>
                        <span aria-hidden="true">&gt;</span>
                        {project.client}
                      </Client>
                      <ProjectRole>{t(`projects.${project.id}.role`)}</ProjectRole>
                      <ProjectDescription>{t(`projects.${project.id}.description`)}</ProjectDescription>
                      <ProjectStack>
                        <StackList items={project.stack} label={t('stackLabel')} />
                      </ProjectStack>
                    </Project>
                  </Reveal>
                ))}
              </Projects>
            </Employer>
          ))}
        </Timeline>
      </Container>
    </Section>
  )
}
