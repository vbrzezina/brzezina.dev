'use client';

import styled from '@emotion/styled';
import { useTranslations } from 'next-intl';
import { type } from '@/styles/typography';

/** First focusable element on every page — rendered by the layout, ahead of the consent banner. */
const Link = styled.a`
  ${type.label}
  position: fixed;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 100;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.onAccent};
  transform: translateY(-200%);

  &:focus-visible {
    transform: none;
  }
`;

export function SkipLink() {
  const t = useTranslations('a11y');
  return <Link href="#main">{t('skip')}</Link>;
}
