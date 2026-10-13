'use client';

import styled from '@emotion/styled';
import { Button } from '@/components/ui';
import { Container } from './Container';
import { Link } from '@/i18n/navigation';
import { type } from '@/styles/typography';

const Wrap = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  padding-block: clamp(4rem, 3rem + 6vw, 8rem);
  min-height: 60vh;
`;

const Code = styled.p`
  ${type.monoEyebrow}
  color: ${({ theme }) => theme.colors.accent};
`;

const Title = styled.h1`
  ${type.displayL}
  color: ${({ theme }) => theme.colors.fg};
`;

const Body = styled.p`
  ${type.bodyL}
  color: ${({ theme }) => theme.colors.fgSecondary};
  max-width: 36rem;
  margin-bottom: 0.5rem;
`;

export function NotFoundContent({ title, body, homeLabel }: { title: string; body: string; homeLabel: string }) {
  return (
    <Container>
      <Wrap>
        <Code>404</Code>
        <Title>{title}</Title>
        <Body>{body}</Body>
        <Button asChild>
          <Link href="/">{homeLabel}</Link>
        </Button>
      </Wrap>
    </Container>
  );
}
