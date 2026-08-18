'use client';

import styled from '@emotion/styled';
import { useTranslations } from 'next-intl';
import { Container, Box, Spacer } from '@/components/layout';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { darkTheme as theme } from '@/app/theme';

const { colors, fonts, radius } = theme;

const SERVICES = [
  {
    number: '01',
    title: 'Full-stack TypeScript / React',
    description:
      'Frontend architecture, component systems, performance optimisation, accessibility. Next.js App Router, React, Emotion/MUI.',
  },
  {
    number: '02',
    title: 'Backend & APIs',
    description:
      'Node.js backends, REST and GraphQL APIs, NestJS, TypeORM, database design and optimisation.',
  },
  {
    number: '03',
    title: 'AWS Serverless',
    description:
      'Lambda, Step Functions, API Gateway, Cognito, S3, CDK. End-to-end cloud architecture for serverless products.',
  },
] as const;

const Section = styled.section`
  border-bottom: 1px solid ${colors.border};
`;

const CardsGrid = styled.div`
  background: ${colors.border};
  gap: 1px;
  display: grid;
  grid-template-columns: 1fr;
  border: 1px solid ${colors.border};
  border-radius: ${radius.base};
  overflow: hidden;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ServiceCard = styled.div`
  background: ${colors.background};
  padding: 2rem;
  transition: background 200ms;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;

  &:hover {
    background: ${colors.surface};
  }
`;

const ServiceNumber = styled.span`
  font-family: ${fonts.mono};
  font-size: 0.75rem;
  color: ${colors.primary};
  letter-spacing: 0.1em;
`;

const ServiceTitle = styled.h3`
  font-family: ${fonts.display};
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.foreground};
  margin: 0;
`;

const ServiceDescription = styled.p`
  font-family: ${fonts.sans};
  font-size: 0.9375rem;
  color: ${colors.mutedForeground};
  line-height: 1.65;
  margin: 0;
`;

const REVEAL_DELAYS = [0, 100, 200] as const;

export function Services() {
  const t = useTranslations('services');

  return (
    <Section id="services">
      <Container>
        <Box $py={24}>
          <SectionHeading
            index={t('index')}
            slug={t('slug')}
            title={t('heading')}
            lead={t('lead')}
          />
          <Spacer $size={16} />
          <CardsGrid>
            {SERVICES.map((service, i) => (
              <Reveal key={service.number} delay={REVEAL_DELAYS[i]}>
                <ServiceCard>
                  <ServiceNumber>{service.number}</ServiceNumber>
                  <ServiceTitle>{service.title}</ServiceTitle>
                  <ServiceDescription>{service.description}</ServiceDescription>
                </ServiceCard>
              </Reveal>
            ))}
          </CardsGrid>
        </Box>
      </Container>
    </Section>
  );
}
