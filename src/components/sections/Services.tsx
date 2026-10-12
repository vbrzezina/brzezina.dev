'use client';

import styled from '@emotion/styled';
import { useTranslations } from 'next-intl';
import { Container, Section } from '@/components/layout';
import { Reveal } from '@/components/Reveal';
import { Icon, SectionHeader, StackList } from '@/components/ui';
import { ENGAGEMENT_FACTS, SERVICES } from '@/data/services';
import { type } from '@/styles/typography';

const Cards = styled.ul`
  display: grid;
  gap: 1rem;
  margin-top: clamp(3rem, 2rem + 3vw, 4.5rem);

  ${({ theme }) => theme.mq.md} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.25rem;
  }
`;

const CardItem = styled(Reveal)`
  display: flex;
`;

const Card = styled.article`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1.75rem 1.75rem 2rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  transition:
    border-color ${({ theme }) => theme.motion.fast} ease,
    transform 250ms ${({ theme }) => theme.motion.ease};

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
    transform: translateY(-2px);
  }

  ${({ theme }) => theme.mq.reducedMotion} {
    &:hover {
      transform: none;
    }
  }
`;

const Counter = styled.p`
  ${type.monoS}
  color: ${({ theme }) => theme.colors.accent};
`;

const Title = styled.h3`
  ${type.titleL}
  color: ${({ theme }) => theme.colors.fg};
  margin-top: 2.5rem;
`;

const Description = styled.p`
  ${type.bodyS}
  color: ${({ theme }) => theme.colors.fgSecondary};
  margin-top: 0.75rem;
  flex: 1;
`;

const StackBlock = styled.div`
  margin-top: 1.75rem;
  padding-top: 1.25rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StackLabel = styled.p`
  ${type.monoEyebrow}
  color: ${({ theme }) => theme.colors.fgTertiary};
`;

const Facts = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 2.5rem;
  margin-top: 2.5rem;
`;

const Fact = styled.li`
  ${type.label}
  display: flex;
  align-items: center;
  gap: 0.625rem;
  color: ${({ theme }) => theme.colors.fgSecondary};

  svg {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export function Services() {
  const t = useTranslations('services');

  return (
    <Section id="services" aria-labelledby="services-title">
      <Container>
        <Reveal>
          <SectionHeader
            index={t('index')}
            label={t('slug')}
            title={t('heading')}
            titleId="services-title"
            lead={t('lead')}
          />
        </Reveal>

        <Cards role="list">
          {SERVICES.map((service, i) => (
            <CardItem key={service.id} as="li" delay={i * 80}>
              <Card>
                <Counter aria-hidden="true">{String(i + 1).padStart(2, '0')}</Counter>
                <Title>{t(`items.${service.id}.title`)}</Title>
                <Description>{t(`items.${service.id}.description`)}</Description>
                <StackBlock>
                  <StackLabel>{t('stackLabel')}</StackLabel>
                  <StackList items={service.stack} />
                </StackBlock>
              </Card>
            </CardItem>
          ))}
        </Cards>

        <Reveal delay={120}>
          <Facts role="list">
            {ENGAGEMENT_FACTS.map((fact) => (
              <Fact key={fact.id}>
                <Icon name={fact.icon} size={18} />
                {t(`facts.${fact.id}`)}
              </Fact>
            ))}
          </Facts>
        </Reveal>
      </Container>
    </Section>
  );
}
