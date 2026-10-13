'use client';

import { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';
import { Link } from '@/i18n/navigation';
import { type } from '@/styles/typography';
import { useConsent } from './ConsentProvider';

const enter = keyframes`from { opacity: 0; transform: translateY(0.75rem); } to { opacity: 1; transform: none; }`;
const fade = keyframes`from { opacity: 0; } to { opacity: 1; }`;

/**
 * Non-modal: no scrim, the page stays usable. Accept and Reject carry equal visual weight
 * (Czech DPA guidance — refusing must be as easy as agreeing).
 */
const Card = styled.section`
  position: fixed;
  z-index: 45; /* above content, below the nav (50) and mobile sheet (60) */
  left: 0.75rem;
  right: 0.75rem;
  bottom: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 0.75rem 2.5rem oklch(0.1 0.02 255 / 30%);
  animation: ${enter} 320ms ${({ theme }) => theme.motion.ease};

  ${({ theme }) => theme.mq.sm} {
    left: 1.5rem;
    right: auto;
    bottom: 1.5rem;
    width: 24rem;
  }

  ${({ theme }) => theme.mq.reducedMotion} {
    animation: ${fade} 200ms ease;
  }
`;

const Title = styled.h2`
  ${type.titleM}
  color: ${({ theme }) => theme.colors.fg};
`;

const Body = styled.p`
  ${type.bodyS}
  color: ${({ theme }) => theme.colors.fgSecondary};
  margin-top: 0.375rem;

  a {
    color: ${({ theme }) => theme.colors.accent};
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }
`;

const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`;

export function ConsentBanner() {
  const t = useTranslations('consent');
  const { bannerOpen, analytics, accept, reject } = useConsent();
  const cardRef = useRef<HTMLElement>(null);

  // Reopened from "Cookie settings": move focus to the banner so keyboard users land on it.
  useEffect(() => {
    if (bannerOpen && analytics !== null) cardRef.current?.focus();
  }, [bannerOpen, analytics]);

  if (!bannerOpen) return null;

  return (
    <Card ref={cardRef} aria-labelledby="consent-title" tabIndex={-1}>
      <div>
        <Title id="consent-title">{t('title')}</Title>
        <Body>
          {t.rich('body', {
            link: (chunks) => <Link href="/privacy">{chunks}</Link>,
          })}
        </Body>
      </div>
      <Actions>
        <Button $variant="secondary" type="button" onClick={reject}>
          {t('reject')}
        </Button>
        <Button $variant="secondary" type="button" onClick={accept}>
          {t('accept')}
        </Button>
      </Actions>
    </Card>
  );
}
