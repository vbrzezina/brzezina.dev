'use client'

import styled from '@emotion/styled'
import { useTranslations } from 'next-intl'
import { Container, Box, Spacer } from '@/components/layout'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'

// ─── Data types ───────────────────────────────────────────────────────────────

interface Project {
  name: string
  role: string
  description?: string
  stack: string[]
}

interface Role {
  company: string
  position: string
  period: string
  projects: Project[]
}

const EXPERIENCE: Role[] = [
  {
    company: 'EPAM Systems',
    position: 'Senior Software Engineer',
    period: '2022 — Present',
    projects: [
      {
        name: 'Client Portal Platform',
        role: 'Lead frontend engineer',
        description:
          'Large-scale enterprise portal serving thousands of users across Europe. Led migration from legacy Angular to React + TypeScript.',
        stack: ['TypeScript', 'React', 'Node.js', 'AWS', 'PostgreSQL'],
      },
      {
        name: 'Data Pipeline Dashboard',
        role: 'Lead full-stack engineer',
        description:
          'Real-time monitoring dashboard for complex ETL pipelines with 200+ data sources.',
        stack: ['React', 'TypeScript', 'Python', 'AWS', 'DynamoDB'],
      },
      {
        name: 'DevOps Automation Tooling',
        role: 'Contributing engineer',
        description:
          'Internal developer platform for infrastructure provisioning and deployment automation.',
        stack: ['Node.js', 'AWS', 'Terraform', 'Docker'],
      },
    ],
  },
  {
    company: "Starky's Club",
    position: 'Lead Frontend Developer',
    period: '2019 — 2022',
    projects: [
      {
        name: 'E-commerce Platform',
        role: 'Lead frontend developer',
        description:
          'Full e-commerce replatform for a major Czech retailer. Built product discovery, checkout, and account management.',
        stack: ['React', 'TypeScript', 'GraphQL', 'Node.js', 'PostgreSQL'],
      },
      {
        name: 'Mobile App',
        role: 'Lead mobile developer',
        description:
          'Cross-platform mobile app for loyalty programme management. Published on App Store and Play Store.',
        stack: ['React Native', 'TypeScript', 'Node.js', 'REST API'],
      },
    ],
  },
  {
    company: 'Etnetera a.s.',
    position: 'Frontend Developer',
    period: '2017 — 2019',
    projects: [
      {
        name: 'Banking Portal',
        role: 'Frontend developer',
        description:
          'Digital banking portal for a major Czech bank. Built account overview, transaction history, and payment flows.',
        stack: ['React', 'TypeScript', 'Java', 'REST API'],
      },
      {
        name: 'CMS Migration',
        role: 'Contributing engineer',
        description:
          'Migrated marketing sites from a legacy CMS to a modern headless stack.',
        stack: ['Next.js', 'TypeScript', 'Contentful'],
      },
    ],
  },
]

// ─── Styled components ────────────────────────────────────────────────────────

const ExperienceSection = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const Timeline = styled.ol`
  position: relative;
  list-style: none;
  padding: 0;
  margin: 0;
  border-left: 2px solid ${({ theme }) => theme.colors.primary};
  padding-left: ${({ theme }) => theme.space[8]};
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
`

const RoleItem = styled.li`
  position: relative;
`

const BulletDot = styled.span`
  position: absolute;
  left: calc(-${({ theme }) => theme.space[8]} - 5px);
  top: 0.375rem;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
`

const CompanyRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 0.5rem;
`

const CompanyName = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.foreground};
  margin: 0;
`

const PeriodBadge = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.primary};
  white-space: nowrap;
`

const PositionText = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.mutedForeground};
  margin: 0.25rem 0 0;
`

const ProjectsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  padding-left: 1.25rem;
`

const ProjectItem = styled.li``

const ProjectName = styled.h4`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 1rem;
  margin: 0;

  &::before {
    content: '› ';
    color: ${({ theme }) => theme.colors.primary};
    font-family: ${({ theme }) => theme.fonts.mono};
  }
`

const ProjectRole = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.mutedForeground};
  margin: 0.25rem 0 0;
`

const ProjectDescription = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.mutedForeground};
  margin: 0.25rem 0 0;
`

const StackTags = styled.p`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.mutedForeground};
  margin: 0.5rem 0 0;
`

// ─── Component ────────────────────────────────────────────────────────────────

export function Experience() {
  const t = useTranslations('experience')

  return (
    <ExperienceSection id="experience">
      <Container>
        <Box $py={24}>
          <SectionHeading
            index={t('index')}
            slug={t('slug')}
            title={t('heading')}
            lead={t('lead')}
          />

          <Spacer $size={16} />

          <Timeline>
            {EXPERIENCE.map((role, i) => (
              <Reveal key={role.company} as={RoleItem} delay={i * 100}>
                <BulletDot aria-hidden="true" />

                <CompanyRow>
                  <CompanyName>{role.company}</CompanyName>
                  <PeriodBadge>{role.period}</PeriodBadge>
                </CompanyRow>

                <PositionText>{role.position}</PositionText>

                <ProjectsList>
                  {role.projects.map((project) => (
                    <ProjectItem key={project.name}>
                      <ProjectName>{project.name}</ProjectName>
                      <ProjectRole>{project.role}</ProjectRole>
                      {project.description && (
                        <ProjectDescription>{project.description}</ProjectDescription>
                      )}
                      <StackTags>{project.stack.join(' · ')}</StackTags>
                    </ProjectItem>
                  ))}
                </ProjectsList>
              </Reveal>
            ))}
          </Timeline>
        </Box>
      </Container>
    </ExperienceSection>
  )
}
